"use client";
import Action from "@khatab/design/ui/action";

import type { ContentBindings } from "@platform/types/content";

import { useLessonCompletion } from "@platform/hooks/use-lesson-completion";
import Symbol from "@platform/components/ui/symbol";
export default function CompletionButton({
  slug,
  lessonId,
  complete,
  enrolled,
  copy,
}: {
  slug: string;
  lessonId: string;
  complete: boolean;
  enrolled: boolean;
} & {
  copy: Pick<
    ContentBindings["copy"],
    "error" | "saving" | "completed" | "complete"
  >;
}) {
  const { toggle, pending, error } = useLessonCompletion({ slug, lessonId, complete, enrolled, errorLabel: copy.error });
  return (
    <div>
      <Action
        kind="button"
        className={
          complete ? "lms-secondary-button lms-is-complete" : "btn-primary"
        }
        type="button"
        onClick={toggle}
        disabled={pending}
      >
        <Symbol name="check" />
        {pending ? copy.saving : complete ? copy.completed : copy.complete}
      </Action>
      {error && (
        <p className="lms-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
