import { expect, test } from "@playwright/test";

test("supplied intro and four curated samples use the shared deferred player and reset previous playback", async ({ page }) => {
  const errors: string[] = [];
  const requests: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("request", request => { if (request.url().endsWith(".mp4")) requests.push(request.url()); });
  await page.goto("/");
  const reels = page.locator(".reel-card");
  await expect(reels).toHaveCount(4);
  await expect(reels.locator(".client-work-title, .client-work-sub, .reel-info")).toHaveCount(0);
  await expect(page.locator(".reel-duration-badge, .hero-video-shell iframe")).toHaveCount(0);
  expect(requests).toEqual([]);
  const hero = page.locator(".hero-video-shell");
  await expect(hero.locator("img")).toHaveAttribute("src", "/assets/images/workshop-intro-poster.jpg");
  await hero.locator(".media-player-poster").click();
  await expect(hero.locator("video")).toHaveAttribute("src", "/assets/video/workshop-intro.mp4");
  await expect.poll(() => hero.locator("video").evaluate(node => (node as HTMLVideoElement).paused)).toBe(false);
  expect(await page.evaluate(() => document.fullscreenElement)).toBeNull();
  await reels.first().locator(".media-player-poster").click();
  await expect(hero.locator("video")).toHaveCount(0);
  await expect(hero.locator(".media-player-poster")).toBeVisible();
  await reels.nth(1).locator(".media-player-poster").click();
  await expect(reels.first().locator("video")).toHaveCount(0);
  await expect(reels.first().locator(".media-player-poster")).toBeVisible();
  const video = reels.nth(1).locator("video");
  await expect(video).toHaveAttribute("src", "/assets/video/portfolio/work-03.mp4");
  await expect.poll(() => video.evaluate(node => (node as HTMLVideoElement).readyState)).toBeGreaterThanOrEqual(2);
  expect(await video.evaluate(node => (node as HTMLVideoElement).controls)).toBe(false);
  await video.click();
  await expect.poll(() => video.evaluate(node => (node as HTMLVideoElement).paused)).toBe(true);
  const toggle = reels.nth(1).getByRole("button", { name: "ملء الشاشة", exact: true });
  await toggle.hover();
  await expect(toggle).toHaveCSS("cursor", "pointer");
  await expect(toggle).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(toggle.locator("svg")).toHaveCSS("stroke", "none");
  await expect(reels.locator("a,iframe,input,.custom-video-controls")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("manual fullscreen preserves portrait framing and completion restores the thumbnail", async ({ page }) => {
  await page.goto("/");
  const reel = page.locator(".reel-card").first();
  await reel.locator(".media-player-poster").click();
  const video = reel.locator("video");
  await expect.poll(() => video.evaluate(node => (node as HTMLVideoElement).readyState)).toBeGreaterThanOrEqual(2);
  await reel.getByRole("button", { name: "ملء الشاشة", exact: true }).click();
  await expect.poll(() => reel.locator(".media-player").evaluate(node => document.fullscreenElement === node)).toBe(true);
  await expect(video).toHaveCSS("object-fit", "contain");
  expect(await video.evaluate(node => (node as HTMLVideoElement).videoHeight > (node as HTMLVideoElement).videoWidth)).toBe(true);
  const exit = reel.getByRole("button", { name: "الخروج من ملء الشاشة" });
  await expect(exit).toHaveCSS("cursor", "pointer");
  await exit.click();
  await expect.poll(() => page.evaluate(() => document.fullscreenElement === null)).toBe(true);
  await video.evaluate(node => { const v = node as HTMLVideoElement; v.currentTime = v.duration - .1; void v.play(); });
  await expect(reel.locator(".media-player-poster")).toBeVisible();
  await expect(video).toHaveCount(0);
});

test("featured testimonial plus three reviews expands through the primary show-more action", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#testimonials");
  await expect(section.locator(".featured-review-card")).toHaveCount(1);
  await expect(section.locator(".review-card")).toHaveCount(3);
  const more = section.getByRole("button", { name: "عرض المزيد", exact: true });
  await more.hover();
  await expect(more).toHaveCSS("color", "rgb(252, 53, 34)");
  await expect(more).toHaveCSS("text-decoration-line", "underline");
  await more.click();
  await expect(section.locator(".review-card")).toHaveCount(9);
  await expect(more).toHaveCount(0);
});

for (const width of [320, 390, 1440]) {
  test(`shared media stays responsive and the supplied assets exist at ${width}px`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await expect(page.locator(".hero-video-shell")).toBeVisible();
    const heroRatio = await page.locator(".hero-video-shell").evaluate(node => { const rect = node.getBoundingClientRect(); return rect.width / rect.height; });
    expect(heroRatio).toBeCloseTo(16 / 9, 2);
    for (const card of await page.locator(".reel-card").all()) {
      const poster = card.locator(".media-player-poster img");
      const response = await request.get((await poster.getAttribute("src"))!);
      expect(response.ok()).toBe(true);
      const ratio = await card.locator(".reel-preview").evaluate(node => { const rect = node.getBoundingClientRect(); return rect.width / rect.height; });
      expect(ratio).toBeCloseTo(9 / 16, 2);
    }
    const range = await request.get("/assets/video/portfolio/work-06.mp4", { headers: { Range: "bytes=0-127" } });
    expect(range.status()).toBe(206);
    await page.locator(".creators-marquee").scrollIntoViewIfNeeded();
    await page.emulateMedia({ reducedMotion: "no-preference" });
    expect(await page.locator(".creators-track").evaluate(node => getComputedStyle(node).animationName)).not.toBe("none");
    const action = page.locator(".lms-hero-actions a").first();
    await action.click();
    await expect(page).toHaveURL(/\/courses$/);
  });
}
