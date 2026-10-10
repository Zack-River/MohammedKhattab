import type { LearningState } from "@platform/types/lms";
import { validateProfile } from "@platform/features/profile/validation";
export function readLearningResponse(input: unknown): LearningState {
  if (!input || typeof input !== "object") throw new Error("Invalid learning response");
  const value = input as Record<string, unknown>;
  const profile = validateProfile(value.profile, { allowEmptyEmail: true });
  if (!profile || !Array.isArray(value.enrolled) || !Array.isArray(value.completed)
    || !value.enrolled.every((id): id is string => typeof id === "string")
    || !value.completed.every((id): id is string => typeof id === "string"))
    throw new Error("Invalid learning response");
  return { profile, enrolled: value.enrolled, completed: value.completed };
}
