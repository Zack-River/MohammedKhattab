"use client";

import { useAccordion } from "../hooks/use-accordion";
import type { FaqItem as FaqItemData } from "../types/workshop";
import FaqItem from "./faq-item";

export default function FaqAccordion({
  items,
  reveal = false,
  className,
}: {
  items: readonly FaqItemData[];
  reveal?: boolean;
  className?: string;
}) {
  const { openIndex, toggle, id } = useAccordion();
  return (
    <div className={["faq-accordion", className].filter(Boolean).join(" ")} data-reveal={reveal || undefined}>
      {items.map((item, index) => (
        <FaqItem
          key={item.question}
          item={item}
          open={openIndex === index}
          buttonId={`${id}-button-${index}`}
          panelId={`${id}-panel-${index}`}
          onToggle={() => toggle(index)}
        />
      ))}
    </div>
  );
}
