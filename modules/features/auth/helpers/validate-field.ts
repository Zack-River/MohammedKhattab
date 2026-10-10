import { authPolicy } from "@platform/config/auth";
import { isValidEmail } from "@platform/helpers/validation/email";
import type { AuthField, AuthIssue, AuthValues } from "@platform/types/auth";
export function validateAuthField(field: AuthField, value: AuthValues): AuthIssue | undefined {
  if (field === "name") {
    if (!value.name) return "nameRequired";
    if (value.name.length < authPolicy.nameMin || value.name.length > authPolicy.nameMax) return "nameLength";
  }
  if (field === "email") {
    if (!value.email) return "emailRequired";
    if (!isValidEmail(value.email, authPolicy.emailMax)) return "emailInvalid";
  }
  if (field === "password") {
    if (!value.password) return "passwordRequired";
    if (value.password.length < authPolicy.passwordMin || value.password.length > authPolicy.passwordMax) return "passwordLength";
  }
  if (field === "confirmPassword") {
    if (!value.confirmPassword) return "confirmationRequired";
    if (value.confirmPassword !== value.password) return "confirmationMismatch";
  }
}
