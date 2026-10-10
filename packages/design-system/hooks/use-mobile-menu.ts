"use client";
import { useCallback, useRef, useState } from "react";
import { useMenuDismissal } from "./use-menu-dismissal";
export interface MobileMenuOptions {
  breakpointToken?: string;
  initialOpen?: boolean;
}
export function useMobileMenu({ breakpointToken = "--breakpoint-navigation", initialOpen = false }: MobileMenuOptions = {}) {
  const [open, setOpen] = useState(initialOpen);
  const menuRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useMenuDismissal({ rootRef: menuRef, toggleRef, open, onClose: close, breakpointToken });
  return { open, setOpen, menuRef, toggleRef };
}
