import type { PlayerSnapshot, VideoPlayerLabels } from "../../types/video-player";
export function getPlaybackAction(
  state: PlayerSnapshot,
  labels: VideoPlayerLabels,
) {
  const playing = state.status === "playing" || state.status === "buffering";
  return {
    label:
      state.status === "ended"
        ? labels.replay
        : playing
          ? labels.pause
          : labels.play,
    icon:
      state.status === "ended"
        ? ("replay" as const)
        : playing
          ? ("pause" as const)
          : ("play" as const),
  };
}
