import Card from "@/app/components/ui/card";
import type { JSX } from "react";

interface ReelCardProps {
  index: number;
  total: number;
  format: string;
  duration: string;
  preview: string;
  title: string;
  description: string;
}

export default function ReelCard({
  index,
  total,
  format,
  duration,
  preview,
  title,
  description,
}: ReelCardProps): JSX.Element {
  return (
    <Card
      as="article"
      dir="rtl"
      interactive
      data-showcase-card
      className="group w-reel shrink-0 snap-start overflow-hidden p-0 sm:p-0"
    >
      <div className="relative flex h-reel-preview items-center justify-center overflow-hidden bg-linear-to-br from-brand-deep via-footer to-panel">
        <span className="absolute start-4 top-4 z-10 rounded-full border border-line-strong bg-canvas/80 px-3 py-1 text-xs font-semibold text-copy">
          {format}
        </span>
        <span className="absolute bottom-4 left-4 text-xs text-copy">
          تصور توضيحي لنوع المونتاج
        </span>
        <span
          className="absolute right-4 bottom-4 text-sm font-bold text-brand-soft tabular-nums"
          dir="ltr"
        >
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(total).padStart(2, "0")}
        </span>
        <div className="relative flex flex-col items-center gap-4 px-6 text-center">
          <svg
            className="h-16 w-40 text-brand transition-[scale] duration-300 motion-safe:group-hover:scale-110 motion-reduce:transition-none"
            viewBox="0 0 160 64"
            fill="none"
            aria-hidden="true"
          >
            {index === 0 ? (
              <>
                <path
                  d="M8 48h28V16h28v32h28V16h28v32h32"
                  stroke="currentColor"
                  strokeWidth="5"
                />
                <circle cx="80" cy="32" r="10" fill="currentColor" />
              </>
            ) : index === 1 ? (
              <>
                {[12, 28, 44, 60, 76, 92, 108, 124, 140].map((x, i) => (
                  <path
                    key={x}
                    d={`M${x} ${12 + Math.abs(4 - i) * 4}v${40 - Math.abs(4 - i) * 8}`}
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                ))}
              </>
            ) : index === 2 ? (
              <>
                <rect
                  x="12"
                  y="8"
                  width="136"
                  height="48"
                  rx="8"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  d="M36 42V22h20v20M68 22h24M80 22v20M108 22h16v20h-16z"
                  stroke="currentColor"
                  strokeWidth="4"
                />
              </>
            ) : (
              <>
                <path
                  d="m20 48 36-28 28 12 44-24M108 8h20v20"
                  stroke="currentColor"
                  strokeWidth="5"
                />
                <path d="M20 56h120" stroke="currentColor" strokeWidth="2" />
              </>
            )}
          </svg>
          <div className="text-2xl font-bold text-balance">{preview}</div>
        </div>
      </div>
      <div className="flex flex-wrap items-start justify-between gap-4 p-5 sm:p-6">
        <div>
          <h4 className="mb-2 text-lg font-bold">{title}</h4>
          <p className="text-sm leading-relaxed text-copy">{description}</p>
        </div>
        <span className="rounded-full border border-line bg-canvas px-3 py-1 text-xs text-muted">
          {duration}
        </span>
      </div>
    </Card>
  );
}
