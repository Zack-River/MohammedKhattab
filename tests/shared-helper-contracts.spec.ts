import { expect, test } from "@playwright/test";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import type { subscribeDismissal } from "@khatab/design/helpers/navigation/subscribe-dismissal";
import type { pauseOtherVideos } from "@khatab/design/helpers/media/native/pause-other-videos";
const require = createRequire(resolve("package.json"));
const { bundleBrowserModule } = require("./tests/helpers/browser-module.cjs");

test("menu dismissal respects owner, optional focus policy and cleanup", async ({ page }) => {
  await page.setContent('<nav id="root"><button id="inside">Inside</button></nav><button id="toggle">Toggle</button><button id="outside">Outside</button>');
  const result = await page.evaluate((code) => {
    const subscribe = new Function("exports", code + ";return exports.subscribeDismissal;")({}) as typeof subscribeDismissal;
    const root = document.querySelector<HTMLElement>("#root")!;
    const toggle = document.querySelector<HTMLElement>("#toggle")!;
    const outside = document.querySelector<HTMLElement>("#outside")!;
    let closes = 0;
    const dispose = subscribe({ root, toggle, onClose: () => closes++ });
    root.firstElementChild!.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    toggle.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    const insideCount = closes;
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    const restored = document.activeElement === toggle;
    outside.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    dispose();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    const afterDispose = closes;
    outside.focus();
    const noFocus = subscribe({ root, toggle, onClose: () => closes++, restoreFocus: false });
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    const retained = document.activeElement === outside;
    noFocus();
    return { insideCount, restored, afterDispose, closes, retained };
  }, bundleBrowserModule("packages/design-system/helpers/navigation/subscribe-dismissal.ts"));
  expect(result).toEqual({ insideCount: 0, restored: true, afterDispose: 2, closes: 3, retained: true });
});

test("native playback scope is configurable and defaults to the owning document", async ({ page }) => {
  await page.setContent('<section id="panel"><video id="active"></video><video id="sibling"></video></section><video id="unrelated"></video>');
  const result = await page.evaluate((code) => {
    const pause = new Function("exports", code + ";return exports.pauseOtherVideos;")({}) as typeof pauseOtherVideos;
    const panel = document.querySelector<HTMLElement>("#panel")!;
    const active = document.querySelector<HTMLVideoElement>("#active")!;
    const paused: string[] = [];
    document.querySelectorAll("video").forEach((video) => { video.pause = () => { paused.push(video.id); }; });
    pause(active, panel);
    const scoped = [...paused];
    paused.length = 0;
    pause(active);
    return { scoped, defaults: paused };
  }, bundleBrowserModule("packages/design-system/helpers/media/native/pause-other-videos.ts"));
  expect(result).toEqual({ scoped: ["sibling"], defaults: ["sibling", "unrelated"] });
});
