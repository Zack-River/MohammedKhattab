import { useCallback, useSyncExternalStore } from "react";

// CSS token queries are resolved after hydration; the server snapshot is stable.
export function useMediaQuery(query: string | (() => string)): boolean {
  const resolve = useCallback(
    () => (typeof query === "string" ? query : query()),
    [query],
  );
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(resolve());
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    [resolve],
  );
  const getSnapshot = useCallback(
    () => window.matchMedia(resolve()).matches,
    [resolve],
  );
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
