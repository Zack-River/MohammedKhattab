"use client";
import type { PlayerSnapshot, VideoPlayerLabels } from "../types/video-player";
import PlayerIcon from "./player-icon";
export default function VideoVolumeControls({ state, labels, toggleMute, volume }: {
  state: PlayerSnapshot; labels: VideoPlayerLabels; toggleMute: () => void; volume: (value: number) => void;
}) {
  return (
    <div className="custom-video-volume-group">
      <button type="button" className="custom-video-control"
        aria-label={state.muted ? labels.unmute : labels.mute}
        title={state.muted ? labels.unmute : labels.mute}
        aria-pressed={state.muted} disabled={!state.ready} onClick={toggleMute}>
        <PlayerIcon name={state.muted ? "muted" : "volume"} />
      </button>
      <input className="custom-video-volume" type="range" min={0} max={100}
        value={state.muted ? 0 : state.volume} aria-label={labels.volume}
        disabled={!state.ready} onChange={(event) => volume(Number(event.target.value))} />
    </div>
  );
}
