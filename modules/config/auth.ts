import { profilePolicy } from "@platform/features/profile/validation";
import type { AuthField, AuthMode } from "@platform/types/auth";
export const authPolicy = {
  nameMin: profilePolicy.nameMin, nameMax: profilePolicy.nameMax,
  emailMax: profilePolicy.emailMax, passwordMin: 8, passwordMax: 128,
} as const;
export const authFields: Record<AuthMode, readonly AuthField[]> = {
  login: ["email", "password"], signup: ["name", "email", "password", "confirmPassword"],
};
