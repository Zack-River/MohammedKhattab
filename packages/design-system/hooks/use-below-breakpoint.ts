"use client";
import { useCallback, useSyncExternalStore } from "react";

/** Read a theme breakpoint without changing the server's initial markup. */
export function useBelowBreakpoint(token: string) {
  const query = useCallback(() => window.matchMedia(
    `(width <= ${getComputedStyle(document.documentElement).getPropertyValue(token).trim()})`,
  ), [token]);
  const subscribe = useCallback((notify: () => void) => {
    const media = query();
    media.addEventListener("change", notify);
    return () => media.removeEventListener("change", notify);
  }, [query]);
  return useSyncExternalStore(subscribe, () => query().matches, () => false);
}
