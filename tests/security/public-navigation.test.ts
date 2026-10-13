import { test } from "node:test";
import assert from "node:assert/strict";
import config from "../../next.config";
import { projectRoutes } from "../../config/project-navigation";
import { personalPortfolio } from "../../config/personal-portfolio-model";
test("Public redirects cannot intercept normal course details or send navigation to advertising pages", async () => {
  const redirects = await config.redirects!();
  for (const rule of redirects) {
    assert.notEqual(rule.source, rule.destination, `Self redirect: ${rule.source}`);
    assert.ok(!rule.source.startsWith("/courses/"), `Canonical course route intercepted: ${rule.source}`);
    assert.ok(!rule.destination.startsWith("/featured/"), `Public redirect targets advertising: ${rule.source}`);
  }
  assert.equal(projectRoutes.workshop, "/courses/7days-freelance");
  assert.ok(personalPortfolio.courses.items.some(item => item.href === projectRoutes.workshop));
});
