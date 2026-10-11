import { readAccount } from "@platform/features/account/repositories/read-account";
import { hasAdminAccess } from "@platform/features/admin/identity";
import { adminUsersCopy } from "@platform/data/admin-users";
import { routes } from "@platform/config/navigation";
import { dashboardShellContent } from "@platform/config/dashboard-shell";
import { dashboardNavigation } from "@platform/data/site";
import DashboardShell from "@platform/components/layout/dashboard-shell";
import { readStudentState } from "@platform/features/learning";
export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const [state, admin, account] = await Promise.all([readStudentState(), hasAdminAccess(), readAccount()]);
  return <DashboardShell {...dashboardShellContent} name={state.profile.name} avatarUrl={account.avatarUrl}
    dashboardNavigation={admin ? [...dashboardNavigation, { href: routes.adminDashboard, label: adminUsersCopy.dashboard, symbol: "grid" }] : dashboardNavigation}>
    {children}
  </DashboardShell>;
}
