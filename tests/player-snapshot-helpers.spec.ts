import { expect, test } from "@playwright/test";
import { initialPlayerSnapshot } from "../packages/design-system/helpers/media/initial-snapshot";
import { readNativeSnapshot } from "../packages/design-system/helpers/media/native/read-snapshot";

test("native snapshot priority preserves loading, error and completion across nonfinite media values", () => {
  const previous = initialPlayerSnapshot();
  const video = { error: null as MediaError | null, ended: false, paused: true, readyState: 0,
    currentTime: Number.NaN, duration: Infinity, volume: .375, muted: true };
  expect(readNativeSnapshot(video as HTMLVideoElement, previous)).toEqual({
    status: "loading", ready: false, time: 0, duration: 0, volume: 38, muted: true,
  });
  video.readyState = 2;
  video.paused = false;
  expect(readNativeSnapshot(video as HTMLVideoElement, previous).status).toBe("buffering");
  video.readyState = 3;
  expect(readNativeSnapshot(video as HTMLVideoElement, previous).status).toBe("playing");
  video.ended = true;
  expect(readNativeSnapshot(video as HTMLVideoElement, previous).status).toBe("ended");
  video.error = {} as MediaError;
  expect(readNativeSnapshot(video as HTMLVideoElement, previous)).toMatchObject({ status: "error", ready: false });
});
