/* eslint-disable @typescript-eslint/no-require-imports -- Credential-safe CLI bootstrap for the selected hosted database. */
const { spawnSync } = require("node:child_process");
process.loadEnvFile(".env.local");
if (!process.env.SUPABASE_DB_URL) throw new Error("Set SUPABASE_DB_URL locally; never commit credentials");
const target = new URL(process.env.SUPABASE_DB_URL);
if (!target.hostname.endsWith(".pooler.supabase.com")) throw new Error("Use the chosen Supabase Session pooler");
target.searchParams.set("sslmode", "require");
const command = process.argv.includes("--advisors") ? ["advisors", "--fail-on", "error"] : ["push", "--yes", ...(process.argv.includes("--seed") ? ["--include-seed"] : [])];
const result = spawnSync("npx", ["supabase", "db", ...command, "--db-url", target.toString()], { encoding: "utf8", timeout: 120000 });
const redact = (text) => (text ?? "").replaceAll(target.toString(), "[database connection]").replaceAll(decodeURIComponent(target.password), "[redacted]");
process.stdout.write(redact(result.stdout));
process.stderr.write(redact(result.stderr));
process.exitCode = result.status ?? 1;
