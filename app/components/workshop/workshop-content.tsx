"use client";

import { useRef, type ReactNode } from "react";
import { useScrollReveals } from "@khatab/design/hooks/use-scroll-reveals";

import type { RevealOptions } from "@khatab/design/types/interactions";

export default function WorkshopContent({
  children,
  motion,
}: {
  children: ReactNode;
  motion: RevealOptions;
}) {
  const ref = useRef<HTMLElement>(null);
  useScrollReveals({ rootRef: ref, options: motion });
  return <main ref={ref}>{children}</main>;
}
