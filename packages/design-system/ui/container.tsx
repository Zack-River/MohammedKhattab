import type { ComponentPropsWithoutRef } from "react";

export default function Container({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={["container", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
