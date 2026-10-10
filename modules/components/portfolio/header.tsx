"use client";
import { useId } from "react";
import type { PortfolioContent } from "@platform/types/portfolio";
import { usePortfolioNavigation } from "@platform/hooks/portfolio/use-portfolio-navigation";
export default function PortfolioHeader({
  content,
  sectionIds,
  heroId,
}: {
  content: PortfolioContent["header"];
  sectionIds: readonly string[];
  heroId: string;
}) {
  const menuId = `${content.menuId}-${useId()}`;
  const { ref, toggleRef, open, active, close, toggle } =
    usePortfolioNavigation(sectionIds, heroId);
  return (
    <header className="p-ref-site-header personal-header" ref={ref}>
      <div className="p-ref-container p-ref-nav-container">
        <a
          className="p-ref-brand-logo"
          href={content.homeHref}
          aria-label={content.label}
        >
          <span className="p-ref-brand-name">{content.brand}</span>
        </a>
        <nav
          id={menuId}
          aria-label={content.navigationLabel}
          className={`p-ref-nav-menu ${open ? "p-ref-is-open" : ""}`}
        >
          {content.navigation.map((link) => (
            <a
              className={`p-ref-nav-link ${active === link.href.slice(1) ? "p-ref-is-active" : ""}`}
              key={link.href}
              href={link.href}
              aria-current={
                active === link.href.slice(1) ? "location" : undefined
              }
              onClick={close}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="personal-header-actions">
          <a
            className="p-ref-btn p-ref-btn-primary p-ref-nav-cta"
            href={content.actionHref}
            onClick={close}
          >
            {content.action}
          </a>
          <button
            ref={toggleRef}
            className="p-ref-mobile-toggle personal-menu-toggle"
            type="button"
            aria-label={open ? content.closeLabel : content.openLabel}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={toggle}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
