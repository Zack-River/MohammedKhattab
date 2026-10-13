import { courseProgress } from "./course-progress";
import type { Course, LearningState } from "@platform/types/lms";
import { lessonKey } from "../../catalog/helpers";
import { courseContentGroups } from "../../catalog/helpers/course-content-groups";
export interface LessonOutlineOptions {
  course: Course;
  state: LearningState;
  lessonHref: (slug: string, lessonId: string) => string;
  ungroupedLabel?: string;
  lockedHref?: string;
}
export function lessonOutline({ course, state, lessonHref, ungroupedLabel = "", lockedHref }: LessonOutlineOptions) {
  const enrolled = state.enrolled.includes(course.slug), completed = new Set(state.completed);
  return {
    title: course.title,
    progress: courseProgress(course, state),
    modules: course.modules.map((module, index) => ({
      id: module.id ?? `chapter-${index + 1}`,
      title: module.title,
      groups: courseContentGroups(module, ungroupedLabel).map(group => ({
        id: group.sectionId ? `section-${group.sectionId}` : "unassigned", title: group.title,
        lessons: group.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          duration: lesson.duration,
          locked: !enrolled && !lesson.preview,
          preview: Boolean(lesson.preview),
          href: lockedHref && !enrolled && !lesson.preview ? lockedHref : lessonHref(course.slug, lesson.id),
          complete: completed.has(lessonKey(course.slug, lesson.id)),
        })),
      })),
    })),
  };
}
export type LessonOutlineModel = ReturnType<typeof lessonOutline>;
