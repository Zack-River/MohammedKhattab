import { courseLessons } from "@platform/features/catalog/helpers";
import Action from "@khatab/design/ui/action";
import { routes } from "@platform/config/navigation";
import type { ContentBindings } from "@platform/types/content";

import Symbol from "@platform/components/ui/symbol";
import ProgressBar from "@platform/components/ui/progress-bar";
import CourseArtwork from "./course-artwork";
import CoursePrice from "./course-price";
import type { Course } from "@platform/types/lms";
export default function CourseCard({
  course,
  progress,
  copy,
  site,
  offerCopy,
}: {
  course: Course;
  progress?: {
    count: number;
    total: number;
    percent: number;
    next?: { id: string };
  };
} & {
  copy: Pick<ContentBindings["copy"], "lessons" | "continue" | "progress">;
  site: Pick<ContentBindings["site"], "englishName">;
  offerCopy: Pick<ContentBindings["offerCopy"], "price">;
}) {
  const detailHref = routes.course(course.slug, course.delivery);
  const actionHref = progress
    ? progress.next
      ? routes.lesson(course.slug, progress.next.id)
      : routes.course(course.slug, course.delivery)
    : routes.enrollment(course.slug, course.delivery);
  return (
    <article className="lms-course-card">
      <h3 className="lms-card-title">
        <Action kind="link" href={detailHref}>
          {course.title}
        </Action>
      </h3>
      <Action
        kind="link"
        href={detailHref}
        tabIndex={-1}
        aria-hidden="true"
        className="lms-card-cover"
      >
        <CourseArtwork
          site={{ englishName: site.englishName }}
          course={course}
          showLabels={false}
        />
      </Action>
      <div className="lms-course-card-body">
        <div className="lms-card-summary">
          <div className="lms-card-meta">
            <span>
              <Symbol name="book" />
              {course.delivery === "live" ? course.deliveryLabel : `${courseLessons(course).length} ${copy.lessons}`}
            </span>
            <span>
              <Symbol name="clock" />
              {course.duration}
            </span>
          </div>
          <CoursePrice
            offerCopy={{ price: offerCopy.price }}
            offer={course.offer}
            compact
          />
        </div>
        {progress && course.delivery !== "live" && (
          <ProgressBar
            copy={{ progress: copy.progress, lessons: copy.lessons }}
            {...progress}
          />
        )}
        <Action
          kind="link"
          className="btn-primary lms-full-button lms-card-action"
          href={actionHref}
        >
          {progress ? copy.continue : course.offer.actionLabel}
          <Symbol name="arrow" />
        </Action>
      </div>
    </article>
  );
}
