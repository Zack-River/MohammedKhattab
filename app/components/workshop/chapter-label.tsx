import { journeyChapters } from "@/app/data/journey";
import { cn } from "@/app/lib/cn";

export default function ChapterLabel({
  index,
  paper = false,
  inverse = false,
}: {
  index: number;
  paper?: boolean;
  inverse?: boolean;
}) {
  const chapter = journeyChapters[index];
  return (
    <div
      className={cn(
        "mb-8 flex items-center gap-3 text-sm font-semibold",
        inverse
          ? "text-foreground/85"
          : paper
            ? "text-paper-muted"
            : "text-muted",
      )}
    >
      <span
        className={cn(
          "flex size-8 items-center justify-center rounded-full border text-xs tabular-nums",
          inverse
            ? "border-foreground/40 text-foreground"
            : paper
              ? "border-paper-line text-ink"
              : "border-line-strong text-copy",
        )}
      >
        {chapter.number}
      </span>
      <span>{chapter.title}</span>
      <span
        className={cn(
          "h-px w-12",
          inverse
            ? "bg-foreground/40"
            : paper
              ? "bg-paper-line"
              : "bg-line-strong",
        )}
        aria-hidden="true"
      />
    </div>
  );
}
