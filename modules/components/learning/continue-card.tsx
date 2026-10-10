import { routes } from "@platform/config/navigation";
import type { ContentBindings } from "@platform/types/content";

import Link from "next/link";
import CourseArtwork from "@platform/components/courses/course-artwork";
import ProgressBar from "@platform/components/ui/progress-bar";
import Symbol from "@platform/components/ui/symbol";
import type { Course } from "@platform/types/lms";
import type { CourseProgress } from "@platform/features/learning/helpers";
export default function ContinueCard({
  course,
  progress,
  interfaceCopy,
  copy,
  site,
}: {
  course: Pick<Course,"slug"|"title"|"modules"|"artwork"|"tool"|"categoryLabel">;
  progress: CourseProgress;
} & {
  interfaceCopy: Pick<ContentBindings["interfaceCopy"], "continueContext">;
  copy: Pick<
    ContentBindings["copy"],
    "continue" | "progress" | "lessons" | "artworkLessonLabel"
  >;
  site: Pick<ContentBindings["site"], "englishName">;
}) {
  return (
    <section className="lms-continue-card">
      <CourseArtwork
        lessonLabel={copy.artworkLessonLabel}
        site={{ englishName: site.englishName }}
        course={course}
      />
      <div>
        <span className="lms-small-label">{interfaceCopy.continueContext}</span>
        <h2>{course.title}</h2>
        <p>{progress.next?.title ?? course.title}</p>
        <ProgressBar
          copy={{ progress: copy.progress, lessons: copy.lessons }}
          {...progress}
        />
        <Link
          href={
            progress.next
              ? routes.lesson(course.slug, progress.next.id)
              : routes.course(course.slug)
          }
          className="btn-primary"
        >
          {copy.continue}
          <Symbol name="arrow" />
        </Link>
      </div>
    </section>
  );
}
