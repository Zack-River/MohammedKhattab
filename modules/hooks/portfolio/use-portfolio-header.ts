"use client";
import { useEffect, type RefObject } from "react";
import { createFrameScheduler } from "@khatab/design/helpers/browser/animation-frame";
import { updatePortfolioHeader } from "@platform/helpers/portfolio/update-header";
export function usePortfolioHeader(ref: RefObject<HTMLElement | null>, heroId: string) {
  useEffect(() => {
    const header = ref.current;
    if (!header) return;
    const hero = header.ownerDocument.getElementById(heroId);
    const { schedule, dispose } = createFrameScheduler(() => updatePortfolioHeader(header, hero));
    updatePortfolioHeader(header, hero);
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      dispose();
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
    };
  }, [ref, heroId]);
}
