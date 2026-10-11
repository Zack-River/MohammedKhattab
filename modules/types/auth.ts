export type AuthMode = "login" | "signup";
export type AuthField = "name" | "email" | "password" | "confirmPassword";
export type AuthIssue = "nameRequired" | "nameLength" | "emailRequired" | "emailInvalid" | "passwordRequired" | "passwordLength" | "confirmationRequired" | "confirmationMismatch";
export type AuthErrors = Partial<Record<AuthField, AuthIssue>>;
export interface AuthValues { name: string; email: string; password: string; confirmPassword: string }
export type AuthValidation = { valid: true; values: AuthValues } | { valid: false; errors: AuthErrors };
export interface AuthFieldCopy { label: string; placeholder: string; hint?: string }
export interface AuthCopy {
  fields: Record<AuthField, AuthFieldCopy>;
  errors: Record<AuthIssue, string>;
  show: string; hide: string; requestError: string; invalidRequest: string;
}
export interface AuthPageModel {
  mode: AuthMode; title: string; description: string;
  heading: string; highlight: string; support: string; steps: readonly string[];
  submit: string; pending: string; demoLabel: string; demoNote: string; confirmationMessage: string;
  alternate: { prompt: string; label: string; href: string };
  endpoint: string; redirectTo: string; copy: AuthCopy;
  recovery?: { label: string; href: string };
  confirmationLink?: { label: string; href: string };
}
