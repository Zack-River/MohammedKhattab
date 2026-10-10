import type { PlayerSnapshot, YouTubePlayerInstance } from "../../../types/video-player";
export function toggleYouTubePlayer(player: YouTubePlayerInstance | null, snapshot: PlayerSnapshot) {
  if (!player || !snapshot.ready) return;
  if (snapshot.status === "playing" || snapshot.status === "buffering") player.pauseVideo();
  else {
    if (snapshot.status === "ended") player.seekTo(0, true);
    player.playVideo();
  }
}
