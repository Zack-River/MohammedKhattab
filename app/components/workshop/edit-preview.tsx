"use client";

import { editRhythms } from "@/app/data/first-edit";
import { useEditPreview } from "@/app/hooks/use-edit-preview";
import { cn } from "@/app/lib/cn";
import ClipPreview from "./clip-preview";
import ClipCredit from "./clip-credit";
import { useFirstEdit } from "./first-edit-provider";

export default function EditPreview() {
  const { rhythm, chosen, choose: chooseRhythm } = useFirstEdit();
  const { edited, choose, previewRef } = useEditPreview(rhythm);
  const edit = editRhythms[rhythm];
  return (
    <div
      data-edit-preview
      data-edit={edited ? "edited" : "raw"}
      data-selected-rhythm={rhythm}
      className="grid overflow-hidden rounded-2xl border border-line-strong bg-panel md:grid-cols-[1.25fr_1fr]"
    >
      <div className="flex min-w-0 flex-col justify-center bg-paper p-5 text-ink sm:p-8">
        <div className="mb-6 flex justify-between text-xs text-paper-muted">
          <span>نفس اللقطة. قرار منك.</span>
          <span dir="ltr">ONE CLIP / YOUR CUT</span>
        </div>
        <div ref={previewRef} data-demo-content>
          <ClipPreview stage={edited ? "finished" : "raw"} />
        </div>
        <div className="mt-5 flex gap-2" aria-hidden="true">
          {Array.from({ length: edited ? edit.cuts : 1 }, (_, i) => (
            <span key={i} className="h-3 grow rounded bg-brand" />
          ))}
        </div>
        <p className="mt-4 text-xs text-paper-muted">
          {edited
            ? `نسخة ${edit.label} · ${edit.cuts === 1 ? "لقطة متصلة" : "ثلاث قطعات"} · عنوان ولون`
            : "لقطة أصلية · 8 ثواني · من غير عنوان"}
        </p>
      </div>
      <div className="p-6 sm:p-9">
        <span className="mb-3 block text-xs text-brand-soft">
          قرارك الأول في المونتاج
        </span>
        <h3 className="mb-4 text-3xl font-bold">
          تحبها هادية
          <br />
          ولا سريعة؟
        </h3>
        <p className="mb-6 text-copy">
          اختار إحساس الفيديو، وشغّله عشان تشوف الفرق في التقطيع. اختيارك هيكمّل
          معاك لآخر الصفحة.
        </p>
        <div
          className="mb-5 flex gap-3"
          role="group"
          aria-label="اختيار إيقاع الفيديو"
        >
          {(["calm", "energetic"] as const).map((value) => (
            <button
              key={value}
              data-rhythm-choice={value}
              type="button"
              aria-pressed={chosen && rhythm === value}
              onClick={() => {
                chooseRhythm(value);
                choose(true);
              }}
              className={cn(
                "min-h-12 flex-1 rounded-xl border px-4 py-3 font-bold transition-colors",
                chosen && rhythm === value
                  ? "border-brand bg-brand"
                  : "border-line-strong hover:border-brand hover:bg-elevated",
              )}
            >
              {editRhythms[value].label} {value === "calm" ? "〜" : "↗"}
            </button>
          ))}
        </div>
        <p
          data-choice-feedback
          className="mb-6 min-h-16 text-sm text-copy"
          aria-live="polite"
        >
          {chosen
            ? `${edit.description} اختيارك محفوظ في الرحلة ✓`
            : "مفيش إجابة صح وغلط. جرّب الاتنين واختار الإحساس اللي يعجبك."}
        </p>
        <div
          className="flex flex-wrap gap-3 border-t border-line pt-5"
          role="group"
          aria-label="مقارنة الأصل والنسخة المعدلة"
        >
          {[false, true].map((value) => (
            <button
              key={String(value)}
              data-demo-choice
              type="button"
              aria-pressed={edited === value}
              onClick={() => choose(value)}
              className={cn(
                "min-h-11 rounded-full border px-4 py-2 text-sm transition-colors",
                edited === value
                  ? "border-brand bg-brand/15 text-brand-soft"
                  : "border-line-strong hover:border-brand",
              )}
            >
              {value ? "بعد المونتاج" : "قبل المونتاج"}
            </button>
          ))}
        </div>
        <ClipCredit />
        <a
          href="#roadmap"
          className="mt-6 inline-flex text-sm font-bold text-brand-soft hover:text-foreground"
        >
          إزاي أتعلم القرارات دي؟ شوف الخطة ↓
        </a>
      </div>
    </div>
  );
}
