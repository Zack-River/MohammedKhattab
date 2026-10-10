import type { Course } from "@platform/types/lms";
import { validateCourse } from "./validate-course";
import { validateLessons } from "./validate-lessons";
export function validateCatalog(catalog: readonly Course[], resourceIds: readonly string[]) {
  const slugs = new Set<string>();
  for (const course of catalog) {
    validateCourse(course, slugs);
    slugs.add(course.slug);
    validateLessons(course, resourceIds);
  }
}
