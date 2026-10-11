import type { NavigationAccount } from "@platform/types/navigation-account";
import { interfaceCopy } from "@platform/data/interface-copy";
import { copy, site, marketingNavigation } from "@platform/data/site";
import type { LandingModel } from "@platform/components/marketing/landing-page";
export function createHeaderModel(account: NavigationAccount | null = null): LandingModel["header"] {
  return {
    account,
    interfaceCopy: {
      mainNavigationLabel: interfaceCopy.mainNavigationLabel,
    },
    marketingNavigation: marketingNavigation,
    copy: { start: copy.start, close: copy.close, menu: copy.menu },
    site: { name: site.name, englishName: site.englishName },
  };
}
