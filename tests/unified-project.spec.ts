import { expect, test } from "@playwright/test";
import { readFileSync, existsSync } from "node:fs";
import { courses } from "../modules/data/courses";
import { projectRoutes } from "../config/project-navigation";
import { routes } from "../modules/config/navigation";

test("one Next.js router serves the new platform, founder and workshop URLs", async ({ page, request }) => {
  for (const file of ["lms", "modules/package.json", "modules/node_modules", "modules/.next", "modules/app", "modules/next.config.ts", "app/users"]) expect(existsSync(file), file).toBe(false);
  const build = readFileSync(".next/BUILD_ID", "utf8").trim();
  for (const path of Object.values(projectRoutes)) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain(build);
  }
  await page.goto("/");
  await expect(page.locator(".lms-course-card")).toHaveCount(3);
  await expect(page.locator(".personal-site")).toHaveCount(0);
  await page.goto("/portfolio");
  await expect(page).toHaveURL(/\/founder$/);
  await expect(page.locator("h1")).toHaveText("محمد خطاب");
  await page.goto("/workshop");
  await expect(page).toHaveURL(new RegExp(projectRoutes.workshop + "$"));
});
for (const width of [390, 1440]) test(`platform, founder and workshop links connect at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(projectRoutes.portfolio);
  const origin = new URL(page.url()).origin;
  await page.locator(`[data-project-navigation] a[href='${projectRoutes.learning}']`).click();
  await expect(page).toHaveURL(`${origin}/`);
  await expect(page.locator(".lms-course-card")).toHaveCount(3);
  await page.locator(`[data-project-navigation] a[href='${projectRoutes.workshop}']`).click();
  await expect(page).toHaveURL(`${origin}${projectRoutes.workshop}`);
  await expect(page.getByText("ينتهي الخصم خلال :", { exact: true })).toBeVisible();
  await expect(page.locator(".reel-card")).toHaveCount(4);
  await page.locator(`[data-project-navigation] a[href='${projectRoutes.portfolio}']`).click();
  await expect(page).toHaveURL(`${origin}${projectRoutes.portfolio}`);
  await expect(page.locator(".personal-site")).toBeVisible();
  await expect(page.locator(".personal-course:not(.personal-course-upcoming)")).toHaveAttribute("href", projectRoutes.workshop);
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test("legacy namespaces redirect once and preserve queries and anchors", async ({ page, request }) => {
  for (const [before, after] of [
    ["/ta3allam", "/"], ["/ta3llam", "/"],
    ["/ta3llam/courses?category=motion", "/courses?category=motion"],
    ["/ta3allam/courses?category=motion&q=After", "/courses?category=motion&q=After"],
    ["/ta3allam/courses/motion-essentials", "/courses/motion-essentials"],
    ["/ta3allam/dashboard/profile", "/dashboard/profile"],
    ["/ta3allam/login", "/login"],
    ["/ta3allam/learn/editing-foundations/first-cut", "/learn/editing-foundations/first-cut"],
    ["/ta3allam/7days-freelance?source=old", `${projectRoutes.workshop}?source=old`],
    ["/ta3llam/courses/7days-freelance", projectRoutes.workshop],
    ["/courses/7days-freelance", projectRoutes.workshop],
  ]) {
    const response = await request.get(before, { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(new URL(response.headers().location, response.url()).href).toBe(new URL(after, response.url()).href);
  }
  await page.goto("/ta3allam#how-it-works");
  await expect(page).toHaveURL(/\/#how-it-works$/);
  await page.goto(routes.courses);
  await expect(page.locator(".lms-course-card")).toHaveCount(courses.length);
  const links = await page.locator("a[href]").evaluateAll(nodes => nodes.map(node => node.getAttribute("href")));
  expect(links.some(href => /^\/ta3a?llam(?:\/|$|[?#])/.test(href ?? ""))).toBe(false);
});
test("course pages are root routes, workshop type is enforced and user profiles are absent", async ({ request }) => {
  expect((await request.get(routes.course("editing-foundations"), { maxRedirects: 0 })).status()).toBe(200);
  expect((await request.get("/users/student")).status()).toBe(404);
  for (const path of ["/workshops/editing-foundations", "/workshops/missing", "/courses/missing"]) {
    const response = await request.get(path);
    const html = await response.text();
    // Next.js streams notFound() with HTTP 200 after headers have been sent.
    expect([200, 404]).toContain(response.status());
    expect(html).toContain("NEXT_HTTP_ERROR_FALLBACK;404");
    expect(html).toContain('name="robots" content="noindex"');
    expect(html).not.toContain('class="hero-section');
    expect(html).not.toContain('class="lms-course-detail');
  }
  expect((await request.get("/api/courses")).status()).toBe(200);
  const media = await request.get("/assets/video/portfolio/work-01.mp4", { headers: { Range: "bytes=0-1023" } });
  expect(media.status()).toBe(206);
});
