"use client";

import { useRef } from "react";
import { useScrollReveals } from "@khatab/design/hooks/use-scroll-reveals";
import { useFragmentNavigation } from "@khatab/design/hooks/use-fragment-navigation";
export default function RevealContent({
  children,
  as: Element = "main",
  className,
  scope = "page",
  options,
  motion = true,
}: {
  children: React.ReactNode;
  as?: "main" | "div";
  className?: string;
  scope?: "page" | "cards";
  options?: import("@khatab/design/types/interactions").RevealOptions;
  motion?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useFragmentNavigation({ rootRef: ref, enabled: scope === "page" });
  useScrollReveals({ rootRef: ref, options, enabled: motion });
  return (
    <Element ref={ref} className={className} data-reveal-scope={scope}>
      {children}
    </Element>
  );
}
