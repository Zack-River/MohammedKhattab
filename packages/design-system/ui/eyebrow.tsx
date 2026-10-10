import type { ComponentPropsWithoutRef } from "react";

export default function Eyebrow({
  children,
  className,
  accent = true,
  dot = true,
  ...props
}: ComponentPropsWithoutRef<"div"> & { accent?: boolean; dot?: boolean }) {
  return (
    <div
      className={["eyebrow", accent && "eyebrow-accent", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {dot && <span className="eyebrow-dot" aria-hidden="true" />}
      {children}
    </div>
  );
}
