import { routes } from "@platform/config/navigation";
import type { LessonContext } from "../read-lesson-context";
import { interfaceCopy } from "@platform/data/interface-copy";
import { copy, site } from "@platform/data/site";
export function lessonPlaybackModel(context: LessonContext) {
  const { course, lesson, index, lessons, slug, enrolled, next, previous, complete, lessonId } = context;
  return {
    title: { interfaceCopy: { lessonCounterLabel: interfaceCopy.lessonCounterLabel,
      lessonCounterSeparator: interfaceCopy.lessonCounterSeparator }, lesson, index, lessons },
    player: { interfaceCopy: { playLesson: interfaceCopy.playLesson },
      copy: { demoVideo: copy.demoVideo, artworkLessonLabel: copy.artworkLessonLabel },
      site: { englishName: site.englishName }, course, lesson },
    actions: { copy: { previous: copy.previous, viewCourse: copy.viewCourse, next: copy.next, error: copy.error, saving: copy.saving,
      completed: copy.completed, complete: copy.complete }, courseHref: routes.course(slug, course.delivery), slug, enrolled, next, previous, complete, lessonId },
  };
}
