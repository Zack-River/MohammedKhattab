import { validateProfile } from "@platform/features/profile/validation";
export function readProfileResponse(input: unknown) {
  const profile = validateProfile(input);
  if (!profile) throw new Error("Invalid profile response");
  return profile;
}
