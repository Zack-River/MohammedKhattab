"use client";
import { formatPlayerTime } from "../helpers/media/format-time";
import { getPlaybackAction } from "../helpers/media/playback-action";
import type { PlayerSnapshot, VideoPlayerLabels } from "../types/video-player";
import PlayerIcon from "./player-icon";
import VideoVolumeControls from "./video-volume-controls";
export default function VideoControls({
  state,
  labels,
  toggle,
  seek,
  toggleMute,
  volume,
  fullscreen,
  fullscreenSupported,
  toggleFullscreen,
}: {
  state: PlayerSnapshot;
  labels: VideoPlayerLabels;
  toggle: () => void;
  seek: (time: number) => void;
  toggleMute: () => void;
  volume: (value: number) => void;
  fullscreen: boolean;
  fullscreenSupported: boolean;
  toggleFullscreen: () => void;
}) {
  const action = getPlaybackAction(state, labels);
  return (
    <div
      className="custom-video-controls"
      role="group"
      aria-label={labels.controls}
      dir="ltr"
    >
      <input
        className="custom-video-seek"
        type="range"
        min={0}
        max={state.duration || 1}
        step="0.1"
        value={state.time}
        aria-label={labels.seek}
        aria-valuetext={`${formatPlayerTime(state.time)} / ${formatPlayerTime(state.duration)}`}
        disabled={!state.ready || state.duration <= 0}
        onChange={(event) => seek(Number(event.target.value))}
      />
      <div className="custom-video-control-row">
        <button
          type="button"
          className="custom-video-control"
          aria-label={action.label}
          title={action.label}
          disabled={!state.ready}
          onClick={toggle}
        >
          <PlayerIcon name={action.icon} />
        </button>
        <span className="custom-video-time">
          <time>{formatPlayerTime(state.time)}</time>
          <span aria-hidden="true"> / </span>
          <time>{formatPlayerTime(state.duration)}</time>
        </span>
        <VideoVolumeControls state={state} labels={labels} toggleMute={toggleMute} volume={volume} />
        <button
          type="button"
          className="custom-video-control"
          aria-label={
            fullscreen ? labels.exitFullscreen : labels.enterFullscreen
          }
          title={fullscreen ? labels.exitFullscreen : labels.enterFullscreen}
          disabled={!fullscreenSupported}
          onClick={toggleFullscreen}
        >
          <PlayerIcon name={fullscreen ? "exit-fullscreen" : "fullscreen"} />
        </button>
      </div>
    </div>
  );
}
