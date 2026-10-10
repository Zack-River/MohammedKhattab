import type { AuthValues } from "@platform/types/auth";
export function readAuthValues(input: unknown): AuthValues {
  const source = input && typeof input === "object" && !Array.isArray(input) ? input as Record<string, unknown> : {};
  const text = (key: keyof AuthValues) => typeof source[key] === "string" ? source[key] : "";
  return { name: text("name").trim(), email: text("email").trim().toLowerCase(), password: text("password"), confirmPassword: text("confirmPassword") };
}
