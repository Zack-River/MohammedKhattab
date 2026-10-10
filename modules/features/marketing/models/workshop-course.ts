import type { MarketingPageContent } from "@khatab/design/types/marketing";
import type { VideoContent } from "@khatab/design/types/ui";
import type { Course } from "@platform/types/lms";
import { getYouTubeEmbedUrl } from "@khatab/design/lib/video";
import { playableUrl } from "@platform/helpers/media/playable-url";
import { thumbnailUrl } from "@platform/helpers/media/thumbnail-url";
export function workshopCourseContent(content: MarketingPageContent, course: Course, defaults: Course): MarketingPageContent {
  const source = course.introVideoUrl || defaults.introVideoUrl!;
  const video: VideoContent = { controls: content.hero.video.controls, controlsVariant: content.hero.video.controlsVariant,
    returnToPosterOnEnd: content.hero.video.returnToPosterOnEnd, title: content.hero.video.title,
    playLabel: content.hero.video.playLabel, caption: content.hero.video.caption, hint: content.hero.video.hint,
    poster: { ...content.hero.video.poster!, src: thumbnailUrl(course.thumbnailUrl || defaults.thumbnailUrl!) },
    ...(getYouTubeEmbedUrl(source) ? { url: source } : { source: { kind: "file" as const, url: playableUrl(source,course.slug) } }),
  };
  return { ...content, hero: { ...content.hero, video,
    title: course.title === defaults.title ? content.hero.title : [course.title],
    description: course.description === defaults.description ? content.hero.description : course.description,
  } };
}
