/**
 * supabase/migrations の UPDATE マイグレーションから CARD_INFO_OVERRIDES を生成する
 *   node scripts/generate-card-info-overrides-from-sql.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.join(process.cwd());
const migDir = path.join(root, 'supabase', 'migrations');
const files = [
  '20260402140000_update_first_expansion_cards.sql',
  '20260402150000_update_second_expansion_cards.sql',
  '20260402160000_update_third_expansion_cards.sql',
  '20260402170000_update_fourth_expansion_cards.sql',
];

function parseBlocks(content) {
  const parts = content.split(/\n(?=UPDATE cards SET\n)/);
  const rows = [];
  for (const part of parts) {
    if (!part.includes('UPDATE cards SET')) continue;
    const effMatch = part.match(/effect_text = \$([^\$]+)\$\r?\n([\s\S]*?)\r?\n\$\1\$\s*,/);
    if (!effMatch) {
      console.warn('skip (no effect_text):', part.slice(0, 80));
      continue;
    }
    const effect_text = effMatch[2];
    const after = part.slice(part.indexOf(effMatch[0]) + effMatch[0].length);
    const costM = after.match(/cost = (\d+)/);
    const powerM = after.match(/power = (NULL|\d+)/);
    const raceM = after.match(/race = (NULL|'(?:[^']|'')*')\s*,/);
    const cardTypeM = after.match(/card_type = '([^']+)'\s*,/);
    const uniqueM = after.match(/is_unique = (true|false)/);
    const whereM = part.match(/WHERE name = '((?:[^']|'')*)'/);
    if (!whereM || !costM || !powerM || !cardTypeM || !uniqueM) {
      console.warn('skip (parse):', part.slice(0, 100));
      continue;
    }
    const name = whereM[1].replace(/''/g, "'");
    const cost = parseInt(costM[1], 10);
    const power = powerM[1] === 'NULL' ? null : parseInt(powerM[1], 10);
    let race = null;
    if (raceM && raceM[1] !== 'NULL') {
      const raw = raceM[1];
      race = raw.slice(1, -1).replace(/''/g, "'");
    }
    const card_type = cardTypeM[1];
    const is_unique = uniqueM[1] === 'true';
    rows.push({ name, effect_text, cost, power, race, card_type, is_unique });
  }
  return rows;
}

function tsEscapeKey(name) {
  return JSON.stringify(name);
}

function buildOverrideObjectLiteral(row) {
  const parts = [];
  parts.push(`effect_text: ${JSON.stringify(row.effect_text)}`);
  parts.push(`cost: ${row.cost}`);
  parts.push(`power: ${row.power === null ? 'null' : row.power}`);
  parts.push(`race: ${row.race === null ? 'null' : JSON.stringify(row.race)}`);
  parts.push(`card_type: ${JSON.stringify(row.card_type)}`);
  parts.push(`is_unique: ${row.is_unique}`);
  return `{\n      ${parts.join(',\n      ')},\n    }`;
}

const all = [];
const seen = new Set();
for (const f of files) {
  const p = path.join(migDir, f);
  if (!fs.existsSync(p)) {
    console.error('missing', p);
    process.exit(1);
  }
  const blocks = parseBlocks(fs.readFileSync(p, 'utf8'));
  for (const r of blocks) {
    if (seen.has(r.name)) {
      console.warn('duplicate name (later wins):', r.name);
    }
    seen.add(r.name);
    all.push(r);
  }
}

const entries = all.map((r) => `    ${tsEscapeKey(r.name)}: ${buildOverrideObjectLiteral(r)},`).join('\n');

const out = `import type { Card } from '../types/card';

/**
 * DB の \`cards.name\` をキーに、表示用に上書きするフィールド。
 * Supabase の値より優先される。
 *
 * 内容は次のマイグレーション由来（手動編集せず \`scripts/generate-card-info-overrides-from-sql.mjs\` で再生成）:
 *   - 20260402140000_update_first_expansion_cards.sql
 *   - 20260402150000_update_second_expansion_cards.sql
 *   - 20260402160000_update_third_expansion_cards.sql
 *   - 20260402170000_update_fourth_expansion_cards.sql
 *
 * 画像は cardImageManifest.ts の CARD_IMAGE_MANIFEST を参照。
 */
export type CardInfoOverride = Partial<Omit<Card, 'id' | 'name'>>;

export const CARD_INFO_OVERRIDES: Record<string, CardInfoOverride> = {
${entries}
};

export function applyCardInfoOverrides<C extends Card>(card: C): C {
  const o = CARD_INFO_OVERRIDES[card.name];
  if (!o) return card;
  return { ...card, ...o };
}
`;

const outPath = path.join(root, 'src', 'lib', 'cardInfoOverrides.ts');
fs.writeFileSync(outPath, out, 'utf8');
console.log('Wrote', all.length, 'card overrides to', outPath);
