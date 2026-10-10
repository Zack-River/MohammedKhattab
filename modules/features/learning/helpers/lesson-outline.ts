import { courseProgress } from "./course-progress";
import type { Course, LearningState } from "@platform/types/lms";
import { lessonKey } from "../../catalog/helpers";
export interface LessonOutlineOptions {
  course: Course;
  state: LearningState;
  lessonHref: (slug: string, lessonId: string) => string;
}
export function lessonOutline({ course, state, lessonHref }: LessonOutlineOptions) {
  return {
    title: course.title,
    progress: courseProgress(course, state),
    modules: course.modules.map((module) => ({
      title: module.title,
      lessons: module.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        duration: lesson.duration,
        href: lessonHref(course.slug, lesson.id),
        complete: state.completed.includes(lessonKey(course.slug, lesson.id)),
      })),
    })),
  };
}
export type LessonOutlineModel = ReturnType<typeof lessonOutline>;
