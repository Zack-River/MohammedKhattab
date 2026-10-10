"use client";
import { useState } from "react";
import FormField, { type FormFieldProps } from "./form-field";
export default function PasswordField({ showLabel, hideLabel, ...props }: Omit<FormFieldProps, "type" | "control"> & {
  showLabel: string; hideLabel: string;
}) {
  const [visible, setVisible] = useState(false);
  const action = visible ? hideLabel : showLabel;
  return <FormField {...props} type={visible ? "text" : "password"} control={
    <button className="lms-password-toggle" type="button" disabled={props.disabled}
      aria-label={`${action} ${props.label}`} aria-pressed={visible} onClick={() => setVisible((value) => !value)}>
      {action}
    </button>
  } />;
}
