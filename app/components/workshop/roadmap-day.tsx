import Card from "@/app/components/ui/card";
import { cn } from "@/app/lib/cn";
import type { RoadmapDayData, RoadmapStatus } from "@/app/types/workshop";

type RoadmapDayProps = RoadmapDayData & { status: RoadmapStatus };
const variants = {
  lesson: "",
  pause: "border-dashed border-paper-line bg-paper",
  practical: "border-brand/35 bg-paper-panel",
  career: "border-paper-line",
} as const;

export default function RoadmapDay(day: RoadmapDayProps) {
  return (
    <article
      data-timeline-day
      data-status={day.status}
      aria-current={day.status === "active" ? "step" : undefined}
      className="group/day relative z-10 grid grid-cols-[auto_1fr] items-start gap-x-4 gap-y-3 md:gap-8"
    >
      <div className="relative z-10 flex w-5 items-center justify-center pt-6 text-center md:w-timeline-marker md:pt-0">
        <div
          data-timeline-marker
          className={cn(
            "relative z-10 flex size-3 shrink-0 items-center justify-center rounded-full border border-paper-line bg-paper transition-colors group-hover/day:border-brand group-hover/day:bg-paper-panel group-hover/day:shadow-paper md:h-16 md:w-timeline-marker md:flex-col md:gap-1 md:rounded-lg md:p-1.5",
            day.kind === "pause" && "border-dashed",
            day.status !== "pending" && "border-brand bg-paper-panel",
          )}
        >
          <span
            className={cn(
              "hidden text-3xl leading-none font-extrabold tabular-nums transition-colors group-hover/day:text-brand md:block",
              day.status !== "pending" && "text-brand",
            )}
          >
            {day.number}
          </span>
          <span
            className={cn(
              "hidden text-xs font-semibold text-paper-muted transition-colors group-hover/day:text-ink md:block",
              day.status !== "pending" && "text-ink",
            )}
          >
            {day.label}
          </span>
        </div>
      </div>
      <div data-timeline-card className="min-w-0">
        <Card
          data-motion="roadmap-day"
          className={cn(
            "min-w-0 rounded-xl border-paper-line bg-paper-panel p-4 text-ink sm:p-6 md:p-8 transition-[translate,border-color,box-shadow] duration-300 motion-safe:group-hover/day:-translate-x-1 group-hover/day:border-brand/55 group-hover/day:shadow-card motion-reduce:translate-none motion-reduce:transition-none",
            variants[day.kind],
            day.status === "active" &&
              "border-brand/55 shadow-card motion-safe:-translate-x-1",
          )}
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-paper-line pb-3">
            <h3 className="min-w-0 text-base font-bold sm:text-lg md:text-xl">
              <span className="me-2 text-brand tabular-nums md:hidden">
                {day.number}
              </span>
              {day.title}
            </h3>
            <span
              className={cn(
                "rounded-full border border-paper-line bg-paper px-2.5 py-1 text-xs font-semibold text-paper-muted",
                day.kind === "practical" &&
                  "border-brand/35 bg-brand/10 text-brand",
              )}
            >
              {day.type}
            </span>
          </div>
          {day.kind === "pause" ? (
            <div className="flex flex-col gap-1.5">
              <h4 className="text-lg font-bold">{day.pauseHeading}</h4>
              <p className="text-base text-paper-muted">
                {day.pauseDescription}
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-2.5 text-sm leading-relaxed text-paper-muted sm:text-base">
              {day.lessons.map((lesson) => (
                <li key={lesson} className="flex items-start gap-3">
                  <span
                    className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand/75"
                    aria-hidden="true"
                  />
                  <span>{lesson}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </article>
  );
}
