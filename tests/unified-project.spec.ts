import { expect, test } from "@playwright/test";
import { readFileSync, existsSync } from "node:fs";
import { projectRoutes } from "../config/project-navigation";

test("one Next.js router owns all pages and the previous URLs redirect", async ({ page, request }) => {
  expect(existsSync("lms")).toBe(false);
  for (const file of ["modules/package.json", "modules/package-lock.json", "modules/node_modules", "modules/.next", "modules/tsconfig.json", "modules/public"]) expect(existsSync(file), file).toBe(false);
  expect(existsSync("modules/app")).toBe(false);
  expect(existsSync("modules/next.config.ts")).toBe(false);
  const build = readFileSync(".next/BUILD_ID", "utf8").trim();
  for (const path of Object.values(projectRoutes)) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain(build);
    expect(html).toContain('dir="rtl"');
  }
  await page.goto("/portfolio");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("h1")).toHaveText("محمد خطاب");
  await page.goto("/workshop");
  await expect(page).toHaveURL(/\/7days-freelance$/);
});

for (const width of [390, 1440]) {
  test(`all three pages are connected on the same origin at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(projectRoutes.portfolio);
    const origin = new URL(page.url()).origin;
    await expect(page.locator(".personal-site")).toBeVisible();
    await page.locator("[data-project-navigation] a[href='/ta3allam']").click();
    await expect(page).toHaveURL(`${origin}${projectRoutes.learning}`);
    await expect(page.locator(".lms-course-card")).toHaveCount(3);
    await page.locator("[data-project-navigation] a[href='/7days-freelance']").click();
    await expect(page).toHaveURL(`${origin}${projectRoutes.workshop}`);
    await expect(page.getByText("ينتهي الخصم خلال :", { exact: true })).toBeVisible();
    await expect(page.locator(".reel-card")).toHaveCount(4);
    await page.locator("[data-project-navigation] a[href='/']").click();
    await expect(page).toHaveURL(`${origin}/`);
    await expect(page.locator(".personal-site")).toBeVisible();
    expect(errors).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.locator(".personal-course:not(.personal-course-upcoming)")).toHaveAttribute("href", projectRoutes.workshop);
    await expect(page.locator(".personal-course:not(.personal-course-upcoming)")).not.toHaveAttribute("target", "_blank");
  });
}

test("LMS endpoints and player assets share the page origin", async ({ request }) => {
  const response = await request.get("/api/courses");
  expect(response.status()).toBe(200);
  expect((await response.json()).courses).toHaveLength(6);
  expect((await request.get("/assets/images/personal/portrait.png")).status()).toBe(200);
  const media = await request.get("/assets/video/portfolio/work-01.mp4", { headers: { Range: "bytes=0-1023" } });
  expect(media.status()).toBe(206);
  expect((await media.body()).length).toBe(1024);
});

test("Ta3allam owns its catalog, account and learning routes; legacy redirects retain queries", async ({ page, request }) => {
  for (const [before, after] of [
    ["/ta3llam", "/ta3allam"],
    ["/ta3llam/courses?category=motion", "/ta3allam/courses?category=motion"],
    ["/courses?category=motion&q=After", "/ta3allam/courses?category=motion&q=After"],
    ["/courses/motion-essentials", "/ta3allam/courses/motion-essentials"],
    ["/dashboard/profile", "/ta3allam/dashboard/profile"],
    ["/login", "/ta3allam/login"],
    ["/learn/editing-foundations/first-cut", "/ta3allam/learn/editing-foundations/first-cut"],
  ]) {
    const response = await request.get(before, { maxRedirects: 0 });
    expect(response.status()).toBe(307);
    const location = new URL(response.headers().location, response.url());
    const expected = new URL(after, response.url());
    expect(location.pathname).toBe(expected.pathname);
    expect([...location.searchParams.entries()].sort()).toEqual([...expected.searchParams.entries()].sort());
  }
  await page.goto("/ta3allam");
  const course = page.locator(".lms-course-card").first();
  await expect(course.locator("a").first()).toHaveAttribute("href", /^\/ta3allam\/courses\//);
  await page.getByRole("link", { name: "الدورات", exact: true }).first().click();
  await expect(page).toHaveURL(/\/ta3allam\/courses$/);
  await expect(page.locator(".lms-course-card")).toHaveCount(6);
  const links = await page.locator("a[href]").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")));
  expect(links.some((href) => /^\/(courses|dashboard|learn|login)(?:\/|$|[?#])/.test(href ?? ""))).toBe(false);
  await page.getByRole("link", { name: "كيف تتعلّم؟", exact: true }).first().click();
  await expect(page).toHaveURL(/\/ta3allam#how-it-works$/);
});
