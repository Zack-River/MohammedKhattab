"use client";
import MediaPlayer from "@khatab/design/ui/media-player";
import CourseArtwork from "./course-artwork";
import { playableUrl } from "@platform/helpers/media/playable-url";
import { thumbnailUrl } from "@platform/helpers/media/thumbnail-url";
import type { Course } from "@platform/types/lms";
export default function CourseIntro({ course, site, playLabel }: {
  course: Pick<Course,"slug" | "title" | "introVideoUrl" | "thumbnailUrl" | "artwork">; site: { englishName: string }; playLabel: string;
}) {
  const poster = course.thumbnailUrl ? thumbnailUrl(course.thumbnailUrl) : "";
  const artwork = { ...course, modules: [], tool: "", categoryLabel: "" };
  return <div className="lms-course-intro" data-reveal>
    {course.introVideoUrl ? <MediaPlayer videoUrl={playableUrl(course.introVideoUrl,course.slug)} thumbnailUrl={poster}
      title={course.title} playLabel={playLabel} controlsVariant="overlay" returnToPosterOnEnd>
      {!poster && <CourseArtwork course={artwork} site={site} showLabels={false} large />}
    </MediaPlayer> : <CourseArtwork course={artwork} site={site} showLabels={false} large />}
  </div>;
}
