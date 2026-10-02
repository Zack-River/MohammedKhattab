"use client";

import { editRhythms } from "@/app/data/first-edit";
import { useFirstEdit } from "./first-edit-provider";
import ClipPreview from "./clip-preview";

export default function FinalEdit() {
  const { rhythm, chosen } = useFirstEdit();
  return (
    <div
      data-final-edit
      data-final-rhythm={rhythm}
      className="rounded-2xl border border-foreground/30 bg-canvas p-5 text-foreground sm:p-7"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-xl font-bold">
          {chosen ? "دي النسخة اللي اخترتها." : "لقطتنا وصلت للنهاية."}
        </h3>
        <span className="rounded-full border border-line-strong px-3 py-1 text-xs">
          {editRhythms[rhythm].label} ✓
        </span>
      </div>
      <ClipPreview />
      <p className="mt-5 text-sm leading-relaxed text-copy">
        {chosen
          ? "اختارت الإيقاع، وشفت التقطيع واللون والعنوان. دي أول تجربة… تخيّل بعد ما تتعلّم."
          : "دي معاينة للنسخة الهادية. تقدر ترجع وتجرب اختيارك قبل ما تبدأ."}
      </p>
      <a
        href="#clients"
        className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-brand-soft hover:text-foreground"
      >
        {chosen ? "أجرّب الإيقاع التاني ↑" : "أختار إيقاع الفيديو ↑"}
      </a>
    </div>
  );
}
