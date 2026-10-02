import type { ReactNode } from "react";
import ButtonLink from "@/app/components/ui/button-link";
import { contactLinks, siteConfig } from "@/app/config/site";
import { cn } from "@/app/lib/cn";

export default function WhatsAppCta({
  children = siteConfig.enrollmentLabel,
  className,
  showArrow = false,
  onClick,
  compact = false,
}: {
  children?: ReactNode;
  className?: string;
  showArrow?: boolean;
  onClick?: () => void;
  compact?: boolean;
}) {
  return (
    <ButtonLink
      href={contactLinks.whatsapp}
      size={compact ? "compact" : "default"}
      className={cn(!compact && "w-enrollment max-w-full", className)}
      rel="noopener"
      onClick={onClick}
    >
      <span>{children}</span>
      {showArrow && (
        <span
          className="inline-flex size-4 shrink-0 items-center justify-center"
          aria-hidden="true"
        >
          <svg className="size-full fill-current" viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </span>
      )}
    </ButtonLink>
  );
}
