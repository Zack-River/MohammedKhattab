"use client";

import { useState } from "react";
import { editRhythms, lessonOutcomes } from "@/app/data/first-edit";
import { cn } from "@/app/lib/cn";
import { useFirstEdit } from "./first-edit-provider";
import ClipPreview from "./clip-preview";

export default function LessonOutcomes() {
  const [index, setIndex] = useState(0);
  const outcome = lessonOutcomes[index];
  const { rhythm, chosen } = useFirstEdit();
  return (
    <div
      data-lesson-outcomes
      className="mb-12 overflow-hidden rounded-2xl border border-paper-line bg-paper-panel p-5 sm:p-8"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h3 className="text-2xl font-bold">هطلع بإيه كل يوم؟</h3>
        <span className="text-sm text-paper-muted">
          {chosen
            ? `بنكمل على اختيارك: ${editRhythms[rhythm].label}`
            : "جرّب الأيام وشوف النتيجة"}
        </span>
      </div>
      <div
        className="mb-7 flex flex-wrap gap-2"
        role="group"
        aria-label="معاينة نتيجة كل يوم"
      >
        {lessonOutcomes.map((item, i) => (
          <button
            data-outcome-day
            key={item.day}
            type="button"
            aria-pressed={index === i}
            aria-controls="lesson-outcome-detail"
            onClick={() => setIndex(i)}
            className={cn(
              "flex min-h-12 min-w-12 items-center justify-center rounded-lg border px-3 py-2 font-bold tabular-nums transition-colors",
              index === i
                ? "border-brand bg-brand text-foreground"
                : "border-paper-line hover:border-brand",
            )}
          >
            اليوم {item.day}
          </button>
        ))}
      </div>
      <div
        id="lesson-outcome-detail"
        className="grid min-w-0 items-center gap-7 md:grid-cols-2"
      >
        <ClipPreview key={outcome.stage} stage={outcome.stage} />
        <div aria-live="polite">
          <span className="text-sm text-brand">/ {outcome.day}</span>
          <h4 className="my-3 text-3xl font-bold">{outcome.title}</h4>
          <p className="leading-relaxed text-paper-muted">{outcome.text}</p>
          <p className="mt-5 text-xs text-paper-muted">
            معاينة تدريبية لنفس لقطة القهوة. تفاصيل الدروس كاملة تحت.
          </p>
        </div>
      </div>
    </div>
  );
}
