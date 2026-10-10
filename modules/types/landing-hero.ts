import type { VideoContent } from "@khatab/design/types/ui";
import type { ContentBindings } from "./content";
export type LandingHeroProps = {
  actions?: { browse: string; dashboard: string; preview?: string };
  interfaceCopy: Pick<
    ContentBindings["interfaceCopy"],
    | "heroLead"
    | "heroSkillLead"
    | "heroHighlight"
    | "heroDescription"
    | "heroSupport"
    | "heroBrowseAction"
    | "heroDashboardAction"
    | "heroBeginnerNote"
    | "heroScheduleNote"
    | "heroPracticeNote"
    | "heroPreviewTitle"
    | "heroPreviewLabel"
    | "heroPreviewAction"
  >;
  artworkLessonLabel: string;
  video?: VideoContent;
  preview?: {
    course: import("@platform/types/lms").Course;
    lessons: import("@platform/types/lms").Lesson[];
  };
  site: Pick<ContentBindings["site"], "englishName">;
};
