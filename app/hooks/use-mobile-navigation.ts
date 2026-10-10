import { useCallback, useRef, useState } from "react";
import { useMenuDismissal } from "@khatab/design/hooks/use-menu-dismissal";
/** Workshop navigation keeps its existing container and public state names. */
export function useMobileNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigationRef = useRef<HTMLElement>(null);
  const close = useCallback(() => setIsMenuOpen(false), []);
  useMenuDismissal({ rootRef: navigationRef, open: isMenuOpen, onClose: close,
    focusSelector: "[data-menu-toggle]", breakpointToken: "--breakpoint-navigation" });
  return { navigationRef, isMenuOpen, setIsMenuOpen };
}
