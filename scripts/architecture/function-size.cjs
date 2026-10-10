/* eslint-disable @typescript-eslint/no-require-imports -- AST-backed production function budgets. */
const ts = require("typescript");
const helper = /\/helpers\//, hook = /\/hooks\//;
function containsMarkup(node) {
  if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node) || ts.isJsxFragment(node)) return true;
  return Boolean(ts.forEachChild(node, containsMarkup));
}
function inspectFunctionSizes(file, text) {
  if (/\/(?:data|types|styles)\//.test(file)) return [];
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const failures = [], lines = text.trimEnd().split("\n").length;
  const fileLimit = helper.test(file) ? 80 : hook.test(file) ? 60 : /(?:\/components\/|\/ui\/|\/app\/|^app\/.*page\.tsx$)/.test(file) ? 100 : undefined;
  if (fileLimit && lines > fileLimit) failures.push(`${file}: file exceeds ${fileLimit} lines (${lines})`);
  const visit = (node) => {
    if (ts.isFunctionLike(node) && node.body && !containsMarkup(node.body)) {
      const start = source.getLineAndCharacterOfPosition(node.body.getStart(source)).line;
      const count = source.getLineAndCharacterOfPosition(node.body.end).line - start + 1;
      const limit = hook.test(file) ? 45 : 35;
      if (count > limit) failures.push(`${file}:${start + 1}: function exceeds ${limit} lines (${count})`);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return failures;
}
module.exports = { inspectFunctionSizes };
