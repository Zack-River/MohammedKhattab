"use client";
import { useEffect, useRef, useState } from "react";
import { lazyLoading } from "../config/lazy-loading";
/** Mount expensive optional content once near view, without repeated scroll work. */
export function useNearViewport<T extends HTMLElement>() {
  const ref = useRef<T>(null), [ready, setReady] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let disposed = false;
    if (!window.IntersectionObserver) {
      queueMicrotask(() => { if (!disposed) setReady(true); });
      return () => { disposed = true; };
    }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setReady(true); observer.disconnect(); }
    }, { rootMargin: lazyLoading.viewportMargin });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return { ref, ready };
}
