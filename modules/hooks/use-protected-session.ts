"use client";
import { useHistoryRestoration } from "@khatab/design/ui/history-boundary";
import { useEffect, useRef, useState } from "react";
/** Server layouts authorize initial rendering; client route changes and restored history are rechecked. */
export function useProtectedSession(pathname: string, endpoint: string, login: string) {
  const restoration = useHistoryRestoration();
  const [verifiedPath, setVerifiedPath] = useState<{ path: string; restoration: number } | null>(restoration ? null : { path: pathname, restoration });
  const lastPath = useRef(pathname);
  useEffect(() => {
    let controller: AbortController | undefined;
    const verify = async () => {
      controller?.abort();
      controller = new AbortController();
      const signal = controller.signal;
      setVerifiedPath(null);
      try {
        const response = await fetch(endpoint, { cache: "no-store", signal });
        if (!response.ok || (await response.json()).status !== "authenticated") {
          window.location.replace(login);
          return;
        }
        if (!signal.aborted) setVerifiedPath({ path: pathname, restoration });
      } catch {
        if (!signal.aborted) window.location.replace(login);
      }
    };
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (restoration || navigation?.type === "back_forward" || lastPath.current !== pathname) { lastPath.current = pathname; void verify(); }
    const restored = (event: PageTransitionEvent) => { if (event.persisted) void verify(); };
    const leaving = () => setVerifiedPath(null);
    window.addEventListener("pageshow", restored);
    window.addEventListener("pagehide", leaving);
    return () => {
      controller?.abort();
      window.removeEventListener("pageshow", restored);
      window.removeEventListener("pagehide", leaving);
    };
  }, [pathname, endpoint, login, restoration]);
  return verifiedPath?.path === pathname && verifiedPath.restoration === restoration;
}
