import { test, expect } from "@playwright/test";
import { routes } from "../modules/config/navigation";
const protectedPages = [routes.dashboard, routes.library, routes.profile, routes.resources, routes.certificates, routes.admin, routes.adminCourse("7days-freelance")];
for (const path of protectedPages) test(`logged-out requests cannot render ${path}`, async ({ request, page }) => {
  const response = await request.get(path, { maxRedirects: 0 });
  expect(response.status()).toBe(307);
  expect(response.headers().location).toMatch(/\/ta3allam\/login$/);
  expect(await response.text()).not.toContain("lms-dashboard");
  const rsc = await request.get(path, { maxRedirects: 0, headers: { RSC: "1" } });
  expect(rsc.status()).toBe(307);
  expect(await rsc.text()).not.toContain("lms-dashboard");
  await page.goto(path);
  await expect(page).toHaveURL(/\/ta3allam\/login$/);
  await expect(page.locator(".lms-dashboard-stats")).toHaveCount(0);
});
test("forged session and old demo cookies cannot unlock the dashboard", async ({ request }) => {
  const response = await request.get(routes.dashboard, { maxRedirects: 0, headers: { Cookie: "ta3allam-session=forged; ta3allam-learning=forged; sb-tatseklsvfdpuxuepbfo-auth-token=forged" } });
  expect(response.status()).toBe(307);
  expect(response.headers().location).toMatch(/\/ta3allam\/login$/);
});
