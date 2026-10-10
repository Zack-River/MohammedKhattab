"use client";
import { useRef } from "react";
import { useYouTubePlayer } from "../hooks/use-youtube-player";
import type { VideoPlayerLabels, PlayerControlsVariant } from "../types/video-player";
import PlayerShell from "./player-shell";
export default function YouTubePlayer({
  url,
  title,
  labels,
  controlsVariant,
  onPlay,
  onEnded,
}: {
  url: string;
  title: string;
  labels: VideoPlayerLabels;
  controlsVariant?: PlayerControlsVariant;
  onPlay?: () => void;
  onEnded?: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const controller = useYouTubePlayer(hostRef, url, title, { onPlay, onEnded });
  return (
    <PlayerShell title={title} labels={labels} controller={controller} controlsVariant={controlsVariant}>
      <div className="custom-video-iframe-host" ref={hostRef} />
    </PlayerShell>
  );
}
