import { expect, test } from "@playwright/test";
import { getYouTubeEmbedUrl } from "@/app/lib/video";

test("YouTube watch, short and embed links normalize safely", () => {
  for (const url of [
    "https://www.youtube.com/watch?v=BQTI8hXPVD0",
    "https://youtu.be/BQTI8hXPVD0?t=20",
    "https://www.youtube.com/shorts/BQTI8hXPVD0",
    "https://www.youtube-nocookie.com/embed/BQTI8hXPVD0",
  ])
    expect(getYouTubeEmbedUrl(url)).toBe(
      "https://www.youtube-nocookie.com/embed/BQTI8hXPVD0?autoplay=1",
    );
  for (const url of [
    "javascript:alert(1)",
    "http://youtu.be/BQTI8hXPVD0",
    "https://youtube.com.evil.example/watch?v=BQTI8hXPVD0",
    "https://www.youtube.com/embed/bad",
    "https://example.com/BQTI8hXPVD0",
  ])
    expect(getYouTubeEmbedUrl(url)).toBeNull();
});

test("local videos use themed controls without a download option", async ({
  page,
}) => {
  await page.goto("/");
  const demo = page.locator("[data-edit-preview]");
  await demo.locator('[data-rhythm-choice="energetic"]').click();
  await demo.locator("[data-clip-play]").click();
  const player = demo.locator("[data-media-player]");
  await expect(player).toHaveAttribute("data-player-status", "ready");
  const video = player.locator("video");
  await expect
    .poll(() => video.evaluate((v) => (v as HTMLVideoElement).currentTime))
    .toBeGreaterThan(0);
  expect(await video.evaluate((v) => (v as HTMLVideoElement).controls)).toBe(
    false,
  );
  await expect(video).toHaveAttribute("controlslist", "nodownload");
  await expect(player.locator('[data-plyr="download"]')).toHaveCount(0);
  const toggle = player.locator('.plyr__controls [data-plyr="play"]');
  await toggle.click();
  await expect
    .poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused))
    .toBe(true);
  await toggle.focus();
  await page.keyboard.press("k");
  await expect
    .poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused))
    .toBe(false);
  await toggle.click();
  const seek = player.locator('input[data-plyr="seek"]');
  await seek.fill("50");
  await expect
    .poll(() => video.evaluate((v) => (v as HTMLVideoElement).currentTime))
    .toBeGreaterThan(1.8);
  await player.locator('[data-plyr="mute"]').click();
  await expect
    .poll(() => video.evaluate((v) => (v as HTMLVideoElement).muted))
    .toBe(true);
  await player.getByRole("button", { name: "الإعدادات", exact: true }).click();
  await player.getByRole("menuitem", { name: /سرعة التشغيل/ }).click();
  await player.locator('button[data-plyr="speed"][value="1.5"]').click();
  await expect
    .poll(() => video.evaluate((v) => (v as HTMLVideoElement).playbackRate))
    .toBe(1.5);
  await player.locator('[data-plyr="fullscreen"]').click();
  await expect
    .poll(() => page.evaluate(() => Boolean(document.fullscreenElement)))
    .toBe(true);
  await page.evaluate(() => document.exitFullscreen());
  await demo.locator('[data-rhythm-choice="calm"]').click();
  await expect(demo.locator("video")).toHaveAttribute(
    "src",
    /first-edit-calm\.mp4$/,
  );
  await expect(demo.locator(".plyr")).toHaveCount(1);
});

