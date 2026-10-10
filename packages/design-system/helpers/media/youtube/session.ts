import type { Dispatch, RefObject, SetStateAction } from "react";
import type { PlayerSnapshot, YouTubePlayerInstance } from "../../../types/video-player";
export interface YouTubeSession {
  disposed: boolean;
  onPlay?: () => void;
  onEnded?: () => void;
  player?: YouTubePlayerInstance;
  interval?: number;
  timeout?: number;
  playerRef: RefObject<YouTubePlayerInstance | null>;
  publish: Dispatch<SetStateAction<PlayerSnapshot>>;
}
