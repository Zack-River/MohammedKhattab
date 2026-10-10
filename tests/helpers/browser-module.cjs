/* eslint-disable @typescript-eslint/no-require-imports -- Bundle the real helper graph for browser lifecycle tests. */
const fs = require("node:fs"), path = require("node:path"), ts = require("typescript");
function bundleBrowserModule(entry) {
  const modules = {};
  function collect(file) {
    if (Object.hasOwn(modules, file)) return;
    modules[file] = "";
    const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    }).outputText;
    modules[file] = code.replace(/require\("([^\"]+)"\)/g, (_, request) => {
      if (!request.startsWith(".")) throw new Error(`Unsupported browser dependency: ${request}`);
      const dependency = path.resolve(path.dirname(file), `${request}.ts`);
      collect(dependency);
      return `require(${JSON.stringify(dependency)})`;
    });
  }
  const root = path.resolve(entry);
  collect(root);
  return `const sources=${JSON.stringify(modules)},cache={};
    function load(id){if(cache[id])return cache[id];const result=cache[id]={};
      new Function('require','exports',sources[id])(load,result);return result;}
    Object.assign(exports,load(${JSON.stringify(root)}));`;
}
module.exports = { bundleBrowserModule };
