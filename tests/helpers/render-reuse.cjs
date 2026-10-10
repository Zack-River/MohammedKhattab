/* eslint-disable @typescript-eslint/no-require-imports -- Test-only CommonJS loader compiles React JSX outside Playwright. */
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const { expect } = require("@playwright/test");
require("./register-source.cjs");
const { renderToStaticMarkup } = require("react-dom/server");
const {
  ClientsSection,
  FaqSection,
  HeroSection,
  RoadmapSection,
} = require("../../app/components/workshop");
const SiteNavigation =
  require("../../app/components/workshop/site-navigation").default;
const { workshopPage } = require("../../app/data/workshop");
const runCase = (_name, run) => run();

const fixture = path.resolve("tests/helpers/component-reuse.fixture");
const result = ts.transpileModule(fs.readFileSync(fixture, "utf8"), {
  fileName: "component-reuse.tsx",
  compilerOptions: { target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS },
});
require("node:vm").runInNewContext(result.outputText, {
  exports: {},
  require,
  expect,
  renderToStaticMarkup,
  ClientsSection,
  FaqSection,
  HeroSection,
  RoadmapSection,
  SiteNavigation,
  workshopPage,
  runCase,
});
