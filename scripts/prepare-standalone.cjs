/* eslint-disable @typescript-eslint/no-require-imports -- Stage the single verified application build. */
const fs = require("node:fs"), path = require("node:path");
const root = path.resolve(__dirname, ".."), runtime = "/tmp/khatab-acceptance-artifacts/platform";
const standalone = path.join(root, ".next/standalone");
if (!fs.existsSync(standalone)) throw new Error("Build the unified application first");
if (fs.existsSync(runtime)) fs.renameSync(runtime, `${runtime}.previous-${Date.now()}`);
fs.cpSync(standalone, runtime, { recursive: true });
fs.cpSync(path.join(root, "public"), path.join(runtime, "public"), { recursive: true });
fs.cpSync(path.join(root, ".next/static"), path.join(runtime, ".next/static"), { recursive: true });
const artifacts = [{ app: "platform", buildId: fs.readFileSync(path.join(root, ".next/BUILD_ID"), "utf8").trim(), runtime }];
fs.writeFileSync(path.join(root, "docs/evidence/architecture-acceptance/production-artifacts.json"), JSON.stringify(artifacts, null, 2) + "\n");
console.log(JSON.stringify(artifacts, null, 2));
