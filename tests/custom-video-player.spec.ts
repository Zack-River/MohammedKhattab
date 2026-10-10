import { expect, test } from "@playwright/test";

test("hero thumbnail activates original MP4 with only centered play/pause", async ({
  page,
}) => {
  const errors: string[] = [],
    providerRequests: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (/youtube(?:-nocookie)?\.com/.test(request.url()))
      providerRequests.push(request.url());
  });
  await page.goto("/7days-freelance");
  const hero = page.locator(".hero-video-shell");
  await expect(hero.locator(".hero-video-placeholder img")).toHaveAttribute(
    "src",
    "/assets/images/workshop-intro-poster.jpg",
  );
  await expect(hero.locator("video,iframe")).toHaveCount(0);
  await page
    .getByRole("button", { name: "تشغيل الفيديو التعريفي", exact: true })
    .click();
  const video = hero.locator("video");
  await expect
    .poll(() => video.evaluate((node) => (node as HTMLVideoElement).readyState))
    .toBeGreaterThanOrEqual(2);
  await expect(video).toHaveAttribute(
    "src",
    "/assets/video/workshop-intro.mp4",
  );
  expect(
    await video.evaluate((node) => (node as HTMLVideoElement).controls),
  ).toBe(false);
  await expect(
    hero.locator(".custom-video-controls,input,iframe,a"),
  ).toHaveCount(0);
  await expect(hero.locator(".custom-video-stage button")).toHaveCount(0);
  await video.click();
  await expect
    .poll(() => video.evaluate((node) => (node as HTMLVideoElement).paused))
    .toBe(true);
  await hero
    .getByRole("button", { name: "تشغيل الفيديو", exact: true })
    .click();
  await expect
    .poll(() => video.evaluate((node) => (node as HTMLVideoElement).paused))
    .toBe(false);
  await video.evaluate((node) => {
    const v = node as HTMLVideoElement;
    v.currentTime = v.duration - 0.1;
    void v.play();
  });
  await expect(hero.locator(".hero-video-placeholder")).toBeVisible();
  await expect(video).toHaveCount(0);
  expect(providerRequests).toEqual([]);
  expect(errors).toEqual([]);
});
for (const width of [320, 390, 768, 1440])
  test(`hero thumbnail and overlay fit 16:9 at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/7days-freelance");
    const hero = page.locator(".hero-video-shell");
    await expect
      .poll(() =>
        hero
          .locator("img")
          .evaluate((node) => (node as HTMLImageElement).naturalWidth),
      )
      .toBeGreaterThan(0);
    await hero.locator(".hero-video-placeholder").click();

    await expect(hero.locator(".custom-video-controls")).toHaveCount(0);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    await expect
      .poll(() =>
        hero
          .locator("video")
          .evaluate((node) => (node as HTMLVideoElement).readyState),
      )
      .toBeGreaterThanOrEqual(2);
    await hero.locator("video").click();
    await expect(hero.locator(".custom-video-overlay-toggle")).toBeVisible();
    const geometry = await hero.evaluate((node) => {
      const v = node.querySelector("video")!.getBoundingClientRect(),
        b = node
          .querySelector(".custom-video-overlay-toggle")!
          .getBoundingClientRect();
      return {
        heightError: Math.abs(v.height - (v.width * 9) / 16),
        intrinsicRatio:
          (node.querySelector("video") as HTMLVideoElement).videoWidth /
          (node.querySelector("video") as HTMLVideoElement).videoHeight,
        dx: Math.abs(v.left + v.width / 2 - b.left - b.width / 2),
        dy: Math.abs(v.top + v.height / 2 - b.top - b.height / 2),
      };
    });
    // The existing 1px shell border affects its inner viewport by under 1px.
    expect(geometry.heightError).toBeLessThan(1);
    expect(geometry.intrinsicRatio).toBeCloseTo(16 / 9, 5);
    expect(geometry.dx).toBeLessThan(1);
    expect(geometry.dy).toBeLessThan(1);
  });
test("hero reports media failure and retries", async ({ page }) => {
  let blocked = true;
  await page.route("**/assets/video/workshop-intro.mp4", (route) =>
    blocked ? route.abort() : route.continue(),
  );
  await page.goto("/7days-freelance");
  await page
    .getByRole("button", { name: "تشغيل الفيديو التعريفي", exact: true })
    .click();
  const hero = page.locator(".hero-video-shell");
  await expect(hero.getByRole("alert")).toBeVisible();
  blocked = false;
  await hero.getByRole("button", { name: "إعادة المحاولة" }).click();
  await expect
    .poll(() =>
      hero
        .locator("video")
        .evaluate((node) => (node as HTMLVideoElement).readyState),
    )
    .toBeGreaterThanOrEqual(2);
  await expect(hero.getByRole("alert")).toHaveCount(0);
});
