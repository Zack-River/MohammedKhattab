import { isValidEmail } from "@platform/helpers/validation/email";
import type { Learner } from "@platform/types/lms";
export const profilePolicy = {
  nameMin: 2,
  nameMax: 60,
  emailMax: 100,
} as const;
export function validateProfile(input: unknown, { allowEmptyEmail = false }: { allowEmptyEmail?: boolean } = {}): Learner | null {
  if (!input || typeof input !== "object") return null;
  const value = input as Record<string, unknown>;
  if (typeof value.name !== "string" || typeof value.email !== "string")
    return null;
  const name = value.name.trim(),
    email = value.email.trim();
  if (
    name.length < profilePolicy.nameMin ||
    name.length > profilePolicy.nameMax ||
    email.length > profilePolicy.emailMax ||
    (!(allowEmptyEmail && email === "") && !isValidEmail(email, profilePolicy.emailMax))
  )
    return null;
  return { name, email };
}
