"use client";
import { HttpError } from "@platform/lib/http-error";
import { useRouter } from "next/navigation";
import { routes } from "@platform/config/navigation";
import { useAsyncCommand } from "./use-async-command";
import { startCourse } from "@platform/features/learning/client/start-course";
import { learningRequests } from "@platform/features/learning/client/requests";
export function useCourseEnrollment({ slug, firstLesson, enrolled, errorLabel }: {
  slug: string; firstLesson?: string; enrolled: boolean; errorLabel: string;
}) {
  const navigation = useRouter();
  const command = useAsyncCommand(errorLabel);
  const { enroll } = learningRequests(errorLabel);
  const start = () => command.run(async () => {
    try { await startCourse({ slug, firstLesson, enrolled, enroll, lessonHref: routes.lesson, navigation }); }
    catch (error) {
      if (error instanceof HttpError && error.status === 401) navigation.push(routes.login);
      else throw error;
    }
  });
  return { start, pending: command.pending, error: command.error };
}
