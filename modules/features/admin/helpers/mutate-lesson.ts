import { formatPlayerTime } from "@khatab/design/helpers/media/format-time";
import type { CurriculumCourse, CurriculumMutation } from "@platform/types/curriculum";
import { curriculumChapter, curriculumLesson } from "./curriculum-lookup";
import { ApiError } from "@platform/lib/api/error";
export function mutateLesson(course: CurriculumCourse, input: CurriculumMutation, id: string) {
  const destination = curriculumChapter(course,input.chapterId);
  const section = input.sectionId ? destination.sections?.find(section => section.id === input.sectionId) : undefined;
  if (input.sectionId && !section) throw new ApiError(400,"INVALID_INPUT");
  const existing = input.operation === "create" ? undefined : curriculumLesson(course,input.id);
  const position = existing?.chapter.id === destination.id ? destination.lessons.findIndex(lesson => lesson.id === input.id) : -1;
  const lesson = existing?.lesson ?? { id, resourceIds: [], takeaway: [], videoUrl: "" };
  for (const chapter of course.modules) {
    chapter.lessons = chapter.lessons.filter(record => record.id !== lesson.id);
    chapter.sections?.forEach(section => { section.lessonIds = section.lessonIds.filter(id => id !== lesson.id); });
  }
  if (input.operation === "delete") return;
  const updated = {
    ...lesson,
    title: input.title!,
    description: input.description!,
    durationSeconds: input.durationSeconds!,
    duration: formatPlayerTime(input.durationSeconds!),
    preview: input.preview!,
    videoUrl: "",
  };
  if (position >= 0) destination.lessons.splice(position,0,updated); else destination.lessons.push(updated);
  section?.lessonIds.push(lesson.id);
}
