import type { Course } from "@platform/types/lms";
import type { CurriculumCourse } from "@platform/types/curriculum";
export function curriculumCourse(course: Course): CurriculumCourse {
  return { ...course, modules: course.modules.map((chapter,index) => ({ ...chapter, id: chapter.id ?? `chapter-${index + 1}` })) };
}
