import { writeFileSync } from "node:fs";
import { uniqueNamesGenerator } from "unique-names-generator";
// Curated friendly words; the package runs only in migration tooling, never in the browser.
const gerunds = ["learning", "drawing", "dancing", "reading", "writing", "running", "swimming", "building", "coding", "singing", "painting", "exploring", "creating", "growing", "dreaming", "traveling"];
const adjectives = ["brave", "kind", "bright", "calm", "clever", "gentle", "happy", "lively", "patient", "proud", "quiet", "sunny", "swift", "warm", "wise", "bold"];
const bases = new Set<string>();
for (let seed = 1; seed <= 10000 && bases.size < 256; seed++) {
  bases.add(uniqueNamesGenerator({ dictionaries: [gerunds, adjectives], separator: "-", length: 2, style: "lowerCase", seed }));
}
if (bases.size !== 256) throw new Error("Incomplete username vocabulary");
const sql = `create or replace function private.username_fallback_base(seed integer)
returns text language sql immutable set search_path='' as $function$
select (array[${[...bases].sort().map(word => `'${word}'`).join(",")}])[1 + (seed % 256)];
$function$;
revoke all on function private.username_fallback_base(integer) from public, anon, authenticated;
`;
writeFileSync(process.argv[2] ?? "/tmp/khatab-username-vocabulary.sql", sql);
