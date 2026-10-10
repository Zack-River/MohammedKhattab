import { currentIdentity } from "@platform/features/auth/server/identity";
import { readPlayback } from "../catalog/repositories/read-playback";
import { notFound, redirect } from "next/navigation";
import { routes } from "@platform/config/navigation";
import { findCourse } from "../catalog/service";
import { findLesson, courseLessons, lessonKey } from "../catalog/helpers";
import { readLearningState } from "./service";
export async function readLessonContext(slug: string, lessonId: string) {
  const course = await findCourse(slug);
  if (!course) notFound();
  const lesson = findLesson(course, lessonId);
  if (!lesson) notFound();
  if (!lesson.preview && !await currentIdentity()) redirect(routes.login);
  const state = await readLearningState();
  const enrolled = state.enrolled.includes(slug);
  if (!enrolled && !lesson.preview) redirect(routes.course(slug));
  const lessons = courseLessons(course);
  const index = lessons.findIndex((item) => item.id === lessonId);
  return { slug, lessonId, course, lesson: { ...lesson, videoUrl: await readPlayback(slug, lessonId) }, state, enrolled, lessons, index,
    next: lessons[index + 1], complete: state.completed.includes(lessonKey(slug, lessonId)) };
}
export type LessonContext = Awaited<ReturnType<typeof readLessonContext>>;
