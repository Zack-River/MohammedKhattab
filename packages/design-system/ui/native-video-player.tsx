"use client";
import { useRef } from "react";
import { useNativeVideoPlayer } from "../hooks/use-native-video-player";
import type {
  FileVideoSource,
  PlayerControlsVariant,
  VideoPlayerLabels,
} from "../types/video-player";
import PlayerShell from "./player-shell";
export default function NativeVideoPlayer({
  source,
  title,
  labels,
  controlsVariant,
  onEnded,
  onPlay,
}: {
  source: FileVideoSource;
  title: string;
  labels: VideoPlayerLabels;
  controlsVariant?: PlayerControlsVariant;
  onEnded?: () => void;
  onPlay?: () => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const controller = useNativeVideoPlayer(ref, source.url);
  return (
    <PlayerShell
      title={title}
      labels={labels}
      controller={controller}
      controlsVariant={controlsVariant}
    >
      <video
        ref={ref}
        className="custom-video-element"
        src={source.url}
        poster={source.poster}
        aria-label={title}
        autoPlay
        playsInline
        preload="metadata"
        controls={false}
        onEnded={onEnded}
        onPlay={onPlay}
        controlsList="nodownload"
        disablePictureInPicture
      />
    </PlayerShell>
  );
}
