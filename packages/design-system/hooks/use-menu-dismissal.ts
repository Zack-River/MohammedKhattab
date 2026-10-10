"use client";
import { useEffect, type RefObject } from "react";
import { subscribeDismissal } from "../helpers/navigation/subscribe-dismissal";
export interface MenuDismissalOptions {
  rootRef: RefObject<HTMLElement | null>;
  open: boolean;
  onClose: () => void;
  toggleRef?: RefObject<HTMLElement | null>;
  focusSelector?: string;
  breakpointToken?: string;
  inclusiveBreakpoint?: boolean;
  restoreFocus?: boolean;
}
export function useMenuDismissal({ rootRef, toggleRef, open, onClose, focusSelector, breakpointToken, inclusiveBreakpoint = false, restoreFocus = true }: MenuDismissalOptions) {
  useEffect(() => {
    const root = rootRef.current;
    if (!open || !root) return;
    const breakpoint = breakpointToken && getComputedStyle(document.documentElement).getPropertyValue(breakpointToken).trim();
    return subscribeDismissal({
      root, onClose, restoreFocus,
      toggle: toggleRef?.current ?? (focusSelector ? root.querySelector<HTMLElement>(focusSelector) : undefined),
      desktopQuery: breakpoint ? `(width ${inclusiveBreakpoint ? ">=" : ">"} ${breakpoint})` : undefined,
    });
  }, [rootRef, toggleRef, open, onClose, focusSelector, breakpointToken, inclusiveBreakpoint, restoreFocus]);
}
