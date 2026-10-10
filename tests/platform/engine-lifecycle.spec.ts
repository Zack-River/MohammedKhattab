import { expect, test } from "@playwright/test";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import type { createScrollReveals } from "../../packages/design-system/lib/scroll-reveals";
const require = createRequire(resolve("package.json"));
const { bundleBrowserModule } = require("./tests/helpers/browser-module.cjs");
const compiled = bundleBrowserModule("packages/design-system/lib/scroll-reveals.ts");
test("T25 T26 T27 T28 engine owns targets, future motion and ten clean lifecycles", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.setContent(
    "<style>body{margin:0;padding-bottom:1000px}[data-reveal]{height:40px}</style>",
  );
  const result = await page.evaluate(async (code) => {
    const create = new Function(
      "exports",
      code + ";return exports.createScrollReveals;",
    )({}) as typeof createScrollReveals;
    const frame = () =>
      new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    const tick = async () => {
      await frame();
      await frame();
    };
    const observers = new Set<object>();
    const NativeIntersection = window.IntersectionObserver;
    const NativeMutation = window.MutationObserver;
    window.IntersectionObserver = class extends NativeIntersection {
      observe(target: Element) {
        observers.add(this);
        super.observe(target);
      }
      disconnect() {
        observers.delete(this);
        super.disconnect();
      }
    };
    window.MutationObserver = class extends NativeMutation {
      observe(target: Node, options: MutationObserverInit) {
        observers.add(this);
        super.observe(target, options);
      }
      disconnect() {
        observers.delete(this);
        super.disconnect();
      }
    };
    const listeners = new Set<EventListenerOrEventListenerObject>();
    const preference = new EventTarget() as EventTarget & { matches: boolean };
    preference.matches = false;
    const add = preference.addEventListener.bind(preference),
      remove = preference.removeEventListener.bind(preference);
    preference.addEventListener = (type, listener, options) => {
      if (listener) listeners.add(listener);
      add(type, listener, options);
    };
    preference.removeEventListener = (type, listener, options) => {
      if (listener) listeners.delete(listener);
      remove(type, listener, options);
    };
    const media = preference as unknown as MediaQueryList;
    const options = {
      viewportThreshold: 0.9,
      easing: "linear",
      groups: [{ trigger: "[data-reveal]", y: 32, duration: 1000 }],
    };
    let occurrences = 0,
      duplicate = false,
      offscreenPremature = false,
      intermediate = false,
      reinsertion = false;
    for (let cycle = 0; cycle < 10; cycle++) {
      window.scrollTo(0, 0);
      const root = document.createElement("div");
      root.dataset.revealScope = "outer";
      root.innerHTML =
        '<div data-reveal>ONE</div><div data-reveal-scope="inner"><div data-reveal>TWO</div></div><div data-reveal style="margin-top:2000px">FUTURE</div>';
      document.body.append(root);
      const one = root.children[0],
        inner = root.children[1] as HTMLElement,
        future = root.children[2];
      const cleanup = create({ root, options, preference: media }),
        cleanupInner = create({ root: inner, options, preference: media });
      await tick();
      const animation = one.getAnimations()[0];
      occurrences += one.getAnimations().length;
      duplicate ||= inner.children[0].getAnimations().length !== 1;
      offscreenPremature ||= future.getAnimations()[0]?.playState !== "paused";
      animation.pause();
      animation.currentTime = 500;
      const opacity = Number(getComputedStyle(one).opacity);
      intermediate ||= opacity > 0 && opacity < 1;
      animation.play();
      // Reduction settles current content and leaves the future occurrence eligible.
      preference.matches = true;
      preference.dispatchEvent(new Event("change"));
      await tick();
      duplicate ||= root.getAnimations({ subtree: true }).length !== 0;
      preference.matches = false;
      preference.dispatchEvent(new Event("change"));
      await tick();
      duplicate ||= one.getAnimations().length !== 0;
      offscreenPremature ||= future.getAnimations()[0]?.playState !== "paused";
      future.scrollIntoView({ behavior: "instant" });
      await tick();
      duplicate ||= future.getAnimations()[0]?.playState !== "running";
      // Reusing the same DOM object after removal is a new occurrence.
      future.remove();
      root.append(future);
      await tick();
      reinsertion ||= future.getAnimations().length === 1;
      cleanupInner();
      cleanup();
      root.remove();
      await tick();
      if (observers.size || listeners.size || document.getAnimations().length)
        duplicate = true;
    }
    return {
      occurrences,
      duplicate,
      offscreenPremature,
      intermediate,
      reinsertion,
      observers: observers.size,
      listeners: listeners.size,
    };
  }, compiled);
  expect(result).toEqual({
    occurrences: 10,
    duplicate: false,
    offscreenPremature: false,
    intermediate: true,
    reinsertion: true,
    observers: 0,
    listeners: 0,
  });
});
