"use client";

import { useId } from "react";
import { useBelowBreakpoint } from "@khatab/design/hooks/use-below-breakpoint";
import Container from "@khatab/design/ui/container";
import ActionLink from "@khatab/design/ui/action-link";
import Icon from "@khatab/design/ui/ui-icon";
import type { HeaderContent } from "@khatab/design/types/marketing";

export default function SiteNavigation({
  content,
  open,
  onClose,
  onToggle,
}: {
  content: Pick<
    HeaderContent,
    "brand" | "navigation" | "navigationLabel" | "toggleLabel" | "action"
  >;
  open: boolean;
  onClose: () => void;
  onToggle: () => void;
}) {
  const menuId = useId();
  const collapsed = useBelowBreakpoint("--breakpoint-navigation") && !open;
  return (
    <nav className="site-navbar" aria-label={content.navigationLabel}>
      <Container className="nav-inner">
        <a
          href={content.brand.href}
          className="nav-brand"
          aria-label={content.brand.title}
        >
          <span className="nav-brand-title">{content.brand.label}</span>
        </a>
        <ul
          id={menuId}
          className={open ? "nav-links is-open" : "nav-links"}
          onClick={onClose}
          aria-hidden={collapsed}
          inert={collapsed}
        >
          {content.navigation.map((link) => (
            <li className="nav-link-item" key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          <ActionLink
            action={content.action}
            className="nav-cta-btn"
            arrow={false}
          />
          <button
            className="mobile-nav-toggle"
            type="button"
            aria-label={content.toggleLabel}
            aria-controls={menuId}
            aria-expanded={open}
            onClick={onToggle}
            data-menu-toggle
          >
            <Icon name="menu" />
          </button>
        </div>
      </Container>
    </nav>
  );
}
