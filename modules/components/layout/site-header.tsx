"use client";
import { useBelowBreakpoint } from "@khatab/design/hooks/use-below-breakpoint";
import { routes } from "@platform/config/navigation";

import type { ContentBindings } from "@platform/types/content";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId } from "react";
import { useMobileMenu } from "@khatab/design/hooks/use-mobile-menu";
import Brand from "./brand";
import Symbol from "@platform/components/ui/symbol";
export default function SiteHeader({
  interfaceCopy,
  marketingNavigation,
  copy,
  site,
  actions = {
    home: routes.home,
    dashboard: routes.dashboard,
    start: routes.login,
  },
}: {
  actions?: { home: string; dashboard: string; start: string };
  interfaceCopy: Pick<
    ContentBindings["interfaceCopy"],
    "mainNavigationLabel" | "dashboardLabel"
  >;
  marketingNavigation: ContentBindings["marketingNavigation"];
  copy: Pick<ContentBindings["copy"], "start" | "close" | "menu">;
  site: Pick<ContentBindings["site"], "name" | "englishName">;
}) {
  const { open, setOpen, menuRef, toggleRef } = useMobileMenu();
  const collapsed = useBelowBreakpoint("--breakpoint-navigation") && !open;
  const id = useId();
  const pathname = usePathname();
  return (
    <header className="site-header lms-site-header">
      <nav
        className="site-navbar"
        aria-label={interfaceCopy.mainNavigationLabel}
      >
        <div className="container lms-navbar">
          <Brand
            href={actions.home}
            site={{ name: site.name, englishName: site.englishName }}
          />
          <div
            className={`lms-marketing-links ${open ? "is-open" : ""}`}
            id={id}
            aria-hidden={collapsed}
            inert={collapsed}
            ref={(element) => {
              menuRef.current = element;
            }}
          >
            {marketingNavigation.map((link) => (
              <Link
                href={link.href}
                key={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="lms-nav-actions">
            <Link href={actions.dashboard} className="lms-text-link">
              {interfaceCopy.dashboardLabel}
            </Link>
            <Link href={actions.start} className="btn-primary lms-nav-button">
              {copy.start}
              <Symbol name="arrow" />
            </Link>
            <button
              className="lms-mobile-toggle"
              ref={toggleRef}
              aria-label={open ? copy.close : copy.menu}
              aria-controls={id}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              <Symbol name={open ? "close" : "menu"} />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
