import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/app/lib/cn";

export default function Heading({
  as: Tag = "h2",
  className,
  ...props
}: ComponentPropsWithoutRef<"h2"> & { as?: "h1" | "h2" | "h3" }) {
  return (
    <Tag
      className={cn(
        "text-heading font-bold tracking-tight text-balance",
        className,
      )}
      {...props}
    />
  );
}
