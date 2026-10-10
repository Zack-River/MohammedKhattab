"use client";
import type { ContentBindings } from "@platform/types/content";

import { useId } from "react";
import { useLessonNotes } from "@platform/hooks/use-lesson-notes";
export default function LessonNotes({
  storageKey,
  copy,
}: { storageKey: string } & {
  copy: Pick<
    ContentBindings["copy"],
    "notes" | "notesHint" | "notesUnavailable" | "notesSaved"
  >;
}) {
  const id = useId();
  const { value, save, failed } = useLessonNotes(storageKey);
  return (
    <div className="lms-notes">
      <label htmlFor={id}>{copy.notes}</label>
      <textarea
        id={id}
        value={value}
        onChange={(event) => save(event.target.value)}
        placeholder={copy.notesHint}
        rows={5}
      />
      <small role="status" className={failed ? "lms-error" : "text-muted"}>
        {failed ? copy.notesUnavailable : copy.notesSaved}
      </small>
    </div>
  );
}
