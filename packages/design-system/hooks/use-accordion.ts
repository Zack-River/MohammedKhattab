"use client";
import { useId, useState } from "react";

export function useAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const id = useId();
  const toggle = (index: number) =>
    setOpenIndex((previous) => (previous === index ? null : index));
  return { openIndex, toggle, id };
}
