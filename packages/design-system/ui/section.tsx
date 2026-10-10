import type { ComponentPropsWithoutRef } from "react";

export default function Section({
  className,
  ...props
}: ComponentPropsWithoutRef<"section">) {
  return (
    <section
      className={["section", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
