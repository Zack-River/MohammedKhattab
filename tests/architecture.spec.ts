import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import { expect, test } from "@playwright/test";

function sources(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory()
      ? sources(path)
      : /\.tsx?$/.test(path)
        ? [path]
        : [];
  });
}

test("renderers and hooks do not import page data or configuration", () => {
  const violations: string[] = [];
  for (const path of [...sources("app/components"), ...sources("app/hooks")]) {
    const source = ts.createSourceFile(
      path,
      readFileSync(path, "utf8"),
      ts.ScriptTarget.Latest,
      true,
    );
    source.forEachChild((node) => {
      if (
        !ts.isImportDeclaration(node) ||
        !ts.isStringLiteral(node.moduleSpecifier)
      )
        return;
      const target = node.moduleSpecifier.text;
      if (/\/(data|config)\//.test(target))
        violations.push(`${path}: ${target}`);
      if (path.includes("components/ui/") && /workshop/.test(target))
        violations.push(`${path}: feature dependency ${target}`);
    });
  }
  expect(violations).toEqual([]);
});

test("component content and asset destinations are supplied through props", () => {
  const violations: string[] = [];
  for (const path of sources("app/components")) {
    const source = ts.createSourceFile(
      path,
      readFileSync(path, "utf8"),
      ts.ScriptTarget.Latest,
      true,
    );
    const visit = (node: ts.Node) => {
      if (
        (ts.isStringLiteral(node) || ts.isJsxText(node)) &&
        /[\u0600-\u06ff]|https?:\/\/|\/assets\//.test(node.text)
      )
        violations.push(`${path}: ${node.text}`);
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  expect(violations).toEqual([]);
});

test("reusable modules do not create accidental Next.js special-file routes", () => {
  const specialFiles =
    /^(page|route|layout|template|default|loading|error|not-found|global-error|icon|apple-icon|opengraph-image|twitter-image)\.tsx?$/;
  expect(
    [
      "app/components",
      "app/hooks",
      "app/data",
      "app/lib",
      "packages/design-system/types",
      "app/config",
    ]
      .flatMap(sources)
      .filter((path) => specialFiles.test(path.split("/").at(-1)!)),
  ).toEqual([]);
});
