/**
 * LINE_ALBUM_第1弾プロキシ…_N.jpg（N=1..40）を、DB の一弾カード名順で
 * public/card_illustrations/{カード名}.jpg にコピーする。
 *
 *   node scripts/import-first-expansion-line-album.mjs
 *
 * 画像元: public/card_illustrations に LINE_* がある場合はそれを優先、なければ dist/card_illustrations
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();

/** supabase/migrations の一弾 UPDATE … WHERE name IN (…) の並び（40枚） */
const FIRST_EXPANSION_CARD_NAMES = [
  'エナジーボール',
  'メルト・パンチ',
  'デカクラクション',
  '墓起こし',
  '電線復帰',
  '王家の宝箱',
  'セモタレエビ',
  'トンカチヘッド・シャーク',
  '大海覇者 メガロエンペラー',
  '闇取り引きのディモン',
  '大空の使徒 デル・ローエ',
  'アルターナイツ ガーウィン',
  'アルターナイツ トリストラ',
  '飛雷硬化 バリズム',
  '豪快迅雷 ゴロツキ',
  '爆大電磁 ドン・エレキ',
  '見習い電導師 モーリス',
  '見習い電導師 シロビシン',
  '電導師 キツネミア',
  '電導師 フェネックス',
  '一流電導師 テン・クロスタ',
  '稲妻小僧 ビリザキッド',
  '感電走族 パラリライダー',
  'ソウオンカジキ',
  '炎音 紅蝶羽',
  '見極める主審 デラシャウト',
  '暴走する前歯 マモット',
  '爆音狂竜 ブラストザウルス',
  '魂の精霊',
  '奇跡の精霊',
  '精霊の伝い手 フエセプス',
  '精霊の守り手 ディフィシウス',
  '精霊の担い手 ギセウス',
  '精霊神話「第1章―光あれ」',
  '精霊神 ファーザーズ・ゼウス',
  '破壊砲牙龍 ディクラスター・ドラゴン',
  '大爆発',
  '秘術師 フィーデン・ニトロ',
  '剛弾 ファウスト・ガントレット',
  '閉ざされし暗黒の扉',
];

const ALBUM_PREFIX = 'LINE_ALBUM_第1弾プロキシ(元画像＋カード画像)_260421_';

function findSourceDir() {
  const pub = path.join(root, 'public', 'card_illustrations');
  const dist = path.join(root, 'dist', 'card_illustrations');
  const test = (dir) => {
    const p = path.join(dir, `${ALBUM_PREFIX}1.jpg`);
    return fs.existsSync(p) ? dir : null;
  };
  return test(pub) || test(dist);
}

const outDir = path.join(root, 'public', 'card_illustrations');
const srcDir = findSourceDir();

if (!srcDir) {
  console.error(
    `ソースが見つかりません: ${ALBUM_PREFIX}1.jpg を public/card_illustrations または dist/card_illustrations に置いてください。`
  );
  process.exit(1);
}

console.log('ソース:', srcDir);
fs.mkdirSync(outDir, { recursive: true });

let ok = 0;
for (let i = 0; i < FIRST_EXPANSION_CARD_NAMES.length; i++) {
  const n = i + 1;
  const name = FIRST_EXPANSION_CARD_NAMES[i];
  const from = path.join(srcDir, `${ALBUM_PREFIX}${n}.jpg`);
  const dest = path.join(outDir, `${name}.jpg`);
  if (!fs.existsSync(from)) {
    console.error(`欠番: ${from}`);
    process.exit(1);
  }
  fs.copyFileSync(from, dest);
  console.log(`${n}. ${name}.jpg`);
  ok++;
}

console.log(`\n${ok} 件を ${outDir} にコピーしました。`);
