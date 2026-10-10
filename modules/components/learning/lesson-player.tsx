"use client";
import type { ContentBindings } from "@platform/types/content";

import { getYouTubeEmbedUrl } from "@khatab/design/lib/video";
import DeferredVideoPlayer from "@khatab/design/ui/deferred-video-player";
import { useMediaPlayerSession } from "@khatab/design/hooks/use-media-player-session";
import { arabicPlayerLabels } from "@khatab/design/lib/player-labels";
import Symbol from "@platform/components/ui/symbol";
import type { Course, Lesson } from "@platform/types/lms";
import CourseArtwork from "@platform/components/courses/course-artwork";
export default function LessonPlayer({
  course,
  lesson,
  interfaceCopy,
  copy,
  site,
}: {
  course: Course;
  lesson: Lesson;
} & {
  interfaceCopy: Pick<ContentBindings["interfaceCopy"], "playLesson">;
  copy: Pick<ContentBindings["copy"], "artworkLessonLabel" | "demoVideo">;
  site: Pick<ContentBindings["site"], "englishName">;
}) {
  const { ref, generation } = useMediaPlayerSession(true);
  return (
    <div className="lms-lesson-player" ref={ref}>
      <DeferredVideoPlayer
        key={`${lesson.videoUrl}:${generation}`}
        {...(getYouTubeEmbedUrl(lesson.videoUrl) ? { url: lesson.videoUrl } : { source: { kind: "file" as const, url: lesson.videoUrl } })}
        title={lesson.title}
        labels={arabicPlayerLabels}
        controlsVariant="full"
        returnToPosterOnEnd
        playLabel={`${interfaceCopy.playLesson} ${lesson.title}`}
        placeholderClassName="lms-player-button"
      >
          <CourseArtwork
            lessonLabel={copy.artworkLessonLabel}
            site={{ englishName: site.englishName }}
            course={course}
            large
          />
          <span className="lms-player-overlay">
            <span className="video-play-button">
              <Symbol name="play" />
            </span>
            <span>{lesson.title}</span>
            <small>{copy.demoVideo}</small>
          </span>
      </DeferredVideoPlayer>
    </div>
  );
}
