import type { Dispatch, SetStateAction } from "react";
import type { PlayerSnapshot } from "../../../types/video-player";
export function playNativeVideo(getVideo: () => HTMLVideoElement | null, publish: Dispatch<SetStateAction<PlayerSnapshot>>) {
  const video = getVideo();
  if (!video) return;
  void video.play().catch((error) => {
    if (getVideo() !== video || !video.hasAttribute("src") || error.name === "AbortError") return;
    publish((previous) => ({ ...previous, status: error.name === "NotAllowedError" ? "paused" : "error" }));
  });
}
