"use client";
import { useCallback, useRef, useState } from "react";
import { usePortfolioHeader } from "./use-portfolio-header";
import { useActiveSection } from "./use-active-section";
import { useMenuDismissal } from "@khatab/design/hooks/use-menu-dismissal";
export function usePortfolioNavigation(ids: readonly string[], heroId: string) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);
  usePortfolioHeader(ref, heroId);
  const active = useActiveSection(ids);
  useMenuDismissal({ rootRef: ref, toggleRef, open, onClose: close,
    breakpointToken: "--personal-navigation-desktop", inclusiveBreakpoint: true });
  return { ref, toggleRef, open, active, close, toggle: () => setOpen((value) => !value) };
}
