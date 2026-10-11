import type { ReactNode } from "react";
export interface SelectOption { value: string; label: string; disabled?: boolean; }
export interface SelectProps {
  options: readonly SelectOption[]; label: ReactNode; name?: string; id?: string;
  value?: string; defaultValue?: string; onValueChange?: (value: string) => void;
  validationMessage?: string; required?: boolean; disabled?: boolean; placeholder?: string; className?: string;
}
