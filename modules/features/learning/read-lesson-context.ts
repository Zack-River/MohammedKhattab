import { listLessonResources } from "@platform/features/resources/lesson-resources";
import { playableUrl } from "@platform/helpers/media/playable-url";
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
  if (!enrolled && !lesson.preview) redirect(routes.course(slug, course.delivery));
  const lessons = courseLessons(course);
  const index = lessons.findIndex((item) => item.id === lessonId);
  const [videoUrl, resources] = await Promise.all([readPlayback(slug, lessonId), enrolled ? listLessonResources(slug, lessonId) : Promise.resolve([])]);
  return { resources, previous: index > 0 ? lessons[index - 1] : undefined, slug, lessonId, course, lesson: { ...lesson, videoUrl: playableUrl(videoUrl, slug, lessonId) }, state, enrolled, lessons, index,
    next: lessons.at(index + 1), complete: state.completed.includes(lessonKey(slug, lessonId)) };
}
export type LessonContext = Awaited<ReturnType<typeof readLessonContext>>;
