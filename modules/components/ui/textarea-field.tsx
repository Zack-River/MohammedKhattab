"use client";
import { useId, type ComponentPropsWithoutRef } from "react";
export default function TextareaField({ label, hint, error, ...input }: Omit<ComponentPropsWithoutRef<"textarea">,"id"> & { label: string; hint?: string; error?: string }) {
  const id = useId();
  const descriptions = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ");
  return <div className="lms-form-field">
    <label htmlFor={id}>{label}</label>
    <textarea {...input} id={id} aria-invalid={Boolean(error)} aria-describedby={descriptions || undefined} />
    {hint && <small id={`${id}-hint`} className="lms-field-hint">{hint}</small>}
    {error && <p id={`${id}-error`} className="lms-error" role="alert">{error}</p>}
  </div>;
}
