"use client";

import type { DashboardShellProps } from "@platform/types/dashboard-shell";

import { useId } from "react";
import { usePathname } from "next/navigation";
import { useMobileMenu } from "@khatab/design/hooks/use-mobile-menu";
import { useProtectedSession } from "@platform/hooks/use-protected-session";
import { endpoints, routes } from "@platform/config/navigation";
import DashboardHeader from "./dashboard-header";
import DashboardSidebar from "./dashboard-sidebar";
export default function DashboardShell({
  children,
  name,
  avatarUrl,
  accountMenu,
  interfaceCopy,
  dashboardNavigation,
  site,
  copy,
  showSidebarHelp = true,
  showBrowseLink = true,
  sessionEndpoint = endpoints.auth.session,
}: DashboardShellProps) {
  const navigationId = useId();
  const pathname = usePathname();
  const verified = useProtectedSession(pathname, sessionEndpoint, routes.login);
  const menu = useMobileMenu({ breakpointToken: "--breakpoint-mobile" });
  if (!verified) return null;
  return (
    <div className="lms-app">
      <DashboardHeader accountMenu={accountMenu} avatarUrl={avatarUrl} showBrowseLink={showBrowseLink} name={name} site={site} copy={copy} menu={menu} navigationId={navigationId} />
      <div className="lms-app-grid">
        <DashboardSidebar showSidebarHelp={showSidebarHelp} name={name} interfaceCopy={interfaceCopy} dashboardNavigation={dashboardNavigation} copy={copy} menu={menu} navigationId={navigationId} pathname={pathname} />
        <main className="lms-app-main">{children}</main>
      </div>
    </div>
  );
}
