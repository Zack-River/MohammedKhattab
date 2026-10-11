import type { Course } from "@platform/types/lms";
import type { CurriculumMutation } from "@platform/types/curriculum";
import { curriculumCourse } from "./curriculum-course";
import { mutateChapter } from "./mutate-chapter";
import { mutateSection } from "./mutate-section";
import { mutateLesson } from "./mutate-lesson";
import { curriculumPolicy as policy } from "@platform/config/curriculum";
import { ApiError } from "@platform/lib/api/error";
export function applyCurriculumMutation(current: Course, input: CurriculumMutation, id: string) {
  const course = curriculumCourse(structuredClone(current));
  const mutate = { chapter: mutateChapter, section: mutateSection, lesson: mutateLesson };
  mutate[input.kind](course,input,id);
  if (course.modules.length > policy.maxChapters || course.modules.some(chapter => (chapter.sections?.length ?? 0) > policy.maxSections) || course.modules.flatMap(chapter => chapter.lessons).length > policy.maxLessons) throw new ApiError(400,"INVALID_INPUT");
  return course;
}
