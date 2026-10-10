import { test } from "@playwright/test";
import { execFileSync } from "node:child_process";
for (const contract of ["R03", "R04", "R05", "R09"]) {
  test(`${contract} real React reuse contracts`, () => {
    execFileSync(process.execPath, ["tests/helpers/run-source-fixture.cjs", "tests/reuse-repairs.fixture", contract], { stdio: "pipe" });
  });
}
