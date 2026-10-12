import type { VideoContent } from "@khatab/design/types/ui";
import type { Course } from "@platform/types/lms";
import { getYouTubeEmbedUrl } from "@khatab/design/lib/video";
import { playableUrl } from "@platform/helpers/media/playable-url";
import { thumbnailUrl } from "@platform/helpers/media/thumbnail-url";
export function courseIntroVideo(video: VideoContent, course: Course, defaults: Course): VideoContent {
  const source = course.introVideoUrl || defaults.introVideoUrl!;
  return {
    controls: video.controls,
    controlsVariant: video.controlsVariant,
    returnToPosterOnEnd: video.returnToPosterOnEnd,
    title: video.title,
    playLabel: video.playLabel,
    caption: video.caption,
    hint: video.hint,
    poster: { ...video.poster!, src: thumbnailUrl(course.thumbnailUrl || defaults.thumbnailUrl!) },
    ...(getYouTubeEmbedUrl(source)
      ? { url: source }
      : { source: { kind: "file" as const, url: playableUrl(source, course.slug) } }),
  };
}
