export interface VideoPlayerLabels {
  play: string;
  pause: string;
  replay: string;
  mute: string;
  unmute: string;
  seek: string;
  volume: string;
  enterFullscreen: string;
  exitFullscreen: string;
  loading: string;
  error: string;
  retry: string;
  controls: string;
}
export interface YouTubePlayerInstance {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  setVolume(volume: number): void;
  getVolume(): number;
  getCurrentTime(): number;
  getDuration(): number;
  destroy(): void;
}
export interface YouTubePlayerEvent {
  target: YouTubePlayerInstance;
  data?: number;
}
export interface YouTubeAPI {
  Player: new (
    element: HTMLElement | string,
    options: {
      videoId?: string;
      playerVars?: Record<string, string | number | boolean>;
      events: {
        onReady(event: YouTubePlayerEvent): void;
        onStateChange(event: YouTubePlayerEvent): void;
        onError?(event: YouTubePlayerEvent): void;
        onAutoplayBlocked?(event: YouTubePlayerEvent): void;
      };
    },
  ) => YouTubePlayerInstance;
}
export type PlayerStatus =
  "loading" | "playing" | "paused" | "buffering" | "ended" | "error";
export interface PlayerSnapshot {
  status: PlayerStatus;
  ready: boolean;
  time: number;
  duration: number;
  volume: number;
  muted: boolean;
}

export interface PlayerController {
  snapshot: PlayerSnapshot;
  toggle(): void;
  seek(time: number): void;
  toggleMute(): void;
  volume(value: number): void;
  retry(): void;
}
export interface FileVideoSource {
  kind: "file";
  url: string;
  poster?: string;
}

export type PlayerControlsVariant = "full" | "overlay";

export type VideoSourceProps =
  { url: string; source?: never } | { source: FileVideoSource; url?: never };
