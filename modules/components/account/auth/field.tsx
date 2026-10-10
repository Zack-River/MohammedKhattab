import FormField from "@platform/components/ui/form-field";
import PasswordField from "@platform/components/ui/password-field";
import { authPolicy } from "@platform/config/auth";
import type { AuthCopy, AuthField, AuthMode } from "@platform/types/auth";
export default function AuthFieldInput({ field, mode, copy, error, disabled }: {
  field: AuthField; mode: AuthMode; copy: AuthCopy; error?: string; disabled: boolean;
}) {
  const content = copy.fields[field];
  const common = { ...content, name: field, required: true, disabled, error };
  if (field === "password" || field === "confirmPassword") return <PasswordField {...common}
    showLabel={copy.show} hideLabel={copy.hide} dir="ltr" maxLength={authPolicy.passwordMax}
    autoComplete={mode === "login" ? "current-password" : "new-password"} />;
  return <FormField {...common} type={field === "email" ? "email" : "text"}
    dir={field === "email" ? "ltr" : undefined} autoComplete={field === "email" && mode === "login" ? "username" : field}
    maxLength={field === "email" ? authPolicy.emailMax : authPolicy.nameMax} />;
}
