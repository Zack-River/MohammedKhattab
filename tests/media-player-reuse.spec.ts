import { expect, test } from "@playwright/test";
import { createServer, type ServerResponse } from "node:http";
import { readFile } from "node:fs/promises";
const fixtureUrl = process.env.REUSE_BASE_URL ?? "http://localhost:3043";
test("public MediaPlayer props size and color independent instances and reset changed sources", async ({
  page,
}) => {
  await page.goto(`${fixtureUrl}/media-player`);
  const custom = page.locator('[data-player="custom"]'),
    other = page.locator('[data-player="other"]');
  const appearance = async (scope: typeof custom) =>
    scope.locator(".media-player").evaluate((node) => {
      const box = node.getBoundingClientRect(),
        button = node.querySelector(
          ".media-player-toggle,.custom-video-overlay-toggle",
        )!;
      return {
        width: box.width,
        height: box.height,
        color: getComputedStyle(button).backgroundColor,
      };
    });
  expect(await appearance(custom)).toEqual({
    width: 320,
    height: 180,
    color: "rgb(54, 243, 41)",
  });
  expect(await appearance(other)).toEqual({
    width: 240,
    height: 150,
    color: "rgb(252, 53, 34)",
  });
  await expect(page.locator("video")).toHaveCount(0);
  await custom.getByRole("button", { name: "PLAY", exact: true }).click();
  await expect
    .poll(() =>
      custom
        .locator("video")
        .evaluate((node) => (node as HTMLVideoElement).readyState),
    )
    .toBeGreaterThanOrEqual(2);
  await expect(custom.getByRole("button", { name: "PAUSE", exact: true })).toHaveCount(0);
  await custom.locator("video").click();
  await expect(custom.getByRole("button", { name: "PLAY", exact: true })).toBeVisible();
  expect(await appearance(custom)).toEqual({
    width: 320,
    height: 180,
    color: "rgb(54, 243, 41)",
  });
  await expect(other.locator("video")).toHaveCount(0);
  await expect
    .poll(() =>
      custom
        .locator("video")
        .evaluate((node) => (node as HTMLVideoElement).paused),
    )
    .toBe(true);
  await page.getByRole("button", { name: "Change source" }).click();
  await expect(custom.locator("video")).toHaveCount(0);
  await expect(custom.locator("img")).toHaveAttribute(
    "src",
    "/assets/images/instructor.webp",
  );
  await custom.getByRole("button", { name: "PLAY", exact: true }).click();
  await expect(custom.locator("video")).toHaveAttribute(
    "src",
    "/assets/video/workshop-intro.mp4?replacement",
  );
  await expect
    .poll(() =>
      custom
        .locator("video")
        .evaluate((node) => (node as HTMLVideoElement).readyState),
    )
    .toBeGreaterThanOrEqual(2);
  await custom.locator("video").evaluate((node) => {
    const v = node as HTMLVideoElement;
    v.currentTime = v.duration - 0.1;
    void v.play();
  });
  await expect(custom.locator(".media-player-poster")).toBeVisible();
  await expect(custom.locator("video")).toHaveCount(0);
});

test("scrolling out resets playback and returning waits for another play click", async ({ page }) => {
  await page.goto(`${fixtureUrl}/media-player`);
  const player = page.locator('[data-player="custom"]');
  await player.getByRole("button", { name: "PLAY", exact: true }).click();
  const video = player.locator("video");
  await expect.poll(() => video.evaluate((node) => (node as HTMLVideoElement).paused)).toBe(false);
  const oldVideo = await video.elementHandle();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(video).toHaveCount(0);
  expect(await oldVideo!.evaluate((node) => ({
    src: node.getAttribute("src"), paused: (node as HTMLVideoElement).paused, ready: (node as HTMLVideoElement).readyState,
  }))).toEqual({ src: null, paused: true, ready: 0 });
  await player.scrollIntoViewIfNeeded();
  await expect(player.locator(".media-player-poster")).toBeVisible();
  await expect(video).toHaveCount(0);
  await player.getByRole("button", { name: "PLAY", exact: true }).click();
  await expect.poll(() => video.evaluate((node) => (node as HTMLVideoElement).paused)).toBe(false);
  expect(await video.evaluate((node) => (node as HTMLVideoElement).currentTime)).toBeLessThan(3);
});

