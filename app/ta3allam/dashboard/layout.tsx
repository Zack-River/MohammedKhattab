import { hasAdminAccess } from "@platform/features/admin/identity";
import { adminCopy } from "@platform/data/admin";
import { redirect } from "next/navigation";
import { routes } from "@platform/config/navigation";
import { currentIdentity } from "@platform/features/auth/server/identity";
import { backendCopy } from "@platform/data/backend-copy";
import { interfaceCopy } from "@platform/data/interface-copy";
import { dashboardNavigation } from "@platform/data/site";
import { site } from "@platform/data/site";
import { copy } from "@platform/data/site";
import DashboardShell from "@platform/components/layout/dashboard-shell";
import { readLearningState } from "@platform/features/learning";
export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!await currentIdentity()) redirect(routes.login);
  const state = await readLearningState();
  const admin = await hasAdminAccess();
  return (
    <DashboardShell
      interfaceCopy={{
        studentNavigationLabel: interfaceCopy.studentNavigationLabel,
        sidebarTitle: interfaceCopy.sidebarTitle,
        sidebarDescription: interfaceCopy.sidebarDescription,
        homeLabel: interfaceCopy.homeLabel,
      }}
      dashboardNavigation={admin ? [...dashboardNavigation, { href: routes.admin, label: adminCopy.navigation, symbol: "grid" }] : dashboardNavigation}
      site={{
        demoLabel: backendCopy.ACCOUNT_LABEL,
        name: site.name,
        englishName: site.englishName,
      }}
      copy={{
        logout: backendCopy.LOGOUT,
        error: backendCopy.INTERNAL_ERROR,
        browse: copy.browse,
        profileTitle: copy.profileTitle,
        menu: copy.menu,
        demoAccount: backendCopy.ACCOUNT_LABEL,
      }}
      name={state.profile.name}
    >
      {children}
    </DashboardShell>
  );
}
