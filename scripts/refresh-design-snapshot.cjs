/* eslint-disable @typescript-eslint/no-require-imports -- Deterministic portable source snapshot, never screenshot regeneration. */
const fs = require("node:fs"),
  path = require("node:path"),
  crypto = require("node:crypto");
const root = path.resolve(__dirname, ".."),
  prompt = path.join(root, "DESIGN_REPRODUCTION_PROMPT.md");
const hash = (text) => crypto.createHash("sha256").update(text).digest("hex");
const files = [];
function collect(relative) {
  const location = path.join(root, relative),
    stat = fs.lstatSync(location);
  if (stat.isSymbolicLink()) return;
  if (stat.isDirectory()) {
    if (
      [
        "node_modules",
        ".next",
        "test-results",
        "test-results-development",
        ".git",
      ].includes(path.basename(relative))
    )
      return;
    for (const name of fs.readdirSync(location).sort())
      collect(path.join(relative, name));
  } else if (
    /\.(ts|tsx|css|json|cjs|mjs|fixture)$/.test(relative) &&
    !relative.endsWith("certificate-font.json") &&
    !relative.endsWith("next-env.d.ts")
  )
    files.push(relative.replaceAll("\\", "/"));
}
for (const directory of [
  "app",
  "config",
  "packages/design-system",
  "modules/components",
  "modules/config",
  "modules/data",
  "modules/features",
  "modules/hooks",
  "modules/helpers",
  "modules/lib",
  "modules/styles",
  "modules/types",
  "scripts",
  "tests",
])
  collect(directory);
for (const file of [
  "package.json",
  "next.config.ts",
  "tsconfig.json",
  "eslint.config.mjs",
  "playwright.config.ts",
  "playwright.development.config.ts",
  "playwright.crossbrowser.config.ts",
])
  if (!files.includes(file)) files.push(file);
files.sort();
const original = fs.readFileSync(prompt, "utf8");
const begin = original.indexOf(
    "## 14. Exact embedded implementation and verification files",
  ),
  end = original.lastIndexOf("\n## 15. Embedded text assets\n");
if (begin < 0 || end < 0) throw new Error("Missing source appendix boundaries");
const appendix = [
  "## 14. Exact embedded implementation and verification files",
  "",
  "Current shared architecture snapshot. Materialize all paths together; run npm ci once at the root using the companion lockfile, then prebuild generation. The separate test fixture is not a shipped application route. Generated .next/node_modules and server font JSON are excluded. Source hashes verify reconstruction, not visual approval.",
  "",
];
for (const file of files) {
  const text = fs.readFileSync(path.join(root, file), "utf8");
  const ext = path.extname(file).slice(1);
  appendix.push(
    `### File: \`${file}\``,
    "",
    `SHA-256: \`${hash(text)}\``,
    "",
    `\`\`\`${ext === "tsx" ? "tsx" : ext === "css" ? "css" : ext === "json" ? "json" : "typescript"}`,
    text.trimEnd(),
    "```",
    "",
  );
}
let result =
  original.slice(0, begin) + appendix.join("\n") + "\n" + original.slice(end);
const lock = fs.readFileSync(path.join(root, "package-lock.json"));
result = result.replace(
  /Companion `package-lock.json`: \*\*\d+ bytes\*\*; SHA-256 `[a-f0-9]+`/,
  `Companion \`package-lock.json\`: **${lock.length} bytes**; SHA-256 \`${hash(lock)}\``,
);
result = result.replace(/\n+LMS companion lockfile:[^\n]+\n+/g, "\n");
if (process.argv.includes("--check")) {
  if (result !== original) throw new Error("Source snapshot is stale");
} else fs.writeFileSync(prompt, result);
console.log(
  `${files.length} source files ${process.argv.includes("--check") ? "verified" : "snapshotted"}`,
);
