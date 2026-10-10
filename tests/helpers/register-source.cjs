/* eslint-disable @typescript-eslint/no-require-imports -- Test-only transpilation of maintained source with real React JSX. */
const fs = require("node:fs"), path = require("node:path"), Module = require("node:module"), ts = require("typescript");
const resolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...args) {
  const target = request.startsWith("@platform/") ? path.resolve("modules", request.slice(10))
    : request.startsWith("@/") ? path.resolve(request.slice(2)) : request;
  return resolve.call(this, target, ...args);
};
for (const extension of [".ts", ".tsx"]) {
  require.extensions[extension] = (module, filename) => {
    if (!["app", "modules", "config", "packages/design-system"].some((root) => filename.startsWith(path.resolve(root) + path.sep))) throw new Error("Only maintained source is compiled");
    module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: { target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
    }).outputText, filename);
  };
}
