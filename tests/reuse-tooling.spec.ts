import { expect, test } from "@playwright/test";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { execFileSync } from "node:child_process";
const normalize = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/content:\s*''/g, 'content:""').replace(/\s+/g, "");
test("R11 generation retains approved styles and cannot restore dead rules or tokens", () => {
  const stage = mkdtempSync(join(tmpdir(), "khatab-theme-reuse-"));
  const inputs = ["scripts/prepare-portfolio-styles.py", "docs/evidence/portfolio-reference/style.css", "packages/design-system/styles/theme.css", "modules/styles/portfolio.css"];
  try {
    for (const file of inputs) { mkdirSync(dirname(join(stage, file)), { recursive: true }); cpSync(file, join(stage, file)); }
    execFileSync("python3", [join(stage, inputs[0])]);
    for (const file of inputs.slice(2)) {
      const generated = readFileSync(join(stage, file), "utf8");
      expect(normalize(generated)).toBe(normalize(readFileSync(file, "utf8")));
      expect(generated).not.toContain("personal-work-caption");
      expect(generated).not.toContain("--personal-reference-font-h3:");
    }
  } finally { rmSync(stage, { recursive: true, force: true }); }
});
test("R09 R10 R12 removed wrappers/tools stay removed and numbering is consumed", () => {
  for (const file of ["app/data/workshop/clients.ts", "app/data/workshop/reviews.ts", "modules/hooks/use-api-mutation.ts", "packages/design-system/hooks/use-video-embed.ts", "scripts/compare-reference.cjs", "scripts/prepare-reference.py"]) expect(existsSync(file), file).toBe(false);
  for (const file of ["modules/components/courses/curriculum.tsx", "modules/components/learning/lesson-outline.tsx", "modules/components/marketing/hero-preview.tsx"]) expect(readFileSync(file, "utf8")).toContain("numbered(index)");
  expect(readFileSync("docs/history/reference-tools/README.md", "utf8")).toContain("not active");
});
