import { copy, site } from "@platform/data/site";
import { interfaceCopy } from "@platform/data/interface-copy";
import { offerCopy } from "@platform/data/offers";
import { selectCourses } from "@platform/features/catalog/helpers";
import { catalogSettings } from "@platform/data/catalog-settings";
import type { Course } from "@platform/types/lms";
import type { LandingModel } from "@platform/components/marketing/landing-page";
export function createCoursesModel(courses: Course[]): LandingModel["courses"] {
  return {
    courses: selectCourses(
      courses,
      catalogSettings.showcaseIds,
      catalogSettings.showcaseLimit,
    ),
    copy: {
      lessons: copy.lessons,
      continue: copy.continue,
      progress: copy.progress,
    },
    site: { englishName: site.englishName },
    offerCopy: { price: offerCopy.price },
    interfaceCopy: {
      showcaseTitle: interfaceCopy.showcaseTitle,
      showcaseHighlight: interfaceCopy.showcaseHighlight,
      showcaseDescription: interfaceCopy.showcaseDescription,
      showcaseAction: interfaceCopy.showcaseAction,
    },
  };
}
