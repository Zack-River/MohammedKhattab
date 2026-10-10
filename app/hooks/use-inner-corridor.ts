import { alignInnerCorridor } from "@/app/helpers/navigation/align-inner-corridor";
import { useEffect, type RefObject } from "react";

/** Preserve the reference's alignment between the navigation and content grid. */
export function useInnerCorridor(headerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const root = document.documentElement;
    const desktop = window.matchMedia(
      `(width > ${getComputedStyle(root).getPropertyValue("--breakpoint-navigation").trim()})`,
    );
    let disposed = false;
    const synchronize = () => {
      if (disposed) return;
      alignInnerCorridor(header, desktop.matches);
    };
    const observer = new ResizeObserver(synchronize);
    observer.observe(header);
    window.addEventListener("resize", synchronize);
    document.fonts.ready.then(synchronize);
    synchronize();
    return () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener("resize", synchronize);
      root.style.removeProperty("--inner-corridor-width");
      root.style.removeProperty("--top-capsule-width");
    };
  }, [headerRef]);
}
