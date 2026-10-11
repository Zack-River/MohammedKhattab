import type { ComponentPropsWithoutRef } from "react";
import Icon from "./ui-icon";
import type { LinkData } from "../types/ui";

export default function ActionLink({
  action,
  arrow = true,
  variant = "primary",
  className,
  ...props
}: { action: LinkData; arrow?: boolean; variant?: "primary" | "text" } & Omit<
  ComponentPropsWithoutRef<"a">,
  "href" | "children"
>) {
  return (
    <a
      {...props}
      href={action.href}
      title={action.title}
      className={[variant === "text" ? "action-text-link" : "btn-primary", className].filter(Boolean).join(" ")}
      target={action.external ? "_blank" : undefined}
      rel={action.external ? "noopener noreferrer" : undefined}
    >
      {arrow ? (
        <>
          <span>{action.label}</span>
          <span className="btn-arrow-icon" aria-hidden="true">
            <Icon name="arrow" />
          </span>
        </>
      ) : (
        action.label
      )}
    </a>
  );
}
