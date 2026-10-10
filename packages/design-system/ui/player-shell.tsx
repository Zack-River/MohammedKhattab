"use client";
import { useRef, type ReactNode } from "react";
import { usePlayerFullscreen } from "../hooks/use-player-fullscreen";
import { getPlaybackAction } from "../helpers/media/playback-action";
import { handlePlayerKey } from "../helpers/media/player-keyboard";
import type {
  PlayerController,
  PlayerControlsVariant,
  VideoPlayerLabels,
} from "../types/video-player";
import PlayerIcon from "./player-icon";
import VideoControls from "./video-controls";
export default function PlayerShell({
  title,
  labels,
  controller,
  children,
  controlsVariant = "full",
}: {
  title: string;
  labels: VideoPlayerLabels;
  controller: PlayerController;
  children: ReactNode;
  controlsVariant?: PlayerControlsVariant;
}) {
  const shellRef = useRef<HTMLDivElement>(null);
  const { snapshot, toggle, retry } = controller;
  const { fullscreen, supported, toggleFullscreen } =
    usePlayerFullscreen(shellRef);
  const action = getPlaybackAction(snapshot, labels);
  return (
    <div
      className={`custom-video-player${controlsVariant === "overlay" ? " custom-video-player--overlay" : ""}`}
      ref={shellRef}
      tabIndex={0}
      role="region"
      aria-label={title}
      onKeyDown={(event) => handlePlayerKey(event, controller, toggleFullscreen)}
    >
      <div className="custom-video-stage" onClick={(event) => {
        if (event.target instanceof HTMLVideoElement && snapshot.ready) {
          shellRef.current?.focus({ preventScroll: true });
          toggle();
        }
      }}>
        {children}
        {controlsVariant === "overlay" && (snapshot.status === "paused" || snapshot.status === "ended") ? (
          <button
            type="button"
            className="custom-video-overlay-toggle"
            aria-label={action.label}
            title={action.label}
            disabled={!snapshot.ready}
            onClick={() => {
              shellRef.current?.focus({ preventScroll: true });
              toggle();
            }}
          >
            <PlayerIcon name={action.icon} />
          </button>
        ) : null}
      </div>
      {controlsVariant === "full" ? (
        <VideoControls
          state={snapshot}
          labels={labels}
          toggle={toggle}
          seek={controller.seek}
          toggleMute={controller.toggleMute}
          volume={controller.volume}
          fullscreen={fullscreen}
          fullscreenSupported={supported}
          toggleFullscreen={() => void toggleFullscreen()}
        />
      ) : null}
      {snapshot.status === "loading" || snapshot.status === "buffering" ? (
        <span className="custom-video-status" role="status">
          {labels.loading}
        </span>
      ) : null}
      {snapshot.status === "error" ? (
        <div className="custom-video-error" role="alert">
          <p>{labels.error}</p>
          <button type="button" className="custom-video-retry" onClick={retry}>
            {labels.retry}
          </button>
        </div>
      ) : null}
    </div>
  );
}
