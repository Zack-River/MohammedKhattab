import type { Dispatch, SetStateAction } from "react";
import type { PlayerSnapshot } from "../../../types/video-player";
import { playNativeVideo } from "./play";
export function retryNativeVideo(getVideo: () => HTMLVideoElement | null, publish: Dispatch<SetStateAction<PlayerSnapshot>>) {
  getVideo()?.load();
  playNativeVideo(getVideo, publish);
}
