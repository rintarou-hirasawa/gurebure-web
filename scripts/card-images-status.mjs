/**
 * ローカル画像と DB のカード名を照合する（任意）。
 * DATABASE_URL があるときだけ DB に接続する。なければフォルダ内ファイル一覧だけ出す。
 *
 *   npm run card-images:status
 */

import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import pg from 'pg';

const root = process.cwd();
const illDir = path.join(root, 'public', 'card_illustrations');
const manifestPath = path.join(root, 'src', 'lib', 'cardImageManifest.ts');

function parseManifest(ts) {
  const map = Object.create(null);
  for (const line of ts.split('\n')) {
    const t = line.trim();
    if (t.startsWith('//') || t.startsWith('*') || t.startsWith('/*')) continue;
    const m = t.match(/^["']([^"']+)["']:\s*["']([^"']+)["']/);
    if (m) map[m[1]] = m[2];
  }
  return map;
}

function localFileExists(relFromPublic) {
  const p = path.join(root, 'public', relFromPublic.replace(/^\//, ''));
  return fs.existsSync(p) && fs.statSync(p).isFile();
}

function resolveMappedFile(value) {
  const v = (value || '').trim();
  if (!v || v.includes('..')) return null;
  if (v.startsWith('http://') || v.startsWith('https://')) return 'remote';
  if (v.startsWith('/')) return localFileExists(v) ? 'ok' : 'missing';
  return localFileExists(`/card_illustrations/${v}`) ? 'ok' : 'missing';
}

function defaultNameFiles(name) {
  const enc = encodeURIComponent(name);
  const jpg = `card_illustrations/${enc}.jpg`;
  const png = `card_illustrations/${enc}.png`;
  const j = localFileExists(`/${jpg}`);
  const p = localFileExists(`/${png}`);
  if (j) return 'ok (.jpg)';
  if (p) return 'ok (.png)';
  return 'なし';
}

const manifest = parseManifest(fs.readFileSync(manifestPath, 'utf8'));

console.log('=== カード画像（リポジトリ内） ===\n');
console.log(`マッピング件数: ${Object.keys(manifest).length}`);
console.log(`画像フォルダ: ${illDir}\n`);

const imgs = fs.existsSync(illDir)
  ? fs.readdirSync(illDir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  : [];
console.log(`フォルダ内の画像ファイル: ${imgs.length} 件`);
if (imgs.length && imgs.length <= 30) {
  for (const f of imgs) console.log(`  - ${f}`);
} else if (imgs.length > 30) {
  for (const f of imgs.slice(0, 15)) console.log(`  - ${f}`);
  console.log(`  ... 他 ${imgs.length - 15} 件`);
}
console.log('');

const cs = process.env.DATABASE_URL?.trim();
if (!cs) {
  console.log('DATABASE_URL が無いため、DB との照合はスキップしました。');
  console.log('照合するには .env に DATABASE_URL を設定してから再実行してください。\n');
  process.exit(0);
}

const client = new pg.Client({ connectionString: cs });
try {
  await client.connect();
} catch (e) {
  console.error('DB に接続できませんでした（オフラインや DNS の問題の可能性）。フォルダ一覧のみ表示して終了します。\n');
  console.error(e instanceof Error ? e.message : e);
  process.exit(0);
}

try {
  const { rows } = await client.query(
    `select distinct name from cards where name is not null and trim(name) <> '' order by name`
  );
  const names = rows.map((r) => r.name);

  let ok = 0;
  let miss = 0;
  const missing = [];

  for (const name of names) {
    const mapped = manifest[name];
    let st;
    if (mapped) {
      st = resolveMappedFile(mapped);
      if (st === 'remote') {
        ok++;
        continue;
      }
      if (st === 'ok') {
        ok++;
        continue;
      }
    }
    if (localFileExists('/image.png')) {
      ok++;
      continue;
    }
    const d = defaultNameFiles(name);
    if (d.startsWith('ok')) {
      ok++;
    } else {
      miss++;
      missing.push(name);
    }
  }

  console.log(`DB のカード名: ${names.length} 件`);
  console.log(`画像あり（マッピング・デフォルト名・remote）: ${ok} 件`);
  console.log(`画像ファイル未検出: ${miss} 件\n`);

  if (missing.length) {
    console.log('--- 未検出のカード（cardImageManifest.ts に追記するか、デフォルト名でファイルを置く）---');
    for (const n of missing.slice(0, 80)) {
      console.log(`  ${n}`);
    }
    if (missing.length > 80) console.log(`  ... 他 ${missing.length - 80} 件`);
  }
} finally {
  await client.end().catch(() => {});
}