test("custom player fits narrow screens and retries unavailable local media", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.route("**/first-edit-raw.mp4", (route) =>
    route.fulfill({ status: 404, body: "" }),
  );
  await page.goto("/");
  const clip = page.locator("#hero [data-clip-preview]");
  await clip.locator("[data-clip-play]").click();
  await expect(clip.getByRole("alert")).toBeVisible();
  await page.unroute("**/first-edit-raw.mp4");
  await clip.getByRole("button", { name: "إعادة المحاولة" }).click();
  await expect(clip.locator("[data-media-player]")).toHaveAttribute(
    "data-player-status",
    "ready",
  );
  await expect
    .poll(() =>
      clip
        .locator("video")
        .evaluate((v) => (v as HTMLVideoElement).currentTime),
    )
    .toBeGreaterThan(0);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
  const seekBounds = await clip
    .locator('input[data-plyr="seek"]')
    .boundingBox();
  expect(seekBounds?.width).toBeGreaterThan(30);
});

test("YouTube uses the same custom controls through its iframe API", async ({
  page,
}) => {
  // Exercise the provider adapter deterministically; actual YouTube availability is external.
  await page.addInitScript(`(() => {
    window.__youtubeCalls = [];
    window.YT = { Player: class {
      constructor(element, config) {
        this.config = config; this.time = 0; this.rate = 1; this.volume = 100;
        this.frame = document.createElement('iframe'); this.frame.src = 'about:blank';
        this.frame.title = 'YouTube test provider'; element.replaceChildren(this.frame);
        window.__youtubeCalls.push({ method: 'create', host: config.host, vars: config.playerVars, id: config.videoId });
        setTimeout(() => config.events.onReady({ target: this }), 0);
      }
      getIframe() { return this.frame; }
      getDuration() { return 120; }
      getCurrentTime() { return this.time; }
      getPlaybackRate() { return this.rate; }
      getAvailablePlaybackRates() { return [0.5, 1, 1.5, 2]; }
      getVideoLoadedFraction() { return 1; }
      getVideoUrl() { return 'https://www.youtube.com/watch?v=BQTI8hXPVD0'; }
      getVideoData() { return { title: 'Test video' }; }
      getPlayerState() { return 2; }
      setVolume(value) { this.volume = value; }
      getVolume() { return this.volume; }
      mute() { this.muted = true; }
      unMute() { this.muted = false; }
      isMuted() { return this.muted; }
      setPlaybackRate(value) { this.rate = value; this.config.events.onPlaybackRateChange({ target: this }); }
      playVideo() { window.__youtubeCalls.push({ method: 'play' }); this.config.events.onStateChange({ target: this, data: 1 }); }
      pauseVideo() { window.__youtubeCalls.push({ method: 'pause' }); this.config.events.onStateChange({ target: this, data: 2 }); }
      stopVideo() { this.pauseVideo(); }
      seekTo(value) { this.time = value; this.config.events.onStateChange({ target: this, data: 2 }); }
      destroy() { this.frame.remove(); }
    }};
  })();`);
  await page.route(/https:\/\/.*youtube.*/, (route) =>
    route.fulfill({
      contentType: "application/json",
      body: '{"title":"Test video"}',
    }),
  );
  await page.goto("/");
  await page.locator("[data-video-play]").click();
  const player = page.locator('[data-media-player][data-provider="youtube"]');
  await expect(player).toHaveAttribute("data-player-status", "ready");
  await expect(
    player.locator('.plyr__controls [data-plyr="play"]'),
  ).toBeVisible();
  await expect(player.locator('[data-plyr="download"]')).toHaveCount(0);
  const calls = () =>
    page.evaluate(
      () =>
        (
          window as unknown as {
            __youtubeCalls: {
              method: string;
              host?: string;
              vars?: { controls: number };
              id?: string;
            }[];
          }
        ).__youtubeCalls,
    );
  expect(
    (await calls()).find((call) => call.method === "create"),
  ).toMatchObject({
    host: "https://www.youtube-nocookie.com",
    id: "BQTI8hXPVD0",
    vars: { controls: 0 },
  });
  await player.locator('.plyr__controls [data-plyr="play"]').click();
  expect((await calls()).some((call) => call.method === "pause")).toBe(true);
  await player.locator('.plyr__controls [data-plyr="play"]').click();
  expect(
    (await calls()).filter((call) => call.method === "play").length,
  ).toBeGreaterThan(1);
});
