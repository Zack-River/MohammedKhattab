import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/app/lib/cn";

export default function Card({
  as: Tag = "div",
  interactive = false,
  className,
  ...props
}: ComponentPropsWithoutRef<"div"> & {
  as?: "div" | "article";
  interactive?: boolean;
}) {
  return (
    <Tag
      className={cn(
        "rounded-xl border border-line bg-panel p-6 sm:p-8",
        interactive &&
          "transition-[translate,border-color,box-shadow] duration-300 ease-out motion-safe:hover:-translate-y-1 hover:border-brand/40 hover:shadow-card motion-reduce:translate-none motion-reduce:scale-none motion-reduce:rotate-none motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}
