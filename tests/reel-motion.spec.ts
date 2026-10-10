import { expect, test } from "@playwright/test";

test("creator marquee moves left and repeats without a gap or position jump", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/7days-freelance");
  await page.mouse.move(0, 0);
  await page.evaluate(() => document.fonts.ready);
  const track = page.locator(".creators-track");
  await expect.poll(() => track.evaluate((node) => node.getAnimations().length)).toBe(1);
  const motion = await track.evaluate((node) => {
    const animation = node.getAnimations()[0];
    animation.pause();
    const duration = Number(animation.effect!.getTiming().duration);
    animation.currentTime = 0;
    const first = node.children[0].getBoundingClientRect().left;
    const start = new DOMMatrixReadOnly(getComputedStyle(node).transform).m41;
    animation.currentTime = duration / 4;
    const quarter = new DOMMatrixReadOnly(getComputedStyle(node).transform).m41;
    animation.currentTime = duration - 1;
    const repeat = node.children[node.children.length / 2].getBoundingClientRect().left;
    return { start, quarter, seam: Math.abs(first - repeat), iterations: animation.effect!.getTiming().iterations };
  });
  expect(motion.quarter).toBeLessThan(motion.start);
  expect(motion.iterations).toBe(Infinity);
  expect(motion.seam).toBeLessThan(0.2);
});

test("reduced motion reproduces the static reels and turning it off restores animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/7days-freelance");
  const card = page.locator(".reel-card").first();
  const track = page.locator(".creators-track");
  await expect(track).toHaveCSS("animation-name", "none");
  await expect(card).toHaveCSS("transition-duration", "0s");
  await expect(card.locator(".reel-play-btn")).toHaveCSS("transition-duration", "0s");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(track).toHaveCSS("animation-name", "marqueeScroll");
  await expect.poll(() => track.evaluate((node) => node.getAnimations().some((animation) => animation.playState === "running"))).toBe(true);
  expect(await card.evaluate((node) => getComputedStyle(node).transitionDuration)).toContain("0.5s");
  await card.hover();
  await expect.poll(() => card.evaluate((node) => node.getAnimations().some((animation) =>
    animation instanceof CSSTransition && animation.transitionProperty === "transform",
  ))).toBe(true);
});
