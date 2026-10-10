import type { Course } from "@platform/types/lms";
export function selectCourses(
  catalog: readonly Course[],
  ids: readonly string[],
  limit = ids.length,
) {
  return ids.slice(0, limit).flatMap((id) => {
    const course = catalog.find((item) => item.slug === id);
    return course ? [course] : [];
  });
}
