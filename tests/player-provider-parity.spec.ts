import { expect, test } from "@playwright/test";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { youtubeSdkStub } from "./helpers/youtube-sdk-stub";
const require = createRequire(resolve("package.json"));
const { bundleBrowserModule } = require("./tests/helpers/browser-module.cjs");
const fixtureUrl = process.env.REUSE_BASE_URL ?? "http://localhost:3043";
async function installSdk(page: import("@playwright/test").Page) {
  await page.route("https://www.youtube.com/iframe_api", (route) => route.fulfill({ contentType: "application/javascript", body: youtubeSdkStub }));
  await page.route("**/embed/**", (route) => route.fulfill({ contentType: "text/html", body: "<html></html>" }));
}
async function endSdk(page: import("@playwright/test").Page) {
  await page.evaluate(() => {
    const players = (window as unknown as { sdkPlayers: { destroyed: boolean; events: { onStateChange: (event: { data: number }) => void } }[] }).sdkPlayers;
    players.findLast((p) => !p.destroyed)!.events.onStateChange({ data: 0 });
  });
}

test("R02 YouTube honors overlay and both end policies and releases exclusive sessions", async ({ page }) => {
  await installSdk(page);
  await page.goto(`${fixtureUrl}/youtube-player`);
  await page.getByRole("button", { name: "Overlay mode" }).click();
  await page.getByRole("button", { name: "Activate SDK", exact: true }).click();
  const player = page.getByRole("region", { name: "SDK player", exact: true });
  await expect(player).toHaveClass(/--overlay/);
  await expect(player.locator(".custom-video-controls")).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => (window as unknown as { sdkPlayers?: unknown[] }).sdkPlayers?.length ?? 0)).toBe(1);
  await endSdk(page);
  await expect(player.getByRole("button", { name: "إعادة تشغيل الفيديو", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Activate second" }).click();
  await expect(page.getByRole("button", { name: "Activate SDK", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Reset on end" }).click();
  await page.getByRole("button", { name: "Activate SDK", exact: true }).click();
  await expect(player).toBeVisible();
  await expect.poll(() => page.evaluate(() => (window as unknown as { sdkPlayers?: unknown[] }).sdkPlayers?.length ?? 0)).toBe(3);
  await endSdk(page);
  await expect(page.getByRole("button", { name: "Activate SDK", exact: true })).toBeVisible();
  expect(await page.evaluate(() => (window as unknown as { sdkPlayers: { destroyed: boolean }[] }).sdkPlayers.map((p) => p.destroyed))).toEqual([true, true, true]);
});

test("R01 learner uses custom controls, resets on viewport exit and on completion", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 500 });
  await installSdk(page);
  await page.goto("/learn/editing-foundations/first-cut");
  const poster = page.getByRole("button", { name: /تشغيل أول كات/ });
  await poster.click();
  const player = page.locator(".lms-lesson-player .custom-video-player");
  await expect(player.locator(".custom-video-controls")).toBeVisible();
  await expect(page.locator("iframe")).toHaveAttribute("src", /controls=0.*enablejsapi=1/);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(poster).toBeVisible();
  await expect(page.locator("iframe")).toHaveCount(0);
  await poster.scrollIntoViewIfNeeded();
  await poster.click();
  await expect(player).toBeVisible();
  await expect.poll(() => page.evaluate(() => (window as unknown as { sdkPlayers?: unknown[] }).sdkPlayers?.length ?? 0)).toBe(2);
  await endSdk(page);
  await expect(poster).toBeVisible();
});

test("R08 media bounds handle nonfinite and out-of-range inputs before real property assignments", async ({ page }) => {
  await page.goto("/");
  const sources = Object.fromEntries(["native/seek", "native/set-volume", "youtube/seek", "youtube/set-volume"].map((file) => [file, bundleBrowserModule(`packages/design-system/helpers/media/${file}.ts`)]));
  const actual = await page.evaluate((sources) => {
    const modules: Record<string, Record<string, (...args: unknown[]) => void>> = {};
    for (const [name, source] of Object.entries(sources)) { const exports = {}; new Function("exports", source as string)(exports); modules[name] = exports; }
    const video = document.createElement("video"); Object.defineProperty(video, "duration", { value: 100 });
    const levels: number[] = [], seeks: number[] = [];
    const sdk = { seekTo: (value: number) => seeks.push(value), setVolume: (value: number) => levels.push(value), mute() {}, unMute() {}, isMuted: () => false };
    let publications = 0; const publish = () => publications++;
    for (const value of [NaN, Infinity, -Infinity]) {
      modules["native/seek"].seekNativeVideo(video, value, publish);
      modules["native/set-volume"].setNativeVolume(video, value);
      modules["youtube/seek"].seekYouTubePlayer(sdk, 100, value, publish);
      modules["youtube/set-volume"].setYouTubeVolume(sdk, value, publish);
    }
    const invalidPublications = publications;
    for (const value of [-1, 200]) {
      modules["native/seek"].seekNativeVideo(video, value, publish);
      modules["native/set-volume"].setNativeVolume(video, value);
      modules["youtube/seek"].seekYouTubePlayer(sdk, 100, value, publish);
      modules["youtube/set-volume"].setYouTubeVolume(sdk, value, publish);
    }
    modules["youtube/seek"].seekYouTubePlayer(sdk, Infinity, 1, publish);
    return { invalidPublications, seeks, levels, time: video.currentTime, volume: video.volume };
  }, sources);
  expect(actual).toEqual({ invalidPublications: 0, seeks: [0, 100], levels: [0, 100], time: 100, volume: 1 });
});

test("R06 header state uses the supplied hero element rather than a literal document ID", async ({ page }) => {
  await page.setContent('<style>header{--personal-header-scroll-threshold:10}</style><div id="hero"></div><header><span class="p-ref-brand-name"></span></header><div id="custom-hero" style="height:300px"></div>');
  const code = bundleBrowserModule("modules/helpers/portfolio/update-header.ts");
  const actual = await page.evaluate((code) => {
    const exports: { updatePortfolioHeader?: (header: HTMLElement, hero: HTMLElement | null) => void } = {};
    new Function("exports", code)(exports);
    const header = document.querySelector("header")!;
    exports.updatePortfolioHeader!(header, document.getElementById("custom-hero"));
    const active = header.querySelector("span")!.classList.contains("p-ref-is-hero-active");
    exports.updatePortfolioHeader!(header, null);
    return { active, inactiveWithoutTarget: !header.querySelector("span")!.classList.contains("p-ref-is-hero-active") };
  }, code);
  expect(actual).toEqual({ active: true, inactiveWithoutTarget: true });
});
