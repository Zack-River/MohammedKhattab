import type { CSSProperties } from "react";
import type { MediaPlayerProps } from "../../types/media-player";
export function mediaPlayerStyle({ width, height, aspectRatio, color }: Pick<MediaPlayerProps, "width" | "height" | "aspectRatio" | "color">): CSSProperties & { "--media-player-accent"?: string } {
  return { width, height, aspectRatio: height === undefined ? aspectRatio : undefined, "--media-player-accent": color };
}
