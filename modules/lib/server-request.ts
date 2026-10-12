import { ApiError } from "./api/error";
import { readRequestBytes } from "./read-request-bytes";
import { requestPolicy } from "@platform/config/request";
export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get("content-type") ?? "")) return null;
    const bytes = await readRequestBytes(request, requestPolicy.maxJsonBytes);
    if (!bytes) return null;
    const value: unknown = JSON.parse(new TextDecoder().decode(bytes));
    return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    return null;
  }
}

export function sameOrigin(request: Request) {
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;
  const origin = request.headers.get("origin");
  if (!origin) return true; // Non-browser callers still require authentication/signatures.
  try {
    const expected = process.env.APP_ORIGIN ?? new URL(request.url).origin;
    return new URL(origin).origin === new URL(expected).origin;
  } catch { return false; }
}
