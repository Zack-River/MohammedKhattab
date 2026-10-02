import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/app/lib/cn";

const sizes = {
  compact: "min-h-11 px-3 py-2 text-sm sm:px-4",
  default: "min-h-14 px-7 py-4 text-base sm:text-lg",
} as const;

export default function ButtonLink({
  size = "default",
  className,
  ...props
}: ComponentPropsWithoutRef<"a"> & { size?: keyof typeof sizes }) {
  return (
    <a
      data-button-link
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg border border-transparent bg-brand text-center font-bold text-foreground shadow-brand transition-[translate,scale,background-color,box-shadow] duration-200 ease-out motion-safe:hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-glow focus-visible:shadow-glow motion-safe:active:translate-y-0 motion-safe:active:scale-95 active:shadow-none motion-reduce:translate-none motion-reduce:scale-none motion-reduce:transition-none",
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
