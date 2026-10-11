"use client";
import { useId, type ComponentPropsWithRef, type ReactNode } from "react";
export interface FormFieldProps extends Omit<ComponentPropsWithRef<"input">, "id"> {
  label: string; error?: string; hint?: string; control?: ReactNode;
}
export default function FormField({ label, error, hint, control, ...input }: FormFieldProps) {
  const id = useId();
  const descriptions = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(" ");
  return (
    <div className="lms-form-field">
      <label htmlFor={id}>{label}</label>
      <div className="lms-field-input-wrap" dir={input.dir} data-has-control={control ? true : undefined}>
        <input {...input} id={id} aria-invalid={Boolean(error)} aria-describedby={descriptions || undefined} />
        {control}
      </div>
      {hint && <small id={`${id}-hint`} className="lms-field-hint">{hint}</small>}
      {error && <p id={`${id}-error`} className="lms-error" role="alert">{error}</p>}
    </div>
  );
}
