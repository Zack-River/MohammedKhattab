"use client";
import AccountMenu from "../account/account-menu";
import Link from "next/link";
import { routes } from "@platform/config/navigation";
import Symbol from "@platform/components/ui/symbol";
import type { DashboardShellProps, DashboardMenu } from "@platform/types/dashboard-shell";
import Brand from "./brand";
export default function DashboardHeader({name,avatarUrl,accountMenu,site,copy,menu,navigationId,showBrowseLink = true}:Pick<DashboardShellProps,"name"|"avatarUrl"|"accountMenu"|"site"|"copy"|"showBrowseLink"> & {menu:DashboardMenu;navigationId:string}) {
const {open,setOpen,toggleRef}=menu;
return (<header className="lms-app-header">
        <Brand site={{ name: site.name, englishName: site.englishName }} />
        <div className="lms-app-header-actions">
          <span className="lms-demo-label">{site.demoLabel}</span>
          {showBrowseLink && <Link href={routes.courses} className="lms-text-link">
            {copy.browse}
          </Link>}
          {accountMenu && <AccountMenu name={name} avatarUrl={avatarUrl} content={accountMenu} />}
          <button
            className="lms-mobile-toggle"
            ref={toggleRef}
            aria-label={copy.menu}
            aria-expanded={open}
            aria-controls={navigationId}
            onClick={() => setOpen(!open)}
          >
            <Symbol name={open ? "close" : "menu"} />
          </button>
        </div>
      </header>);
}
