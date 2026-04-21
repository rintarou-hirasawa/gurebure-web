/**
 * PostgreSQL に SQL ファイルをそのまま実行する（Supabase CLI 不要）。
 *
 * 事前準備:
 *   1. Supabase ダッシュボード → Project Settings → Database → Connection string → URI
 *      （パスワード入りの接続文字列。Session mode 推奨の場合はポート 6543）
 *   2. プロジェクト直下の .env に DATABASE_URL=postgresql://... を書く
 *      または PowerShell: $env:DATABASE_URL="postgresql://..."
 *
 * 使い方:
 *   npm run db:sql -- supabase/migrations/20260401150000_insert_first_second_expansion_cards.sql
 *
 * 代替: psql "$DATABASE_URL" -f path/to/file.sql
 */

import 'dotenv/config';

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import pg from 'pg';

const sqlPath = process.argv[2];
if (!sqlPath) {
  console.error('使い方: npm run db:sql -- <SQLファイルのパス>');
  process.exit(1);
}

const resolved = path.resolve(process.cwd(), sqlPath);
if (!fs.existsSync(resolved)) {
  console.error(`ファイルが見つかりません: ${resolved}`);
  process.exit(1);
}

const connectionString = process.env.DATABASE_URL?.trim();
if (!connectionString) {
  console.error('DATABASE_URL が未設定です。.env に設定するか環境変数で渡してください。');
  process.exit(1);
}

const sql = fs.readFileSync(resolved, 'utf8');

const client = new pg.Client({
  connectionString,
  ssl: connectionString.includes('supabase.co') ? { rejectUnauthorized: false } : undefined,
});

try {
  await client.connect();
  await client.query(sql);
  console.log(`OK: ${resolved}`);
} catch (err) {
  console.error(err);
  process.exit(1);
} finally {
  await client.end().catch(() => {});
}
