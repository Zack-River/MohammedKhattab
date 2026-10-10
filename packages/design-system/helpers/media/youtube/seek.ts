import { boundedNumber } from "../bounded-number";
import type { Dispatch, SetStateAction } from "react";
import type { PlayerSnapshot, YouTubePlayerInstance } from "../../../types/video-player";
export function seekYouTubePlayer(player: YouTubePlayerInstance | null, duration: number, time: number, publish: Dispatch<SetStateAction<PlayerSnapshot>>) {
  const value = boundedNumber(time, duration);
  if (!player || value === null) return;
  player.seekTo(value, true);
  publish((current) => ({ ...current, time: value }));
}
