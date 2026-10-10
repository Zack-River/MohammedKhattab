import { interfaceCopy } from "@platform/data/interface-copy";
import { copy, site, marketingNavigation } from "@platform/data/site";
import type { LandingModel } from "@platform/components/marketing/landing-page";
export function createHeaderModel(): LandingModel["header"] {
  return {
    interfaceCopy: {
      mainNavigationLabel: interfaceCopy.mainNavigationLabel,
      dashboardLabel: interfaceCopy.dashboardLabel,
    },
    marketingNavigation: marketingNavigation,
    copy: { start: copy.start, close: copy.close, menu: copy.menu },
    site: { name: site.name, englishName: site.englishName },
  };
}
