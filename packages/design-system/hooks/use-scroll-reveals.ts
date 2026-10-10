"use client";
import { useEffect, type RefObject } from "react";
import type { RevealOptions } from "../types/interactions";
import { createScrollReveals } from "../lib/scroll-reveals";
import { readRevealOptions } from "../helpers/theme/read-reveal-options";
export interface ScrollRevealHookOptions {
  rootRef: RefObject<HTMLElement | null>;
  options?: RevealOptions;
  enabled?: boolean;
}
/** Defaults read inherited theme tokens; an explicit options object replaces them. */
export function useScrollReveals({ rootRef, options, enabled = true }: ScrollRevealHookOptions) {
  useEffect(() => {
    const root = rootRef.current;
    if (!enabled || !root || !window.IntersectionObserver || !Element.prototype.animate) return;
    return createScrollReveals({ root, options: options ?? readRevealOptions(root),
      preference: window.matchMedia("(prefers-reduced-motion: reduce)") });
  }, [rootRef, options, enabled]);
}
