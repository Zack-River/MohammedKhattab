"use client";

import type { JSX } from "react";
import { useCountUp } from "@/app/hooks/use-count-up";

interface AnimatedStatProps {
  target: number;
  prefix: string;
  suffix: string;
}

export default function AnimatedStat({
  target,
  prefix,
  suffix,
}: AnimatedStatProps): JSX.Element {
  const elementRef = useCountUp(target, prefix, suffix);

  return (
    <span
      data-stat
      className="text-3xl font-extrabold leading-tight tabular-nums"
      ref={elementRef}
    >
      {`${prefix}${target}${suffix}`}
    </span>
  );
}
