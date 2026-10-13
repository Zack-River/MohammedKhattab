import { routes } from "@platform/config/navigation";
import type { LessonContext } from "../read-lesson-context";
import { lessonOutline } from "../helpers/lesson-outline";
import { interfaceCopy } from "@platform/data/interface-copy";
import { copy, site } from "@platform/data/site";
import { courseDetailsCopy } from "@platform/data/course-details";
export function lessonShellModel({ course, state, lessonId }: LessonContext) {
  return {
    header: { interfaceCopy: { dashboardLabel: interfaceCopy.dashboardLabel },
      site: { demoLabel: site.demoLabel, name: site.name, englishName: site.englishName } },
    outline: { lockedLabel: courseDetailsCopy.locked, copy: { courseContent: copy.courseContent, completed: copy.completed,
      preview: copy.preview, pending: copy.pending, progress: copy.progress, lessons: copy.lessons },
      model: lessonOutline({ course, state, lessonHref: routes.lesson, ungroupedLabel: courseDetailsCopy.ungrouped, lockedHref: routes.course(course.slug, course.delivery) }), active: lessonId },
  };
}
