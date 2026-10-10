"use client";
import { useRouter } from "next/navigation";
import { useAsyncCommand } from "./use-async-command";
import { setLessonCompletion } from "@platform/features/learning/client/complete-lesson";
import { learningRequests } from "@platform/features/learning/client/requests";
export function useLessonCompletion({ slug, lessonId, complete, enrolled, errorLabel }: {
  slug: string; lessonId: string; complete: boolean; enrolled: boolean; errorLabel: string;
}) {
  const { refresh } = useRouter();
  const command = useAsyncCommand(errorLabel);
  const { enroll, progress } = learningRequests(errorLabel);
  const toggle = () => command.run(() => setLessonCompletion({ slug, lessonId, completed: !complete, enrolled, enroll, progress, refresh }));
  return { toggle, pending: command.pending, error: command.error };
}
