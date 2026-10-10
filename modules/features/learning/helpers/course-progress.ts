import { courseLessons, lessonKey } from "../../catalog/helpers";
import type { Course, LearningState } from "@platform/types/lms";
export function courseProgress(
  course: Course,
  state: Pick<LearningState, "completed">,
) {
  const lessons = courseLessons(course),
    completed = new Set(state.completed);
  const count = lessons.filter((lesson) =>
    completed.has(lessonKey(course.slug, lesson.id)),
  ).length;
  return {
    count,
    total: lessons.length,
    percent: lessons.length ? Math.round((count / lessons.length) * 100) : 0,
    next: lessons.find(
      (lesson) => !completed.has(lessonKey(course.slug, lesson.id)),
    ),
  };
}
export type CourseProgress = ReturnType<typeof courseProgress>;
