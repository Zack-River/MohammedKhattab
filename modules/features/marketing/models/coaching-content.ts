import { interfaceCopy } from "@platform/data/interface-copy";
import type { LandingModel } from "@platform/components/marketing/landing-page";
export function coachingContent(): LandingModel["coaching"]["content"] {
  return {
      eyebrow: interfaceCopy.coachingContext,
      title: [
        interfaceCopy.coachingTitleLead,
        { kind: "break" },
        interfaceCopy.coachingTitleSupport,
        {
          kind: "span",
          className: "highlight-red",
          children: [interfaceCopy.coachingHighlight],
        },
      ],
      description: [interfaceCopy.coachingDescription],
    };
}
