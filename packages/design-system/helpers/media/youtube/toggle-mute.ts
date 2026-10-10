import type { Dispatch, SetStateAction } from "react";
import type { PlayerSnapshot, YouTubePlayerInstance } from "../../../types/video-player";
import { youtubePlayerPolicy } from "../../../config/youtube-player";
export function toggleYouTubeMute(player: YouTubePlayerInstance | null, publish: Dispatch<SetStateAction<PlayerSnapshot>>) {
  if (!player) return;
  if (player.isMuted()) {
    player.unMute();
    if (player.getVolume() === 0) player.setVolume(youtubePlayerPolicy.initialVolume);
  } else player.mute();
  publish((current) => ({ ...current, muted: player.isMuted(), volume: player.getVolume() }));
}
