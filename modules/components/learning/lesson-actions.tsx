import type { ContentBindings } from "@platform/types/content";
import { routes } from "@platform/config/navigation";
import Link from "next/link";
import CompletionButton from "@platform/components/learning/completion-button";
import Symbol from "@platform/components/ui/symbol";
export default function LessonActions({
  copy,
  courseHref,
  slug,
  enrolled,
  next,
  previous,
  complete,
  lessonId,
}: {
  copy: Pick<
    ContentBindings["copy"],
    "previous" | "viewCourse" | "next" | "error" | "saving" | "completed" | "complete"
  >;
  courseHref: string;
  slug: string;
  enrolled: boolean;
  previous: import("@platform/types/lms").Lesson | undefined;
  next: import("@platform/types/lms").Lesson | undefined;
  complete: boolean;
  lessonId: string;
}) {
  return (
    <div className="lms-lesson-actions">
      {previous && <Link href={enrolled || previous.preview ? routes.lesson(slug, previous.id) : courseHref} className="lms-text-link">{copy.previous}</Link>}
      {enrolled ? <CompletionButton
        copy={{
          error: copy.error,
          saving: copy.saving,
          completed: copy.completed,
          complete: copy.complete,
        }}
        slug={slug}
        lessonId={lessonId}
        complete={complete}
        enrolled={enrolled}
      /> : <Link href={courseHref} className="btn-primary">{copy.viewCourse}</Link>}
      {next && (
        <Link
          href={enrolled || next.preview ? routes.lesson(slug, next.id) : courseHref}
          className="lms-text-link"
        >
          {copy.next}
          <Symbol name="arrow" />
        </Link>
      )}
    </div>
  );
}
