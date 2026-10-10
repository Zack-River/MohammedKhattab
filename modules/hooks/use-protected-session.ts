"use client";
import { useEffect, useState } from "react";
export function useProtectedSession(pathname: string, endpoint: string, login: string) {
  const [verifiedPath, setVerifiedPath] = useState<string | null>(null);
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
        if (!signal.aborted) setVerifiedPath(pathname);
      } catch {
        if (!signal.aborted) window.location.replace(login);
      }
    };
    void verify();
    window.addEventListener("pageshow", verify);
    window.addEventListener("popstate", verify);
    return () => {
      controller?.abort();
      window.removeEventListener("pageshow", verify);
      window.removeEventListener("popstate", verify);
    };
  }, [pathname, endpoint, login]);
  return verifiedPath === pathname;
}
