import { pauseOtherVideos } from "./pause-other-videos";
import type { Dispatch, SetStateAction } from "react";
import type { PlayerSnapshot } from "../../../types/video-player";
import { readNativeSnapshot } from "./read-snapshot";
import { releaseVideoSource } from "./release-source";
export interface NativeSubscriptionOptions {
  video: HTMLVideoElement;
  sourceUrl: string;
  publish: Dispatch<SetStateAction<PlayerSnapshot>>;
  playbackScope?: ParentNode;
}
export function subscribeNativePlayer({ video, sourceUrl, publish, playbackScope }: NativeSubscriptionOptions) {
  // Restore the source after development-mode effect replay.
  if (video.getAttribute("src") !== sourceUrl) video.setAttribute("src", sourceUrl);
  const update = () => publish((previous) => readNativeSnapshot(video, previous));
  const playing = () => {
    pauseOtherVideos(video, playbackScope);
    update();
  };
  const waiting = () => publish((previous) => ({ ...previous, status: "buffering" }));
  const events = ["loadedmetadata", "durationchange", "timeupdate", "seeking", "seeked", "pause", "playing", "ended", "volumechange", "error", "canplay"];
  events.forEach((name) => video.addEventListener(name, update));
  video.addEventListener("play", playing);
  video.addEventListener("waiting", waiting);
  update();
  return () => {
    events.forEach((name) => video.removeEventListener(name, update));
    video.removeEventListener("play", playing);
    video.removeEventListener("waiting", waiting);
    releaseVideoSource(video);
  };
}
