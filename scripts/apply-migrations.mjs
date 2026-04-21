/**
 * supabase/migrations 内の *.sql をファイル名順にすべて実行する（Supabase CLI 不要）。
 * DATABASE_URL が .env に必要。
 *
 *   npm run db:migrate
 */

import 'dotenv/config';

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import pg from 'pg';

const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');

const connectionString = process.env.DATABASE_URL?.trim();
if (!connectionString) {
  console.error('DATABASE_URL が未設定です。');
  process.exit(1);
}

const files = fs
  .readdirSync(migrationsDir)
  .filter((f) => f.endsWith('.sql'))
  .sort();

const client = new pg.Client({
  connectionString,
  ssl: connectionString.includes('supabase.co') ? { rejectUnauthorized: false } : undefined,
});

try {
  await client.connect();
  for (const file of files) {
    const full = path.join(migrationsDir, file);
    const sql = fs.readFileSync(full, 'utf8');
    process.stdout.write(`${file} ... `);
    await client.query(sql);
    console.log('OK');
  }
  console.log(`完了: ${files.length} ファイル`);
} catch (err) {
  console.error(err);
  process.exit(1);
} finally {
  await client.end().catch(() => {});
}
