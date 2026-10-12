"use client";
import { useId, type InputHTMLAttributes, type ReactNode } from "react";
export interface ChoiceProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
  hint?: ReactNode;
}
function Choice({ kind, label, hint, className = "", ...input }: ChoiceProps & { kind: "checkbox" | "radio" }) {
  const id = useId();
  return <label className={`ds-choice ${className}`}>
    <input {...input} type={kind} className="ds-choice-input" aria-labelledby={input["aria-labelledby"] ?? (input["aria-label"] ? undefined : `${id}-label`)}
      aria-describedby={[input["aria-describedby"], hint && `${id}-hint`].filter(Boolean).join(" ") || undefined} />
    <span className={`ds-choice-marker ds-choice-${kind}`} aria-hidden="true">
      {kind === "checkbox" && <svg viewBox="0 0 16 16" fill="none"><path d="m3 8 3 3 7-7" /></svg>}
    </span>
    <span className="ds-choice-copy"><span id={`${id}-label`}>{label}</span>{hint && <small id={`${id}-hint`}>{hint}</small>}</span>
  </label>;
}
export function Checkbox(props: ChoiceProps) { return <Choice {...props} kind="checkbox" />; }
export function Radio(props: ChoiceProps) { return <Choice {...props} kind="radio" />; }
