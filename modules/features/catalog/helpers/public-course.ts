import type { Course } from "@platform/types/lms";
import { validateCourse } from "./validate-course";
import { validateLessons } from "./validate-lessons";
export function publicCourse(metadata: unknown, slug: string, amount: number): Course {
  const course = metadata as Course;
  const result = { ...course, slug, offer: { ...course.offer, amount } };
  validateCourse(result, new Set());
  validateLessons(result, result.modules.flatMap(section => section.lessons.flatMap(lesson => lesson.resourceIds)));
  return { ...result, modules: result.modules.map(section => ({ ...section,
    lessons: section.lessons.map(lesson => ({ ...lesson, videoUrl: "" })),
  })) };
}
