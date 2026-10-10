import { expect, test } from "@playwright/test";

for (const kind of ["reel", "hero"] as const) {
  test(`${kind} opens fullscreen without cropping and exits through its button`, async ({ page }) => {
    await page.goto("/7days-freelance");
    const player = page.locator(kind === "reel" ? ".reel-card .media-player" : ".hero-video-shell .media-player").first();
    await player.locator(".media-player-poster").click();
    await expect.poll(() => page.evaluate(() => document.fullscreenElement === null)).toBe(true);
    await player.hover();
    await player.getByRole("button", { name: "ملء الشاشة", exact: true }).click();
    await expect.poll(() => player.evaluate(node => document.fullscreenElement === node)).toBe(true);
    const video = player.locator("video");
    await expect.poll(() => video.evaluate(node => (node as HTMLVideoElement).readyState)).toBeGreaterThanOrEqual(2);
    const frame = await video.evaluate(node => {
      const video = node as HTMLVideoElement;
      return { fit: getComputedStyle(video).objectFit, portrait: video.videoHeight > video.videoWidth, controls: video.controls };
    });
    expect(frame.fit).toBe("contain");
    expect(frame.portrait).toBe(kind === "reel");
    expect(frame.controls).toBe(false);
    await video.click();
    await expect.poll(() => video.evaluate(node => (node as HTMLVideoElement).paused)).toBe(true);
    await player.getByRole("button", { name: "الخروج من ملء الشاشة" }).click();
    await expect.poll(() => page.evaluate(() => document.fullscreenElement === null)).toBe(true);
    await expect(video).toBeVisible();
  });
}

test("Escape exits fullscreen; finishing restores poster and exits fullscreen", async ({ page }) => {
  await page.goto("/7days-freelance");
  const player = page.locator(".reel-card .media-player").first();
  await player.locator(".media-player-poster").click();
  await player.getByRole("button", { name: "ملء الشاشة", exact: true }).click();
  await expect.poll(() => player.evaluate(node => document.fullscreenElement === node)).toBe(true);
  await page.keyboard.press("Escape");
  await expect.poll(() => page.evaluate(() => document.fullscreenElement === null)).toBe(true);
  await page.locator(".reel-card .media-player").nth(1).locator(".media-player-poster").click();
  await expect(player.locator(".media-player-poster")).toBeVisible();
  const next = page.locator(".reel-card .media-player").nth(1);
  await next.getByRole("button", { name: "ملء الشاشة", exact: true }).click();
  await expect.poll(() => next.evaluate(node => document.fullscreenElement === node)).toBe(true);
  await expect.poll(() => next.locator("video").evaluate(node => (node as HTMLVideoElement).readyState)).toBeGreaterThanOrEqual(2);
  await next.locator("video").evaluate(node => { const v = node as HTMLVideoElement; v.currentTime = v.duration - .1; void v.play(); });
  await expect(next.locator(".media-player-poster")).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.fullscreenElement === null)).toBe(true);
});
