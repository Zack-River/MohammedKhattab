import type { Course } from "@platform/types/lms";
import { courseLessons } from "./course-lessons";
export const courseSeconds = (course: Pick<Course, "modules">) =>
  courseLessons(course).reduce(
    (sum, lesson) => sum + lesson.durationSeconds,
    0,
  );
