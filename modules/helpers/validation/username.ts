/** Shared username rules; generation and final uniqueness are enforced by the database. */
export const usernamePolicy = { min: 3, max: 48 } as const;
export function normalizeUsername(value: string) { return value.trim().toLowerCase(); }
export function isValidUsername(value: unknown): value is string {
  return typeof value === "string" && /^[\p{L}\p{N}][\p{L}\p{N}_-]{2,47}$/u.test(normalizeUsername(value));
}
