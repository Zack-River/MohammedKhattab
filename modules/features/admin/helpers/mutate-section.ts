import type { CurriculumCourse, CurriculumMutation } from "@platform/types/curriculum";
import { curriculumChapter, curriculumSection } from "./curriculum-lookup";
import { ApiError } from "@platform/lib/api/error";
export function mutateSection(course: CurriculumCourse, input: CurriculumMutation, id: string) {
  const destination = curriculumChapter(course,input.chapterId);
  destination.sections ??= [];
  if (input.operation === "create") { destination.sections.push({ id, title: input.title!, lessonIds: [] }); return; }
  const { chapter, section } = curriculumSection(course,input.id,input.sourceChapterId ?? input.chapterId);
  if (input.operation === "delete") {
    if (section.lessonIds.length) throw new ApiError(409,"CURRICULUM_NOT_EMPTY");
    chapter.sections = chapter.sections!.filter(record => record.id !== section.id); return;
  }
  section.title = input.title!;
  if (chapter.id === destination.id) return;
  if (destination.sections.some(record => record.id === section.id)) throw new ApiError(409,"SECTION_ID_CONFLICT");
  const assigned = new Set(section.lessonIds);
  destination.lessons.push(...chapter.lessons.filter(lesson => assigned.has(lesson.id)));
  chapter.lessons = chapter.lessons.filter(lesson => !assigned.has(lesson.id));
  chapter.sections = chapter.sections!.filter(record => record.id !== section.id);
  destination.sections.push(section);
}
