"use client";

import type { DashboardShellProps } from "@platform/types/dashboard-shell";

import { useId } from "react";
import { usePathname } from "next/navigation";
import { useMobileMenu } from "@khatab/design/hooks/use-mobile-menu";
import DashboardHeader from "./dashboard-header";
import DashboardSidebar from "./dashboard-sidebar";
export default function DashboardShell({
  children,
  name,
  interfaceCopy,
  dashboardNavigation,
  site,
  copy,
}: DashboardShellProps) {
  const navigationId = useId();
  const pathname = usePathname();
  const menu = useMobileMenu({ breakpointToken: "--breakpoint-mobile" });
  return (
    <div className="lms-app">
      <DashboardHeader name={name} site={site} copy={copy} menu={menu} navigationId={navigationId} />
      <div className="lms-app-grid">
        <DashboardSidebar name={name} interfaceCopy={interfaceCopy} dashboardNavigation={dashboardNavigation} copy={copy} menu={menu} navigationId={navigationId} pathname={pathname} />
        <main className="lms-app-main">{children}</main>
      </div>
    </div>
  );
}
