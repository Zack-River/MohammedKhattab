/* eslint-disable @typescript-eslint/no-require-imports -- Test/build AST boundary inspection. */
const { inspectFunctionSizes } = require("./architecture/function-size.cjs");
const ts = require("typescript"),
  fs = require("node:fs"),
  path = require("node:path");
const normalize = (file) => path.normalize(file).replaceAll("\\", "/");
function inspect(input) {
  const files = new Map(input.map(([file, text]) => [normalize(file), text]));
  const failures = new Set(),
    graph = new Map(),
    sources = new Map();
  const fail = (file, rule, target = "") =>
    failures.add(`${file}: ${rule}${target ? " " + target : ""}`);
  const resolve = (file, request) => {
    let base;
    if (request.startsWith("@/app/")) base = request.slice(2);
    else if (request.startsWith("@platform/")) base = "modules/" + request.slice(10);
    else if (request.startsWith("@/"))
      base = request.slice(2);
    else if (request.startsWith("@khatab/design/"))
      base =
        "packages/design-system/" + request.slice("@khatab/design/".length);
    else if (request.startsWith("."))
      base = path.join(path.dirname(file), request);
    else return request;
    base = normalize(base);
    return (
      [
        base,
        base + ".ts",
        base + ".tsx",
        base + ".json",
        base + "/index.ts",
        base + "/index.tsx",
      ].find((candidate) => files.has(candidate)) ?? base
    );
  };
  for (const [file, text] of files) {
    if (file.endsWith(".css")) {
      if (/^(?:app|modules)\/styles\//.test(file) && !file.endsWith("/theme.css") && /^@import ['"].*packages\/design-system\/styles\/[^'"]+['"];?$/.test(text.trim()))
        fail(file, "redundant shared stylesheet adapter");
      if (/transition\s*:\s*all\b/.test(text)) fail(file, "transition all");
      if (
        file !== "packages/design-system/styles/theme.css" &&
        /--(?:primary-red|bg-main)\s*:/.test(text)
      )
        fail(file, "copied base token ownership");
      continue;
    }
    inspectFunctionSizes(file, text).forEach((failure) => failures.add(failure));
    const source = ts.createSourceFile(
      file,
      text,
      ts.ScriptTarget.Latest,
      true,
      file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    );
    const declarations = source.statements.filter((node) => !(ts.isExpressionStatement(node) && ts.isStringLiteral(node.expression)));
    if (/^(?:app|modules)\//.test(file) && declarations.length && declarations.every((node) =>
      ts.isExportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier) && /^(?:packages\/design-system\/|config\/)/.test(resolve(file, node.moduleSpecifier.text))))
      fail(file, "redundant shared forwarding file");
    sources.set(file, source);
    const edges = [];
    source.forEachChild((node) => {
      if (
        !(ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) ||
        !node.moduleSpecifier ||
        node.isTypeOnly ||
        node.importClause?.isTypeOnly
      )
        return;
      const clause = node.importClause?.namedBindings ?? node.exportClause;
      if (
        clause &&
        ts.isNamedImports(clause) &&
        !node.importClause.name &&
        clause.elements.every((item) => item.isTypeOnly)
      )
        return;
      const request = node.moduleSpecifier.text;
      edges.push(resolve(file, request));
      if (
        /design-system\/(?:ui|hooks|types|helpers)/.test(file) &&
        /features|\/app\//.test(request)
      )
        fail(file, "app dependency", request);
    });
    graph.set(file, edges);
    const visit = (node) => {
      if (
        ts.isCallExpression(node) &&
        (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
          (ts.isIdentifier(node.expression) &&
            node.expression.text === "require")) &&
        node.arguments.length &&
        ts.isStringLiteral(node.arguments[0])
      ) {
        edges.push(resolve(file, node.arguments[0].text));
      }
      if (
        ts.isJsxAttribute(node) &&
        node.name.getText(source) === "href" &&
        node.initializer &&
        ts.isStringLiteral(node.initializer) &&
        /^\/(?:[a-z0-9-]+\/)?(?:courses|learn|api|dashboard)(?:\/|$)/.test(
          node.initializer.text,
        ) &&
        file.startsWith("modules/components/")
      )
        fail(file, "literal internal destination", node.initializer.text);
      if (
        file.startsWith("modules/") &&
        file !== "modules/config/navigation.ts" &&
        ts.isTemplateExpression(node) &&
        /^\/(?:[a-z0-9-]+\/)?(?:courses|learn|api)\//.test(node.head.text)
      )
        fail(file, "duplicated route builder");
      if (
        /\/app\/.*page\.tsx$/.test(file) &&
        ts.isJsxAttribute(node) &&
        node.name.getText(source) === "className" &&
        node.initializer &&
        ts.isStringLiteral(node.initializer) &&
        /\blms-(?:course-card|resource-card|certificate)\b/.test(
          node.initializer.text,
        )
      )
        fail(file, "page owns reusable card markup");
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  function reachable(start, predicate) {
    const visited = new Set();
    const walk = (file, chain) => {
      if (predicate(file)) return [...chain, file];
      if (visited.has(file)) return;
      visited.add(file);
      for (const edge of graph.get(file) ?? []) {
        const found = walk(edge, [...chain, file]);
        if (found) return found;
      }
    };
    return walk(start, []);
  }
  for (const [file, source] of sources) {
    const renderer =
      /components\//.test(file) || /design-system\/(?:ui|hooks|helpers)/.test(file);
    const pure =
      /(?:selectors|view-models|renderer|sanitize|validation)\.ts$/.test(file) ||
      /(?:modules\/helpers\/|features\/(?:catalog|learning)\/helpers\/)/.test(file);
    if (renderer || pure) {
      const chain = reachable(
        file,
        (target) => target !== file && /\/data\//.test(target),
      );
      if (chain)
        fail(
          file,
          "transitive concrete content dependency",
          chain.join(" -> "),
        );
    }
    const client = source.statements.some(
      (node) =>
        ts.isExpressionStatement(node) &&
        ts.isStringLiteral(node.expression) &&
        node.expression.text === "use client",
    );
    if (client || pure || /design-system\/(?:ui|hooks|helpers)/.test(file)) {
      const chain = reachable(
        file,
        (target) =>
          /^(?:next\/headers|node:fs|fs|server-only)$/.test(target) ||
          /certificate-font\.json$/.test(target),
      );
      if (chain) fail(file, "transitive server dependency", chain.join(" -> "));
    }
  }
  const visiting = new Set(),
    done = new Set();
  const cycle = (file, chain) => {
    if (visiting.has(file)) {
      fail(file, "runtime import cycle", [...chain, file].join(" -> "));
      return;
    }
    if (done.has(file) || !graph.has(file)) return;
    visiting.add(file);
    for (const edge of graph.get(file)) cycle(edge, [...chain, file]);
    visiting.delete(file);
    done.add(file);
  };
  for (const file of graph.keys()) cycle(file, []);
  return [...failures];
}
function collect(directories) {
  const files = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (["node_modules", ".next", "test-results"].includes(entry.name))
        continue;
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (/\.(tsx?|css)$/.test(file))
        files.push([file, fs.readFileSync(file, "utf8")]);
    }
  };
  directories.forEach(visit);
  return files;
}
module.exports = { inspect, collect };
if (require.main === module) {
  const files = collect([
    "app",
    "modules/components",
    "modules/config",
    "modules/data",
    "modules/features",
    "modules/hooks",
    "modules/helpers",
    "modules/lib",
    "modules/styles",
    "modules/types",
    "config",
    "packages/design-system",
  ]);
  const errors = inspect(files);
  console.log(JSON.stringify({ files: files.length, errors }, null, 2));
  process.exitCode = errors.length ? 1 : 0;
}
