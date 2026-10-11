import { hasAdminAccess } from "@platform/features/admin/identity";
import { adminCopy } from "@platform/data/admin";
import { routes } from "@platform/config/navigation";
import { dashboardShellContent } from "@platform/config/dashboard-shell";
import { dashboardNavigation } from "@platform/data/site";
import DashboardShell from "@platform/components/layout/dashboard-shell";
import { readStudentState } from "@platform/features/learning";
export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const state = await readStudentState(), admin = await hasAdminAccess();
  return <DashboardShell {...dashboardShellContent} name={state.profile.name}
    dashboardNavigation={admin ? [...dashboardNavigation, { href: routes.adminDashboard, label: adminCopy.navigation, symbol: "grid" }] : dashboardNavigation}>
    {children}
  </DashboardShell>;
}
