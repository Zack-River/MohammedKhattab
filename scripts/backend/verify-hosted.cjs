/* eslint-disable @typescript-eslint/no-require-imports -- Hosted schema verification, no credentials in output. */
const { Client } = require('pg');
const fs = require('node:fs');
process.loadEnvFile('.env.local');
const target = new URL(process.env.SUPABASE_DB_URL);
if (target.hostname !== 'aws-0-eu-west-2.pooler.supabase.com' || target.username !== 'postgres.tatseklsvfdpuxuepbfo') throw new Error('Unexpected hosted destination');
target.searchParams.delete('sslmode');
const client = new Client({ connectionString: target.toString(), ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 15000 });
(async () => {
  try {
    await client.connect();
    await client.query('begin');
    await client.query(fs.readFileSync('supabase/seed.sql','utf8'));
    await client.query('commit');
    const tables = await client.query("select relname, relrowsecurity from pg_class join pg_namespace on pg_namespace.oid=relnamespace where nspname='public' and relkind='r' order by relname");
    if (tables.rows.length !== 9 || tables.rows.some(row => !row.relrowsecurity)) throw new Error('RLS verification failed');
    const catalog = await client.query("select slug, position, amount from public.courses order by position");
    const leaked = await client.query("select count(*)::int as count from public.courses, jsonb_path_query(metadata, '$.modules[*].lessons[*].videoUrl') as video where video <> '\"\"'::jsonb");
    if (leaked.rows[0].count) throw new Error('Public metadata contains private playback URLs');
    console.log(JSON.stringify({ tables: tables.rows, courses: catalog.rows, publicPlaybackLeaks: 0 },null,2));
  } catch { throw new Error('Hosted verification failed; credentials are deliberately omitted'); }
  finally { await client.end(); }
})().catch(error => { console.error(error.message); process.exitCode=1; });
