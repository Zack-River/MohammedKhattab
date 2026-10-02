"use client";

import { useId, useState } from "react";
import type { FaqItem } from "@/app/types/workshop";

export default function FaqAccordion({ items }: { items: readonly FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const instanceId = useId();
  return (
    <div
      className="mx-auto flex max-w-reading flex-col gap-3"
      data-motion="faq"
      data-motion-children
    >
      {items.map(({ question, answer }, index) => {
        const expanded = openIndex === index;
        const buttonId = `${instanceId}-question-${index}`;
        const panelId = `${instanceId}-answer-${index}`;
        return (
          <article
            key={question}
            data-open={expanded}
            className="group overflow-hidden rounded-lg border border-line bg-canvas transition-colors hover:border-line-strong data-[open=true]:border-line-strong"
          >
            <button
              data-faq-question
              className="flex min-h-14 w-full items-center justify-between gap-4 px-4 py-5 text-start text-base font-semibold transition-colors hover:bg-panel/60 active:bg-elevated sm:px-6 sm:text-lg"
              id={buttonId}
              type="button"
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() =>
                setOpenIndex((current) => (current === index ? null : index))
              }
            >
              <span>{question}</span>
              <svg
                className="size-5 shrink-0 text-muted transition-transform group-data-[open=true]:-rotate-180 group-data-[open=true]:text-brand motion-reduce:transition-none"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!expanded}
              inert={!expanded}
              className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 group-data-[open=true]:grid-rows-[1fr] motion-reduce:transition-none"
            >
              <div className="min-h-0 overflow-hidden">
                <div className="mx-4 border-t border-line py-5 text-base leading-relaxed text-copy sm:mx-6">
                  {answer}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
