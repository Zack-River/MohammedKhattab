import { interfaceCopy } from "@platform/data/interface-copy";
import { backendCopy } from "@platform/data/backend-copy";
import { site, copy } from "@platform/data/site";
export const dashboardShellContent = {
  interfaceCopy: { studentNavigationLabel: interfaceCopy.studentNavigationLabel, sidebarTitle: interfaceCopy.sidebarTitle,
    sidebarDescription: interfaceCopy.sidebarDescription, homeLabel: interfaceCopy.homeLabel },
  site: { demoLabel: backendCopy.ACCOUNT_LABEL, name: site.name, englishName: site.englishName },
  copy: { logout: backendCopy.LOGOUT, error: backendCopy.INTERNAL_ERROR, browse: copy.browse,
    profileTitle: copy.profileTitle, menu: copy.menu, demoAccount: backendCopy.ACCOUNT_LABEL },
};
