"use client";
import { useEffect, type RefObject } from "react";

/** Align fragments after streamed page content commits, including hash changes. */
export function useFragmentNavigation({ rootRef, enabled = true }: {
  rootRef: RefObject<HTMLElement | null>;
  enabled?: boolean;
}) {
  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    const align = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        let id: string;
        try { id = decodeURIComponent(window.location.hash.slice(1)); }
        catch { return; }
        const target = id && document.getElementById(id);
        if (target && rootRef.current?.contains(target)) target.scrollIntoView({ block: "start" });
      });
    };
    align();
    window.addEventListener("hashchange", align);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", align);
    };
  }, [rootRef, enabled]);
}
