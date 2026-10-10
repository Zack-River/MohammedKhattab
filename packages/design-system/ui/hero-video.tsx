"use client";
import MediaPlayer from "./media-player";
import Icon from "./ui-icon";
import DeferredVideoPlayer from "./deferred-video-player";
import type { VideoContent } from "../types/ui";
export default function HeroVideo({ content }: { content: VideoContent }) {
  if (content.source && content.poster)
    return (
      <div className="hero-video-shell">
        <MediaPlayer
          videoUrl={content.source.url}
          thumbnailUrl={content.poster.src}
          title={content.title}
          labels={content.controls}
          playLabel={content.playLabel}
          width="100%"
          height="100%"
          thumbnailLoading="eager"
          controlsVariant={content.controlsVariant}
          returnToPosterOnEnd={content.returnToPosterOnEnd}
          placeholderClassName="hero-video-placeholder"
          playButtonClassName="video-play-button"
        >
          <span className="video-meta-label" hidden>
            {content.caption}
          </span>
          <span className="video-meta-time" hidden>
            {content.hint}
          </span>
        </MediaPlayer>
      </div>
    );
  return (
    <div className="hero-video-shell">
      <DeferredVideoPlayer
        {...(content.source
          ? { source: content.source }
          : { url: content.url })}
        controlsVariant={content.controlsVariant}
        returnToPosterOnEnd={content.returnToPosterOnEnd}
        title={content.title}
        labels={content.controls}
        playLabel={content.playLabel}
        placeholderClassName="hero-video-placeholder"
      >
        <span className="video-play-button" aria-hidden="true">
          <Icon name="play" />
        </span>
        <span className="video-meta-label" hidden={Boolean(content.poster)}>
          {content.caption}
        </span>
        <span className="video-meta-time" hidden={Boolean(content.poster)}>
          {content.hint}
        </span>
      </DeferredVideoPlayer>
    </div>
  );
}
