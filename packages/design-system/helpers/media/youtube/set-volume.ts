import { boundedNumber } from "../bounded-number";
import type { Dispatch, SetStateAction } from "react";
import type { PlayerSnapshot, YouTubePlayerInstance } from "../../../types/video-player";
export function setYouTubeVolume(player: YouTubePlayerInstance | null, value: number, publish: Dispatch<SetStateAction<PlayerSnapshot>>) {
  const level = boundedNumber(value, 100);
  if (!player || level === null) return;
  player.setVolume(level);
  if (level > 0) player.unMute();
  else player.mute();
  publish((current) => ({ ...current, volume: level, muted: player.isMuted() }));
}
