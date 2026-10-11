import type { NavigationAccount } from "@platform/types/navigation-account";
import type { Course } from "@platform/types/lms";
import { createHeaderModel } from "./models/header";
import { createHeroModel } from "./models/hero";
import { createCoursesModel } from "./models/courses";
import { createCoachingModel } from "./models/coaching";
import { createClosingModel } from "./models/closing";
import { createFooterModel } from "./models/footer";
import { workSamplesContent, testimonialsContent } from "../../../config/marketing-proof";
import { interfaceCopy } from "@platform/data/interface-copy";
import { instructor, howItWorks, faq, skillStripItems } from "@platform/data/site";
import LandingPage, { type LandingModel } from "@platform/components/marketing/landing-page";
export function createLandingModel(courses: Course[], account: NavigationAccount | null = null): LandingModel {
  return {
    header: createHeaderModel(account),
    workSamples: { content: workSamplesContent, reveal: true },
    testimonials: { content: testimonialsContent, reveal: true },
    hero: createHeroModel(courses),
    skills: {
      interfaceCopy: { skillStripLabel: interfaceCopy.skillStripLabel },
      skillStripItems: skillStripItems,
    },
    courses: createCoursesModel(courses),
    steps: { content: howItWorks },
    instructor: { content: instructor },
    coaching: createCoachingModel(),
    faq: { content: faq },
    closing: createClosingModel(),
    footer: createFooterModel(),
  };
}
export default function Landing({
  model,
}: {
  model: LandingModel;
}) {
  return <LandingPage model={model} />;
}
