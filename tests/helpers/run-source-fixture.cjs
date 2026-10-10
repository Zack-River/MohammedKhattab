/* eslint-disable @typescript-eslint/no-require-imports -- Real React server-rendering avoids Playwright JSX instrumentation. */
require("./register-source.cjs");
const fs = require("node:fs"), path = require("node:path"), Module = require("node:module"), ts = require("typescript");
const file = path.resolve(process.argv[2]);
if (!file.startsWith(path.resolve("tests") + path.sep) || !file.endsWith(".fixture")) throw new Error("Expected a test fixture");
const fixture = new Module(file, module);
fixture.filename = file;
fixture.paths = Module._nodeModulePaths(path.dirname(file));
fixture._compile(ts.transpileModule(fs.readFileSync(file, "utf8"), {
  compilerOptions: { target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText, file);
