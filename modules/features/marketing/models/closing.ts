import { interfaceCopy } from "@platform/data/interface-copy";
import type { LandingModel } from "@platform/components/marketing/landing-page";
export function createClosingModel(): LandingModel["closing"] {
  return {
    interfaceCopy: {
      closingTitle: interfaceCopy.closingTitle,
      closingHighlight: interfaceCopy.closingHighlight,
      closingDescription: interfaceCopy.closingDescription,
      closingAction: interfaceCopy.closingAction,
    },
  };
}
