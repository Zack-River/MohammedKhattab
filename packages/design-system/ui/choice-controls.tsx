import type { InputHTMLAttributes, ReactNode } from "react";
export interface ChoiceProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
  hint?: ReactNode;
}
function Choice({ kind, label, hint, className = "", ...input }: ChoiceProps & { kind: "checkbox" | "radio" }) {
  return <label className={`ds-choice ${className}`}>
    <input {...input} type={kind} className="ds-choice-input" />
    <span className={`ds-choice-marker ds-choice-${kind}`} aria-hidden="true">
      {kind === "checkbox" && <svg viewBox="0 0 16 16" fill="none"><path d="m3 8 3 3 7-7" /></svg>}
    </span>
    <span className="ds-choice-copy"><span>{label}</span>{hint && <small>{hint}</small>}</span>
  </label>;
}
export function Checkbox(props: ChoiceProps) { return <Choice {...props} kind="checkbox" />; }
export function Radio(props: ChoiceProps) { return <Choice {...props} kind="radio" />; }
