"use client";
import Link from "next/link";
import { routes } from "@platform/config/navigation";
import Symbol from "@platform/components/ui/symbol";
import type { DashboardShellProps, DashboardMenu } from "@platform/types/dashboard-shell";
export default function DashboardSidebar({name,interfaceCopy,dashboardNavigation,copy,menu,navigationId,pathname,showSidebarHelp = true}:Pick<DashboardShellProps,"name"|"interfaceCopy"|"dashboardNavigation"|"copy"|"showSidebarHelp"> & {menu:DashboardMenu;navigationId:string;pathname:string}) {
const {open,setOpen,menuRef}=menu;
return (<aside
          className={`lms-sidebar ${open ? "is-open" : ""}`}
          id={navigationId}
          ref={menuRef}
        >
          <div className="lms-sidebar-profile">
            <span className="lms-avatar">{name.slice(0, 1)}</span>
            <div>
              <b>{name}</b>
              <small>{copy.demoAccount}</small>
            </div>
          </div>
          <nav aria-label={interfaceCopy.studentNavigationLabel}>
            {dashboardNavigation.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname === link.href ? "is-active" : ""}
                aria-current={pathname === link.href ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                <Symbol name={link.symbol} />
                {link.label}
              </Link>
            ))}
          </nav>
          {showSidebarHelp && <div className="lms-sidebar-help">
            <Symbol name="spark" />
            <b>{interfaceCopy.sidebarTitle}</b>
            <p>{interfaceCopy.sidebarDescription}</p>
            <Link href={routes.courses}>
              {copy.browse}
              <Symbol name="arrow" />
            </Link>
          </div>}
          <Link className="lms-sidebar-home" href={routes.home}>
            {interfaceCopy.homeLabel}
          </Link>
        </aside>);
}
