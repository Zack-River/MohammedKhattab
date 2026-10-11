/** Shared username rules; generation and final uniqueness are enforced by the database. */
export const usernamePolicy = { min: 3, max: 48 } as const;
export function normalizeUsername(value: string) { return value.trim().toLowerCase(); }
export function isValidUsername(value: unknown): value is string {
  return typeof value === "string" && /^[a-z0-9][a-z0-9_-]{2,47}$/.test(normalizeUsername(value));
}
