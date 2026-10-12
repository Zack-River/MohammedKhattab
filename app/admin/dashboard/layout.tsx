import { adminAccountMenuContent } from "@platform/config/account-menu";
import { readAccount } from "@platform/features/account/repositories/read-account";
import type { Metadata } from "next";
import DashboardShell from "@platform/components/layout/dashboard-shell";
import { dashboardShellContent } from "@platform/config/dashboard-shell";
import { endpoints, routes } from "@platform/config/navigation";
import { phoneConfirmationCopy } from "@platform/data/phone-confirmations";
import { salesCopy } from "@platform/data/sales";
import { commerceCopy } from "@platform/data/commerce";
import { analyticsCopy } from "@platform/data/admin-analytics";
import { adminUsersCopy as labels } from "@platform/data/admin-users";
import { requireAdminPage } from "@platform/features/admin/page-identity";
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage();
  const account = await readAccount();
  return <DashboardShell {...dashboardShellContent} name={account.name} avatarUrl={account.avatarUrl} accountMenu={adminAccountMenuContent}
    showSidebarHelp={false} showBrowseLink={false}
    sessionEndpoint={endpoints.adminUsers + "/session"}
    site={{ ...dashboardShellContent.site, demoLabel: labels.dashboard }}
    copy={{ ...dashboardShellContent.copy, demoAccount: labels.admin }}
    interfaceCopy={{ ...dashboardShellContent.interfaceCopy, sidebarTitle: labels.dashboard, sidebarDescription: labels.description }}
    dashboardNavigation={[{ href: routes.adminDashboard, label: analyticsCopy.home, symbol: "home" }, { href: routes.adminUsers, label: labels.users, symbol: "user" }, { href: routes.admin, label: labels.courses, symbol: "grid" }, { href: routes.adminSales, label: salesCopy.heading, symbol: "grid" }, { href: routes.adminCommerce(), label: commerceCopy.title, symbol: "grid" }, { href: routes.adminPhoneConfirmations, label: phoneConfirmationCopy.tab, symbol: "user" }]}>
    {children}
  </DashboardShell>;
}
