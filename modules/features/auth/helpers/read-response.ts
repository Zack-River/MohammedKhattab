import { readProfileResponse } from "@platform/helpers/read-profile-response";
export function readAuthResponse(input: unknown, failureLabel: string) {
  if (!input || typeof input !== "object" || !("status" in input)) throw new Error(failureLabel);
  if (input.status === "confirmation_required") return { status: "confirmation_required" as const };
  if (input.status !== "authenticated" || !("profile" in input)) throw new Error(failureLabel);
  try { return { status: "authenticated" as const, profile: readProfileResponse(input.profile) }; }
  catch { throw new Error(failureLabel); }
}
