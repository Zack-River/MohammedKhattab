"use client";
import { useEffect, useRef, useState } from "react";
import type { SelectProps } from "../types/select";
/** Native validity and reset events stay synchronized with controlled or local selection. */
export function useSelectValue({ value, defaultValue, options, onValueChange }: SelectProps) {
  const initial = defaultValue ?? options.find(option => !option.disabled)?.value ?? "";
  const [internal, setInternal] = useState(initial), [error, setError] = useState("");
  const nativeRef = useRef<HTMLSelectElement>(null);
  function choose(next: string) { setInternal(next); setError(""); onValueChange?.(next); }
  useEffect(() => {
    const form = nativeRef.current?.form;
    const reset = () => { setInternal(initial); setError(""); onValueChange?.(initial); };
    form?.addEventListener("reset", reset);
    return () => form?.removeEventListener("reset", reset);
  }, [initial, onValueChange]);
  return { selected: value ?? internal, choose, error, setError, nativeRef };
}
