import type { CSSProperties, ReactNode } from "react";
import type { PlayerControlsVariant, VideoPlayerLabels } from "./video-player";

export interface MediaPlayerProps {
  /** Playable file/stream URL or embeddable individual YouTube URL. */
  videoUrl: string;
  thumbnailUrl: string;
  title?: string;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  aspectRatio?: CSSProperties["aspectRatio"];
  /** Playback-button / timeline accent; defaults to the global theme. */
  color?: CSSProperties["color"];
  controlsVariant?: PlayerControlsVariant;
  returnToPosterOnEnd?: boolean;
  /** Enter fullscreen directly from the thumbnail activation gesture. */
  fullscreenOnPlay?: boolean;
  /** Restore the poster and cancel media loading when scrolled out of view. */
  resetOnScrollOut?: boolean;
  labels?: VideoPlayerLabels;
  playLabel?: string;
  className?: string;
  placeholderClassName?: string;
  playButtonClassName?: string;
  thumbnailLoading?: "eager" | "lazy";
  children?: ReactNode;
}
