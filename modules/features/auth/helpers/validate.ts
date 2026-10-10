import { authFields } from "@platform/config/auth";
import { readAuthValues } from "./read-values";
import { validateAuthField } from "./validate-field";
import type { AuthErrors, AuthMode, AuthValidation } from "@platform/types/auth";
export function validateAuth(input: unknown, mode: AuthMode): AuthValidation {
  const values = readAuthValues(input), errors: AuthErrors = {};
  for (const field of authFields[mode]) {
    const issue = validateAuthField(field, values);
    if (issue) errors[field] = issue;
  }
  return Object.keys(errors).length ? { valid: false, errors } : { valid: true, values };
}
