/* eslint-disable @typescript-eslint/no-require-imports -- Checks commit candidates without exposing secrets. */
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
if (fs.existsSync('.env.local')) process.loadEnvFile('.env.local');
const secrets = Object.entries(process.env).filter(([name,value]) => /(?:DB_URL|SERVICE_ROLE_KEY|SECRET_KEY|PASSWORD|ACCESS_TOKEN)$/.test(name) && value?.length >= 8).map(([,value]) => value);
if (process.env.SUPABASE_DB_URL) secrets.push(decodeURIComponent(new URL(process.env.SUPABASE_DB_URL).password));
const paths = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z']).toString().split('\0').filter(Boolean);
const violations = [];
for (const path of paths) {
  if (!fs.existsSync(path) || !fs.lstatSync(path).isFile()) continue;
  const content = fs.readFileSync(path);
  if (secrets.some(value => content.includes(Buffer.from(value))) || /-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----/.test(content.toString())) violations.push(path);
}
console.log(JSON.stringify({ filesChecked: paths.length, violations },null,2));
process.exitCode = violations.length ? 1 : 0;
