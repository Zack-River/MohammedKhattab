import { interfaceCopy } from "@platform/data/interface-copy";
import type { LandingModel } from "@platform/components/marketing/landing-page";
export function coachingBenefits(): LandingModel["coaching"]["benefits"] {
  return [
      {
        id: "review",
        title: interfaceCopy.reviewBenefitTitle,
        body: interfaceCopy.reviewBenefitBody,
        symbol: "grid",
      },
      {
        id: "plan",
        title: interfaceCopy.planBenefitTitle,
        body: interfaceCopy.planBenefitBody,
        symbol: "play",
      },
      {
        id: "freelance",
        title: interfaceCopy.freelanceBenefitTitle,
        body: interfaceCopy.freelanceBenefitBody,
        symbol: "award",
      },
    ];
}
