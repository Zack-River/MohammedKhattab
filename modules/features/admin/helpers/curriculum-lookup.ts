import type { CurriculumCourse } from "@platform/types/curriculum";
import { ApiError } from "@platform/lib/api/error";
export function curriculumChapter(course: CurriculumCourse, id?: string) {
  const chapter = course.modules.find(chapter => chapter.id === id);
  if (!chapter) throw new ApiError(404,"NOT_FOUND");
  return chapter;
}
export function curriculumLesson(course: CurriculumCourse, id?: string) {
  const chapter = course.modules.find(chapter => chapter.lessons.some(lesson => lesson.id === id));
  const lesson = chapter?.lessons.find(lesson => lesson.id === id);
  if (!chapter || !lesson) throw new ApiError(404,"NOT_FOUND");
  return { chapter, lesson };
}
export function curriculumSection(course: CurriculumCourse, id?: string, chapterId?: string) {
  const chapter = course.modules.find(chapter => (!chapterId || chapter.id === chapterId) && chapter.sections?.some(section => section.id === id));
  const section = chapter?.sections?.find(section => section.id === id);
  if (!chapter || !section) throw new ApiError(404,"NOT_FOUND");
  return { chapter, section };
}
