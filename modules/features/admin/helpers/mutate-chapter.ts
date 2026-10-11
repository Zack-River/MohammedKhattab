import type { CurriculumCourse, CurriculumMutation } from "@platform/types/curriculum";
import { curriculumChapter } from "./curriculum-lookup";
import { ApiError } from "@platform/lib/api/error";
export function mutateChapter(course: CurriculumCourse, input: CurriculumMutation, id: string) {
  if (input.operation === "create") { course.modules.push({ id, title: input.title!, lessons: [], sections: [] }); return; }
  const chapter = curriculumChapter(course,input.id);
  if (input.operation === "edit") { chapter.title = input.title!; return; }
  if (chapter.lessons.length || chapter.sections?.length) throw new ApiError(409,"CURRICULUM_NOT_EMPTY");
  course.modules = course.modules.filter(record => record.id !== chapter.id);
}