for (const trigger of ["scroll", "another video"] as const)
  test(`${trigger} reset aborts an unfinished media response while buffering`, async ({ page }) => {
  const bytes = await readFile("public/assets/video/workshop-intro.mp4");
  const active = new Set<ServerResponse>();
  let aborted = 0;
  const server = createServer((request, response) => {
    const start = Number(request.headers.range?.match(/bytes=(\d+)-/)?.[1] ?? 0);
    response.writeHead(request.headers.range ? 206 : 200, {
      "Content-Type": "video/mp4", "Content-Length": bytes.length - start,
      "Accept-Ranges": "bytes", "Access-Control-Allow-Origin": "*",
      ...(request.headers.range ? { "Content-Range": `bytes ${start}-${bytes.length - 1}/${bytes.length}` } : {}),
    });
    active.add(response);
    let offset = start;
    const timer = setInterval(() => {
      const end = Math.min(offset + 32768, bytes.length);
      response.write(bytes.subarray(offset, end));
      offset = end;
      if (offset === bytes.length) response.end();
    }, 100);
    response.on("close", () => {
      clearInterval(timer);
      active.delete(response);
      if (offset < bytes.length) aborted++;
    });
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Missing media server port");
  try {
    await page.goto(`${fixtureUrl}/media-player`);
    await page.getByLabel("Video URL").fill(`http://127.0.0.1:${address.port}/slow.mp4`);
    const player = page.locator('[data-player="custom"]');
    await player.getByRole("button", { name: "PLAY", exact: true }).click();
    await expect.poll(() => active.size).toBeGreaterThan(0);
    const before = aborted;
    if (trigger === "scroll")
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    else
      await page.locator('[data-player="other"]').getByRole("button", { name: "PLAY", exact: true }).click();
    await expect(player.locator("video")).toHaveCount(0);
    await expect.poll(() => aborted).toBeGreaterThan(before);
    await expect.poll(() => active.size).toBe(0);
    await player.scrollIntoViewIfNeeded();
    await expect(player.locator(".media-player-poster")).toBeVisible();
    expect(active.size).toBe(0);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});


for (const previousState of ["playing", "paused"] as const)
  test(`starting another video restores the ${previousState} player's thumbnail and releases its source`, async ({ page }) => {
    await page.goto(`${fixtureUrl}/media-player`);
    const first = page.locator('[data-player="custom"]');
    const second = page.locator('[data-player="other"]');
    await first.getByRole("button", { name: "PLAY", exact: true }).click();
    const video = first.locator("video");
    await expect.poll(() => video.evaluate((node) => (node as HTMLVideoElement).readyState)).toBeGreaterThanOrEqual(2);
    await expect.poll(() => video.evaluate((node) => (node as HTMLVideoElement).paused)).toBe(false);
    if (previousState === "paused") {
      await video.click();
      await expect.poll(() => video.evaluate((node) => (node as HTMLVideoElement).paused)).toBe(true);
    }
    const previousVideo = await video.elementHandle();
    await second.getByRole("button", { name: "PLAY", exact: true }).click();
    await expect(first.locator(".media-player-poster")).toBeVisible();
    await expect(first.locator("img")).toHaveAttribute("src", "/assets/images/workshop-video-poster.jpg");
    await expect(video).toHaveCount(0);
    expect(await previousVideo!.evaluate((node) => ({
      src: node.getAttribute("src"), paused: (node as HTMLVideoElement).paused,
      ready: (node as HTMLVideoElement).readyState,
    }))).toEqual({ src: null, paused: true, ready: 0 });
    await expect.poll(() => second.locator("video").evaluate((node) => (node as HTMLVideoElement).paused)).toBe(false);
    const secondVideo = await second.locator("video").elementHandle();
    await first.getByRole("button", { name: "PLAY", exact: true }).click();
    await expect(second.locator(".media-player-poster")).toBeVisible();
    await expect(second.locator("video")).toHaveCount(0);
    expect(await secondVideo!.getAttribute("src")).toBeNull();
    await expect.poll(() => video.evaluate((node) => (node as HTMLVideoElement).paused)).toBe(false);
    expect(await video.evaluate((node) => (node as HTMLVideoElement).currentTime)).toBeLessThan(3);
    await expect(page.locator("video")).toHaveCount(1);
  });
