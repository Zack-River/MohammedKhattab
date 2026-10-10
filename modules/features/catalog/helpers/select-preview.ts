import type { Course } from "@platform/types/lms";
import { courseLessons } from "./course-lessons";
export function selectPreview(
  catalog: readonly Course[],
  courseId: string,
  lessonIds: readonly string[],
) {
  const course = catalog.find((item) => item.slug === courseId);
  if (!course) return undefined;
  const lessons = courseLessons(course);
  return {
    course,
    lessons: lessonIds.flatMap((id) => {
      const lesson = lessons.find((item) => item.id === id);
      return lesson ? [lesson] : [];
    }),
  };
}
