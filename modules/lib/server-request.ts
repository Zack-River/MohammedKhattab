import { readRequestBytes } from "./read-request-bytes";
import { requestPolicy } from "@platform/config/request";
export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const bytes = await readRequestBytes(request, requestPolicy.maxJsonBytes);
    if (!bytes) return null;
    const value: unknown = JSON.parse(new TextDecoder().decode(bytes));
    return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
  } catch { return null; }
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const parsed = new URL(origin);
    const host = request.headers.get("host") ?? new URL(request.url).host;
    return (
      ["http:", "https:"].includes(parsed.protocol) && parsed.host === host
    );
  } catch {
    return false;
  }
}
