import { expect, test } from "@playwright/test";

test("four curated reels load on click with a single centered play/pause control", async ({
  page,
}) => {
  const errors: string[] = [],
    mediaRequests: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (request.url().endsWith(".mp4")) mediaRequests.push(request.url());
  });
  await page.goto("/7days-freelance");
  const cards = page.locator(".reel-card");
  await expect(cards).toHaveCount(4);
  await expect(cards.locator(".client-work-title, .client-work-sub, .reel-info")).toHaveCount(0);
  await expect(cards.locator(".reel-duration-badge")).toHaveCount(0);
  const selectedSources = ["01", "03", "05", "06"];
  await expect(cards.locator("video,iframe")).toHaveCount(0);
  expect(mediaRequests).toEqual([]);
  for (let index = 0; index < 4; index++) {
    const card = cards.nth(index);
    await card.locator(".reel-video-placeholder").click();
    const video = card.locator("video");
    await expect(video).toHaveAttribute("src", `/assets/video/portfolio/work-${selectedSources[index]}.mp4`);
    await expect
      .poll(() =>
        video.evaluate((node) => (node as HTMLVideoElement).readyState),
      )
      .toBeGreaterThanOrEqual(2);
    await expect
      .poll(() => video.evaluate((node) => (node as HTMLVideoElement).paused))
      .toBe(false);
    expect(
      await video.evaluate((node) => (node as HTMLVideoElement).controls),
    ).toBe(false);
    expect(
      await video.evaluate((node) => (node as HTMLVideoElement).duration),
    ).toBeGreaterThan(0);
    await expect(
      card.locator("iframe,a,.custom-video-controls,input"),
    ).toHaveCount(0);
    await expect(card.locator(".custom-video-stage button")).toHaveCount(0);
    await expect
      .poll(() =>
        cards
          .locator("video")
          .evaluateAll(
            (nodes) =>
              nodes.filter((node) => !(node as HTMLVideoElement).paused).length,
          ),
      )
      .toBe(1);
    await video.click();
    await expect
      .poll(() => video.evaluate((node) => (node as HTMLVideoElement).paused))
      .toBe(true);
    await card
      .getByRole("button", { name: "تشغيل الفيديو", exact: true })
      .click();
    await expect
      .poll(() => video.evaluate((node) => (node as HTMLVideoElement).paused))
      .toBe(false);
    const shell = card.getByRole("region");
    await shell.focus();
    await shell.press("Space");
    await expect
      .poll(() => video.evaluate((node) => (node as HTMLVideoElement).paused))
      .toBe(true);
    await shell.press("Space");
    await expect
      .poll(() => video.evaluate((node) => (node as HTMLVideoElement).paused))
      .toBe(false);
  }
  expect(errors).toEqual([]);
});
for (const width of [320, 390, 768, 1440])
  test(`reel button stays centered and video preserves 9:16 at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/7days-freelance");
    const card = page.locator(".reel-card").first();
    await card.locator(".reel-video-placeholder").click();
    const video = card.locator("video");
    await expect
      .poll(() =>
        video.evaluate((node) => (node as HTMLVideoElement).readyState),
      )
      .toBeGreaterThanOrEqual(2);
    await video.click();
    const toggle = card.locator(".custom-video-overlay-toggle");
    await expect(toggle).toBeVisible();
    await expect(card.locator(".custom-video-controls")).toHaveCount(0);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    const geometry = await card.evaluate((node) => {
      const v = node.querySelector("video")!.getBoundingClientRect(),
        b = node
          .querySelector(".custom-video-overlay-toggle")!
          .getBoundingClientRect();
      return {
        ratio: v.width / v.height,
        dx: Math.abs(v.left + v.width / 2 - (b.left + b.width / 2)),
        dy: Math.abs(v.top + v.height / 2 - (b.top + b.height / 2)),
      };
    });
    expect(geometry.ratio).toBeCloseTo(9 / 16, 2);
    expect(geometry.dx).toBeLessThan(1);
    expect(geometry.dy).toBeLessThan(1);
  });
test("failed media offers retry and recovers", async ({ page }) => {
  let blocked = true;
  await page.route("**/assets/video/portfolio/work-01.mp4", (route) =>
    blocked ? route.abort() : route.continue(),
  );
  await page.goto("/7days-freelance");
  const card = page.locator(".reel-card").first();
  await card.locator(".reel-video-placeholder").click();
  await expect(card.getByRole("alert")).toBeVisible();
  blocked = false;
  await card.getByRole("button", { name: "إعادة المحاولة" }).click();
  await expect
    .poll(() =>
      card
        .locator("video")
        .evaluate((node) => (node as HTMLVideoElement).readyState),
    )
    .toBeGreaterThanOrEqual(2);
  await expect(card.getByRole("alert")).toHaveCount(0);
});
test("finished reel returns to its original thumbnail and restarts from the beginning", async ({
  page,
}) => {
  await page.goto("/7days-freelance");
  const card = page.locator(".reel-card").first();
  const originalPoster = await card
    .locator(".reel-video-placeholder img")
    .getAttribute("src");
  await card.locator(".reel-video-placeholder").click();
  const video = card.locator("video");
  await expect
    .poll(() => video.evaluate((node) => (node as HTMLVideoElement).readyState))
    .toBeGreaterThanOrEqual(2);
  await video.evaluate((node) => {
    const v = node as HTMLVideoElement;
    v.currentTime = v.duration - 0.1;
    void v.play();
  });
  await expect(card.locator(".reel-video-placeholder")).toBeVisible();
  await expect(video).toHaveCount(0);
  await expect(card.locator(".reel-video-placeholder img")).toHaveAttribute(
    "src",
    originalPoster!,
  );
  await card.locator(".reel-video-placeholder").click();
  await expect
    .poll(() => video.evaluate((node) => (node as HTMLVideoElement).paused))
    .toBe(false);
  expect(
    await video.evaluate((node) => (node as HTMLVideoElement).currentTime),
  ).toBeLessThan(3);
});
test("web videos support byte-range playback", async ({ request }) => {
  const response = await request.get("/assets/video/portfolio/work-01.mp4", {
    headers: { Range: "bytes=0-127" },
  });
  expect(response.status()).toBe(206);
  expect(response.headers()["content-range"]).toMatch(/^bytes 0-127\//);
  expect((await response.body()).length).toBe(128);
});
