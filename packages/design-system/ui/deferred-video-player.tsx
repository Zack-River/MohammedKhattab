"use client";
import { lazy, Suspense, useCallback, useState, type ReactNode } from "react";
import { useExclusivePlayer } from "../hooks/use-exclusive-player";
import { getControlledYouTubeUrl } from "../helpers/media/youtube/controlled-url";
const NativeVideoPlayer = lazy(() => import("./native-video-player"));
import type {
  VideoSourceProps,
  PlayerControlsVariant,
  VideoPlayerLabels,
} from "../types/video-player";
const YouTubePlayer = lazy(() => import("./youtube-player"));
export default function DeferredVideoPlayer({
  url,
  source,
  controlsVariant,
  returnToPosterOnEnd = false,
  onActivate,
  onDeactivate,
  title,
  labels,
  playLabel,
  placeholderClassName,
  children,
}: {
  controlsVariant?: PlayerControlsVariant;
  returnToPosterOnEnd?: boolean;
  onActivate?: () => void;
  onDeactivate?: () => void;
  title: string;
  labels: VideoPlayerLabels;
  playLabel: string;
  placeholderClassName: string;
  children: ReactNode;
} & VideoSourceProps) {
  const [activation, setActivation] = useState<{
    url: string;
    embed: string;
  } | null>(null);
  const reset = useCallback(() => {
    setActivation(null);
    onDeactivate?.();
  }, [onDeactivate]);
  const claimPlayback = useExclusivePlayer(reset);
  const resolvedUrl = source?.url ?? url ?? "";
  if (activation?.url === resolvedUrl && source)
    return (
      <Suspense fallback={<div className={placeholderClassName} aria-label={labels.loading}>{children}</div>}><NativeVideoPlayer
        key={resolvedUrl}
        source={source}
        onEnded={returnToPosterOnEnd ? reset : undefined}
        onPlay={claimPlayback}
        controlsVariant={controlsVariant}
        title={title}
        labels={labels}
      /></Suspense>
    );
  if (activation?.url === resolvedUrl)
    return (
      <Suspense fallback={<div className={placeholderClassName} aria-label={labels.loading}>{children}</div>}><YouTubePlayer
        key={activation.embed}
        url={activation.embed}
        controlsVariant={controlsVariant}
        onEnded={returnToPosterOnEnd ? reset : undefined}
        onPlay={claimPlayback}
        title={title}
        labels={labels}
      /></Suspense>
    );
  return (
    <button
      type="button"
      className={placeholderClassName}
      onClick={() => {
        const embed = source
          ? resolvedUrl
          : getControlledYouTubeUrl(resolvedUrl, window.location.origin);
        if (embed) {
          onActivate?.();
          claimPlayback();
          setActivation({ url: resolvedUrl, embed });
        }
      }}
      aria-label={playLabel}
    >
      {children}
    </button>
  );
}
