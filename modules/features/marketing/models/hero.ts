import { introVideo } from "../../../../config/marketing-intro";
import { copy, site } from "@platform/data/site";
import { interfaceCopy } from "@platform/data/interface-copy";
import { selectPreview } from "@platform/features/catalog/helpers";
import { catalogSettings } from "@platform/data/catalog-settings";
import type { Course } from "@platform/types/lms";
import type { LandingModel } from "@platform/components/marketing/landing-page";
export function createHeroModel(courses: Course[]): LandingModel["hero"] {
  const preview = selectPreview(courses, catalogSettings.previewCourseId, catalogSettings.previewLessonIds);
  return {
    video: introVideo,
    artworkLessonLabel: copy.artworkLessonLabel,
    interfaceCopy: {
      heroLead: interfaceCopy.heroLead,
      heroSkillLead: interfaceCopy.heroSkillLead,
      heroHighlight: interfaceCopy.heroHighlight,
      heroDescription: interfaceCopy.heroDescription,
      heroSupport: interfaceCopy.heroSupport,
      heroBrowseAction: interfaceCopy.heroBrowseAction,
      heroDashboardAction: interfaceCopy.heroDashboardAction,
      heroBeginnerNote: interfaceCopy.heroBeginnerNote,
      heroScheduleNote: interfaceCopy.heroScheduleNote,
      heroPracticeNote: interfaceCopy.heroPracticeNote,
      heroPreviewTitle: interfaceCopy.heroPreviewTitle,
      heroPreviewLabel: interfaceCopy.heroPreviewLabel,
      heroPreviewAction: interfaceCopy.heroPreviewAction,
    },
    preview: preview,
    site: { englishName: site.englishName },
  };
}
