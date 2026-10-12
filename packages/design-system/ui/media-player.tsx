"use client";
import { useMediaPlayerSession } from "../hooks/use-media-player-session";
import { mediaPlayerStyle } from "../helpers/media/appearance";
import type { MediaPlayerProps } from "../types/media-player";
import { arabicPlayerLabels } from "../lib/player-labels";
import DeferredVideoPlayer from "./deferred-video-player";
import PlayerIcon from "./player-icon";
import { getYouTubeEmbedUrl } from "../lib/video";

/** Portable file/YouTube player: configuration changes appearance, not playback logic. */
export default function MediaPlayer({
  videoUrl,
  thumbnailUrl,
  title,
  width,
  height,
  aspectRatio = "16 / 9",
  color,
  controlsVariant = "overlay",
  returnToPosterOnEnd = true,
  fullscreenOnPlay = false,
  resetOnScrollOut = true,
  labels = arabicPlayerLabels,
  playLabel,
  className = "",
  placeholderClassName = "",
  playButtonClassName = "",
  thumbnailLoading = "lazy",
  children,
}: MediaPlayerProps) {
  const { ref, generation, fullscreen, supported, enterFullscreen, exitFullscreen } = useMediaPlayerSession(resetOnScrollOut);
  const style = mediaPlayerStyle({ width, height, aspectRatio, color });
  return (
    <div ref={ref} className={`media-player ${className}`.trim()} style={style}
      tabIndex={-1}
      onKeyDown={(event) => {
        if (event.key === "Escape" && fullscreen) {
          event.preventDefault();
          void exitFullscreen();
        }
      }}
    >
      <DeferredVideoPlayer
        key={`${videoUrl}:${generation}`}
        {...(getYouTubeEmbedUrl(videoUrl) ? { url: videoUrl } : { source: { kind: "file" as const, url: videoUrl, poster: thumbnailUrl } })}
        title={title ?? labels.controls}
        labels={labels}
        playLabel={playLabel ?? labels.play}
        controlsVariant={controlsVariant}
        returnToPosterOnEnd={returnToPosterOnEnd}
        onActivate={fullscreenOnPlay ? () => void enterFullscreen() : undefined}
        onDeactivate={exitFullscreen}
        placeholderClassName={`media-player-poster ${placeholderClassName}`.trim()}
      >
        {/* Arbitrary thumbnail URLs stay portable and bypass Next image-host configuration. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {thumbnailUrl && <img
          src={thumbnailUrl}
          alt=""
          loading={thumbnailLoading}
          decoding="async"
          fetchPriority={thumbnailLoading === "eager" ? "high" : undefined}
        />}
        <span
          className={`media-player-toggle ${playButtonClassName}`.trim()}
          aria-hidden="true"
        >
          <PlayerIcon name="play" />
        </span>
        {children}
      </DeferredVideoPlayer>
      {supported ? (
        <button
          type="button"
          className={`media-player-fullscreen custom-video-control${fullscreen ? " is-fullscreen" : ""}`}
          aria-label={fullscreen ? labels.exitFullscreen : labels.enterFullscreen}
          title={fullscreen ? labels.exitFullscreen : labels.enterFullscreen}
          onClick={() => void (fullscreen ? exitFullscreen() : enterFullscreen())}
        >
          <PlayerIcon name={fullscreen ? "exit-fullscreen" : "fullscreen"} />
        </button>
      ) : null}
    </div>
  );
}
