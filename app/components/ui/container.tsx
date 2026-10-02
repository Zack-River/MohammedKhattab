import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/app/lib/cn";

const widths = {
  page: "max-w-page",
  content: "max-w-content",
  reading: "max-w-reading",
} as const;

export default function Container({
  width = "page",
  className,
  ...props
}: ComponentPropsWithoutRef<"div"> & { width?: keyof typeof widths }) {
  return (
    <div
      className={cn("mx-auto w-full px-4 sm:px-6", widths[width], className)}
      {...props}
    />
  );
}
