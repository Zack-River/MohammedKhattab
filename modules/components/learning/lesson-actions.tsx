import type { ContentBindings } from "@platform/types/content";
import { routes } from "@platform/config/navigation";
import Link from "next/link";
import CompletionButton from "@platform/components/learning/completion-button";
import Symbol from "@platform/components/ui/symbol";
export default function LessonActions({
  copy,
  slug,
  enrolled,
  next,
  complete,
  lessonId,
}: {
  copy: Pick<
    ContentBindings["copy"],
    "next" | "error" | "saving" | "completed" | "complete"
  >;
  slug: string;
  enrolled: boolean;
  next: import("@platform/types/lms").Lesson | undefined;
  complete: boolean;
  lessonId: string;
}) {
  return (
    <div className="lms-lesson-actions">
      <CompletionButton
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
      />
      {next && (
        <Link
          href={enrolled ? routes.lesson(slug, next.id) : routes.course(slug)}
          className="lms-text-link"
        >
          {copy.next}
          <Symbol name="arrow" />
        </Link>
      )}
    </div>
  );
}
