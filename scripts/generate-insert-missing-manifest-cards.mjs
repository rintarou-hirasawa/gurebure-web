/**
 * cardImageManifest の各カードについて、UPDATE マイグレから最終状態を抽出し
 * INSERT ... WHERE NOT EXISTS 用 SQL を生成する。
 *
 *   node scripts/generate-insert-missing-manifest-cards.mjs
 */
import fs from 'node:fs';

const root = new URL('..', import.meta.url).pathname.replace(/\/$/, '').replace(/^\//, '');
const winRoot = root.startsWith('c:') || root.startsWith('C:') ? root : `/${root}`;

function read(p) {
  return fs.readFileSync(p, 'utf8');
}

const manifestPath = `${winRoot}/src/lib/cardImageManifest.ts`;
const manifestText = read(manifestPath);
const names = [];
for (const m of manifestText.matchAll(/"([^"]+)":\s*"[^"]+"/g)) {
  names.push(m[1]);
}
if (names.length === 0) {
  for (const m of manifestText.matchAll(/'([^']+)':\s*'[^']+'/g)) {
    names.push(m[1]);
  }
}

const updateFiles = [
  `${winRoot}/supabase/migrations/20260402140000_update_first_expansion_cards.sql`,
  `${winRoot}/supabase/migrations/20260402150000_update_second_expansion_cards.sql`,
  `${winRoot}/supabase/migrations/20260402160000_update_third_expansion_cards.sql`,
];

const byName = Object.create(null);

for (const fp of updateFiles) {
  const sql = read(fp);
  const re =
    /UPDATE cards SET\s+effect_text = \$[a-z0-9]+\$\n([\s\S]*?)\n\$[a-z0-9]+\$,\s+cost = (\d+),\s+power = (NULL|\d+),\s+race = (NULL|'(?:[^']|'')*'),\s+card_type = '([^']*)',\s+is_unique = (true|false)\s+WHERE name = '((?:[^']|'')*)';/g;
  let m;
  while ((m = re.exec(sql)) !== null) {
    let eff = m[1];
    const cost = m[2];
    const power = m[3];
    const raceRaw = m[4];
    const cardType = m[5];
    const isUnique = m[6];
    let name = m[7].replace(/''/g, "'");
    byName[name] = {
      effect_text: eff,
      cost,
      power,
      race: raceRaw,
      card_type: cardType,
      is_unique: isUnique,
      expansion: fp.includes('first') ? '一弾' : fp.includes('second') ? '二弾' : '三弾',
    };
  }
}

const missing = names.filter((n) => !byName[n]);
if (missing.length) {
  console.error('UPDATE マイグレに無いマニフェスト名:', missing.join(', '));
  process.exit(1);
}

function escSqlStr(s) {
  return s.replace(/'/g, "''");
}

let out = `/*
  # 画像マニフェストに対応する cards 行が無い場合のみ挿入

  - 空の DB や部分適用で先行 INSERT が無かった行を補う
  - 既に同名があれば何もしない（WHERE NOT EXISTS）
  - 内容は 20260402140000 / 20260402150000 / 20260402160000 の UPDATE と整合
*/

INSERT INTO cards (name, card_type, cost, race, power, effect_text, expansion, is_unique, image_url, tribes)
SELECT
  v.name,
  v.card_type,
  v.cost,
  CASE WHEN v.race = '' THEN NULL ELSE v.race END,
  CASE WHEN v.power IS NULL OR v.power = '' THEN NULL ELSE v.power::integer END,
  v.effect_text,
  v.expansion,
  v.is_unique,
  '',
  NULL
FROM (
VALUES
`;

const rows = names.map((name) => {
  const r = byName[name];
  const race =
    r.race === 'NULL' ? 'NULL' : escSqlStr(r.race.slice(1, -1).replace(/''/g, "'"));
  const power =
    r.power === 'NULL' ? 'NULL::integer' : r.power;
  const isU = r.is_unique === 'true';
  const eff = escSqlStr(r.effect_text);
  const exp = escSqlStr(r.expansion);
  return `  (${escSqlStr(name)}::text, ${escSqlStr(r.card_type)}::text, ${r.cost}::integer, ${
    race === 'NULL' ? 'NULL::text' : `'${race}'::text`
  }, ${power}, '${eff}'::text, '${exp}'::text, ${isU}::boolean)`;
});

out += rows.join(',\n');
out += `
) AS v(name, card_type, cost, race, power, effect_text, expansion, is_unique)
WHERE NOT EXISTS (SELECT 1 FROM cards c WHERE c.name = v.name);
`;

const outPath = `${winRoot}/supabase/migrations/20260402180000_insert_missing_manifest_cards.sql`;
fs.writeFileSync(outPath, out, 'utf8');
console.log('Wrote', outPath, names.length, 'rows');
