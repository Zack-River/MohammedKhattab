import { expect, test } from "@playwright/test";
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const rootRequire = createRequire(resolve("package.json"));
const moduleRequire = createRequire(resolve("modules/features/marketing/landing.tsx"));

test("T03 page modules resolve the single maintained foundation", () => {
  for (const entry of ["ui/container", "ui/rich-text", "types/ui", "hooks/use-accordion", "lib/scroll-reveals"]) {
    expect(realpathSync(rootRequire.resolve(`@khatab/design/${entry}`))).toBe(
      realpathSync(moduleRequire.resolve(`@khatab/design/${entry}`)),
    );
  }
  for (const app of ["app", "modules"]) {
    const base = readFileSync(`${app}/styles/theme.css`, "utf8");
    expect(base.match(/@import/g)).toHaveLength(1);
    expect(base).not.toMatch(/--primary-red:\s*#/);
    expect(existsSync(`${app}/styles/workshop.css`)).toBe(false);
    expect(existsSync(`${app}/styles/fonts.css`)).toBe(false);
  }
});

test("T10 generated exports resolve aliases and reject invalid token graphs", () => {
  const { parseTokens, resolveToken } = rootRequire("./packages/design-system/lib/theme.cjs");
  const source = ":root { --primary: #fc3522; --alias: var(--primary); }";
  expect(resolveToken(parseTokens([source]), "--alias")).toBe("#fc3522");
  expect(() => resolveToken({}, "--missing")).toThrow(/Missing/);
  expect(() => resolveToken({"--a":"var(--b)","--b":"var(--a)"}, "--a")).toThrow(/Cyclic/);
  expect(() => resolveToken({"--a":"calc(1 + 2)"}, "--a")).toThrow(/Unsupported/);
  for (const entry of ["app/styles", "modules/styles"]) {
    const base = readFileSync("packages/design-system/styles/theme.css", "utf8");
    const tokens = parseTokens([base, readFileSync(`${entry}/theme.css`, "utf8")]);
    const generated = JSON.parse(readFileSync(`${entry}/theme-server.json`, "utf8"));
    expect(generated.primary).toBe(resolveToken(tokens, "--primary-red"));
    expect(generated.background).toBe(resolveToken(tokens, "--bg-main"));
  }
});
