/**
 * 一弾カードを「カード名.jpg」に差し替えたあと、旧ファイル名だけを削除する。
 *   node scripts/prune-legacy-first-expansion-images.mjs
 *
 * public/card_illustrations/ に存在する場合のみ削除（無ければスキップ）。
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const dir = path.join(root, 'public', 'card_illustrations');

/** マニフェストで「カード名.jpg」に統一する前の一弾向けファイル名 */
const LEGACY_FIRST_EXPANSION_FILES = [
  'エナジーボール_(2).png',
  'メルトパンチ.png',
  'デカクラクション_(2).png',
  '墓起こし.png',
  '電線復帰.png',
  '王家の宝箱.png',
  'セモタレエビ.png',
  'トンカチヘッドシャーク.png',
  'メガロエンペラー.png',
];

if (!fs.existsSync(dir)) {
  console.log('public/card_illustrations/ がありません。スキップしました。');
  process.exit(0);
}

let removed = 0;
for (const name of LEGACY_FIRST_EXPANSION_FILES) {
  const p = path.join(dir, name);
  if (fs.existsSync(p) && fs.statSync(p).isFile()) {
    fs.unlinkSync(p);
    console.log('削除:', name);
    removed += 1;
  }
}

if (removed === 0) {
  console.log('削除対象の旧ファイルは public/card_illustrations/ に見つかりませんでした（既に削除済みか未配置）。');
} else {
  console.log(`合計 ${removed} 件を削除しました。`);
}
