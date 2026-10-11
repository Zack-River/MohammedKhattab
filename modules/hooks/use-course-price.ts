"use client";
import { useState } from "react";
import { normalizeCoursePrice, validPaidPriceInput } from "@platform/features/admin/helpers/course-price";
export function useCoursePrice(initialAmount?: number) {
  const [free, setFree] = useState(initialAmount === 0);
  const [value, setValue] = useState(initialAmount ? String(initialAmount) : "");
  const change = (input: string) => {
    const normalized = normalizeCoursePrice(input);
    if (validPaidPriceInput(normalized)) setValue(normalized);
  };
  return { free, setFree, value, change };
}
