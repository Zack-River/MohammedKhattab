import type { Course } from "@platform/types/lms";
import { courseContentGroups } from "./course-content-groups";
export const courseLessons = (course: Pick<Course, "modules">) =>
  course.modules.flatMap((module) => courseContentGroups(module, "").flatMap(group => group.lessons));
