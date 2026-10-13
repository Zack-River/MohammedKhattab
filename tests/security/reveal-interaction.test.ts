import assert from "node:assert/strict";
import { test } from "node:test";
import { createEntrance } from "../../packages/design-system/helpers/motion/create-entrance";
function capture(mode: string | null) {
  let frames: Keyframe[] = [], options: KeyframeAnimationOptions = {}, paused = false;
  const target = { getAttribute: () => mode, animate: (keyframes: Keyframe[], settings: KeyframeAnimationOptions) => {
    frames = keyframes; options = settings; return { pause: () => { paused = true; } };
  } } as unknown as Element;
  createEntrance(target, { trigger: "[data-reveal]", y: 32, duration: 500, delay: 50, stagger: 80 }, 2, "ease");
  return { frames, options, paused };
}
test("Interactive fade targets keep their hit area stationary and retain centralized timing", () => {
  const result = capture("fade");
  assert.deepEqual(result.frames.map(frame => frame.transform), ["none", "none"]);
  assert.deepEqual(result.frames.map(frame => frame.opacity), [0, 1]);
  assert.equal(result.options.duration, 500);
  assert.equal(result.options.delay, 210);
  assert.equal(result.paused, true);
});
test("Default reveals retain their configured movement", () => {
  assert.match(String(capture(null).frames[0].transform), /translate3d\(0px,32px,0\)/);
});
