import { useEffect, useId, useRef, useState } from "react";
import { useMediaQuery } from "./use-media-query";

function desktopQuery(): string {
  const breakpoint = getComputedStyle(document.documentElement)
    .getPropertyValue("--breakpoint-lg")
    .trim();
  if (!breakpoint) throw new Error("The Tailwind lg breakpoint is missing.");
  return `(width >= ${breakpoint})`;
}

export function useMobileNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigationRef = useRef<HTMLElement>(null);
  const menuId = useId();
  const desktop = useMediaQuery(desktopQuery);
  const visible = isMenuOpen && !desktop;

  useEffect(() => {
    if (!visible) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        navigationRef.current
          ?.querySelector<HTMLButtonElement>("[data-menu-toggle]")
          ?.focus();
      }
    };
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (
        event.target instanceof Node &&
        !navigationRef.current?.contains(event.target)
      )
        setIsMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("click", closeOnOutsideClick);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("click", closeOnOutsideClick);
    };
  }, [visible]);

  // Close on desktop entry through the external subscription, without effect state updates.
  useEffect(() => {
    const media = window.matchMedia(desktopQuery());
    const closeOnDesktop = () => {
      if (media.matches) setIsMenuOpen(false);
    };
    media.addEventListener("change", closeOnDesktop);
    return () => media.removeEventListener("change", closeOnDesktop);
  }, []);

  return { isMenuOpen: visible, setIsMenuOpen, navigationRef, menuId };
}
