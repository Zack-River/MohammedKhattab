import { sectionIds } from "@platform/config/navigation";
import type { LandingModel } from "@platform/components/marketing/landing-page";
import { coachingContent } from "./coaching-content";
import { coachingBenefits } from "./coaching-benefits";
export function createCoachingModel(): LandingModel["coaching"] {
  return { section: { id: sectionIds.coaching, className: "lms-benefits" }, content: coachingContent(), benefits: coachingBenefits() };
}
