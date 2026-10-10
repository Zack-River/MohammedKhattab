import { expect, test } from "@playwright/test";

test("reference content fades in at the viewport trigger and reveals only once", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/7days-freelance");
  const grid = page.locator(".clients-grid");
  await expect.poll(() => grid.evaluate(node => getComputedStyle(node).opacity)).toBe("0");
  await grid.evaluate(node => window.scrollTo(0, window.scrollY + node.getBoundingClientRect().top - window.innerHeight * 0.7));
  await expect.poll(() => grid.evaluate(node => node.getAnimations().some(animation => animation.playState === "running"))).toBe(true);
  await expect.poll(() => grid.evaluate(node => getComputedStyle(node).opacity)).toBe("1");
  await expect.poll(() => grid.evaluate(node => node.getAnimations().length)).toBe(0);
  await page.evaluate(() => window.scrollTo(0, 0));
  await grid.scrollIntoViewIfNeeded();
  expect(await grid.evaluate(node => node.getAnimations().length)).toBe(0);
});

test("reduced motion and JavaScript-free visits keep all content visible", async ({ page, browser, baseURL }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/7days-freelance");
  expect(await page.locator(".clients-grid").evaluate(node => getComputedStyle(node).opacity)).toBe("1");
  expect(await page.locator(".clients-grid").evaluate(node => node.getAnimations().length)).toBe(0);
  const context = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await context.newPage();
  await staticPage.goto((baseURL ?? "http://localhost:3040") + "/7days-freelance");
  expect(await staticPage.locator(".clients-grid").evaluate(node => getComputedStyle(node).opacity)).toBe("1");
  await context.close();
});
