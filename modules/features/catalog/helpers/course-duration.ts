import type { Course } from "@platform/types/lms";
import { courseSeconds } from "./course-seconds";
import { formatCourseDuration } from "./format-course-duration";
/** Recorded duration is derived, never an independently editable source of truth. */
export function courseDuration(course: Pick<Course, "modules" | "delivery" | "duration">) {
  if (course.delivery === "live") return course.duration;
  const seconds = courseSeconds(course);
  return seconds ? formatCourseDuration(seconds) : "";
}
