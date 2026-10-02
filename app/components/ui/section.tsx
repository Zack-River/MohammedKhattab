import type { ComponentPropsWithRef } from "react";
import { cn } from "@/app/lib/cn";

export default function Section({
  alternate = false,
  className,
  ...props
}: ComponentPropsWithRef<"section"> & { alternate?: boolean }) {
  return (
    <section
      className={cn(
        "relative py-section",
        alternate && "border-y border-line bg-section",
        className,
      )}
      {...props}
    />
  );
}
