import type { ReactNode } from "react";
import { cn } from "@/app/lib/cn";

export default function Eyebrow({
  children,
  accent = true,
  className,
}: {
  children: ReactNode;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-brand/35 bg-brand/10 px-4 py-1.5 text-sm font-bold text-brand-soft",
        accent && "border-brand/45 bg-brand/15",
        className,
      )}
    >
      {accent && (
        <span className="size-2 rounded-full bg-brand" aria-hidden="true" />
      )}
      {children}
    </div>
  );
}
