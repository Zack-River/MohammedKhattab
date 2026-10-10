import type { Course } from "@platform/types/lms";
import { courseLessons } from "./course-lessons";
export function validateLessons(course: Course, resourceIds: readonly string[]) {
  const ids = new Set<string>(), lessons = courseLessons(course);
  if (!lessons.length && course.delivery !== "live") throw new Error(`Empty published course: ${course.slug}`);
  for (const lesson of lessons) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(lesson.id) || !lesson.title.trim() ||
        ids.has(lesson.id) || !Number.isFinite(lesson.durationSeconds) || lesson.durationSeconds <= 0)
      throw new Error(`Invalid lesson: ${lesson.id}`);
    ids.add(lesson.id);
    if (lesson.resourceIds.some((id) => !resourceIds.includes(id)))
      throw new Error(`Unknown lesson resource: ${lesson.id}`);
  }
}
