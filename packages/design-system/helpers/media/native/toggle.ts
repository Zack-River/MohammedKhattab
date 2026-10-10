import type { Dispatch, SetStateAction } from "react";
import type { PlayerSnapshot } from "../../../types/video-player";
import { playNativeVideo } from "./play";
export function toggleNativeVideo(getVideo: () => HTMLVideoElement | null, publish: Dispatch<SetStateAction<PlayerSnapshot>>) {
  const video = getVideo();
  if (!video) return;
  if (video.paused || video.ended) playNativeVideo(getVideo, publish);
  else video.pause();
}
