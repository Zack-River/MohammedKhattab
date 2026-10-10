import { designerCredit } from "../../../../config/designer";
import { projectNavigation } from "../../../../config/project-navigation";
import { copy, site, marketingNavigation } from "@platform/data/site";
import { interfaceCopy } from "@platform/data/interface-copy";
import type { LandingModel } from "@platform/components/marketing/landing-page";
export function createFooterModel(): LandingModel["footer"] {
  return {
    credit: designerCredit,
    projectNavigation,
    interfaceCopy: { contactLabel: interfaceCopy.contactLabel },
    copy: { footer: copy.footer, copyright: copy.copyright },
    site: {
      email: site.email,
      demoLabel: site.demoLabel,
      name: site.name,
      englishName: site.englishName,
    },
    marketingNavigation: marketingNavigation,
  };
}
