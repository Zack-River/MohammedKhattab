import { boundedNumber } from "../bounded-number";
import type { Dispatch, SetStateAction } from "react";
import type { PlayerSnapshot } from "../../../types/video-player";
export function seekNativeVideo(video: HTMLVideoElement | null, time: number, publish: Dispatch<SetStateAction<PlayerSnapshot>>) {
  if (!video) return;
  const value = boundedNumber(time, video.duration);
  if (value === null) return;
  video.currentTime = value;
  // Publish immediately so consecutive keyboard seeks use the requested position.
  publish((previous) => ({ ...previous, time: video.currentTime }));
}
