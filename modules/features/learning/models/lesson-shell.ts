import { routes } from "@platform/config/navigation";
import type { LessonContext } from "../read-lesson-context";
import { lessonOutline } from "../helpers/lesson-outline";
import { interfaceCopy } from "@platform/data/interface-copy";
import { copy, site } from "@platform/data/site";
export function lessonShellModel({ course, state, lessonId }: LessonContext) {
  return {
    header: { interfaceCopy: { dashboardLabel: interfaceCopy.dashboardLabel },
      site: { demoLabel: site.demoLabel, name: site.name, englishName: site.englishName } },
    outline: { copy: { courseContent: copy.courseContent, completed: copy.completed,
      pending: copy.pending, progress: copy.progress, lessons: copy.lessons },
      model: lessonOutline({ course, state, lessonHref: routes.lesson }), active: lessonId },
  };
}
