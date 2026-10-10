import type { Course } from "@platform/types/lms";
export const courseLessons = (course: Pick<Course, "modules">) =>
  course.modules.flatMap((module) => module.lessons);
