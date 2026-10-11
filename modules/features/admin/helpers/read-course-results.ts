import { categories } from "@platform/config/catalog";
import type { AdminCourseResults } from "@platform/types/admin-courses";
export function readCourseResults(value: unknown): AdminCourseResults {
  const result = value as AdminCourseResults | null;
  if (!result || !Array.isArray(result.courses) || !Number.isSafeInteger(result.total) || result.total < 0 ||
      !Number.isSafeInteger(result.page) || result.page < 1 || typeof result.hasNext !== "boolean") throw new Error("Invalid course results");
  for (const course of result.courses) {
    const validDates = course && [course.createdAt, course.updatedAt].every(date =>
      date === null || (typeof date === "string" && Number.isFinite(Date.parse(date))));
    if (!course || !validDates || typeof course.slug !== "string" || typeof course.title !== "string" ||
        typeof course.published !== "boolean" || !["live", "recorded"].includes(course.delivery) ||
        !categories.some(category => category.id !== "all" && category.id === course.category) ||
        ![course.students, course.lessons, course.chapters, course.sections].every(count => Number.isSafeInteger(count) && count >= 0))
      throw new Error("Invalid course result");
  }
  return result;
}
