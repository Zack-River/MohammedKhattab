"use client";
import Action from "@khatab/design/ui/action";

import type { ContentBindings } from "@platform/types/content";

import { useCourseEnrollment } from "@platform/hooks/use-course-enrollment";
import Symbol from "@platform/components/ui/symbol";
export default function EnrollButton({
  slug,
  firstLesson,
  enrolled,
  paid = false,
  copy,
}: {
  slug: string;
  firstLesson?: string;
  enrolled: boolean;
  paid?: boolean;
} & {
  copy: Pick<
    ContentBindings["copy"],
    "error" | "saving" | "continue" | "enrollLabel"
  >;
}) {
  const { start, pending, error } = useCourseEnrollment({ slug, firstLesson, enrolled, paid, errorLabel: copy.error });
  return (
    <div>
      <Action
        kind="button"
        type="button"
        className="btn-primary lms-full-button"
        disabled={pending || (!firstLesson && !paid)}
        onClick={start}
      >
        {pending ? copy.saving : enrolled ? copy.continue : copy.enrollLabel}
        <Symbol name="arrow" />
      </Action>
      {error && (
        <p className="lms-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
