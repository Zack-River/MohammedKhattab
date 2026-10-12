import { headers } from "next/headers";
import { auditEvent } from "@platform/lib/security/audit-event";
import { ApiError } from "./error";
import { backendCopy } from "@platform/data/backend-copy";
export async function apiResponse(action: () => Promise<Response>) {
  try {
    const response = await action();
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch (error) {
    const missing = error instanceof Error && error.message === "SUPABASE_NOT_CONFIGURED";
    const status = error instanceof ApiError ? error.status : missing ? 503 : 500;
    const code = error instanceof ApiError ? error.code : missing ? "SUPABASE_NOT_CONFIGURED" : "INTERNAL_ERROR";
    if (status >= 500 || code === "INVALID_PAYMENT_SIGNATURE" || code === "FORBIDDEN") {
      const requestId = (await headers()).get("x-request-id") ?? "unavailable";
      auditEvent(code, status, requestId);
    }
    const responseHeaders: Record<string, string> = { "Cache-Control": "private, no-store" };
    if (error instanceof ApiError && error.retryAfter) responseHeaders["Retry-After"] = String(error.retryAfter);
    return Response.json({ error: backendCopy[code] ?? backendCopy.INTERNAL_ERROR, code }, { status, headers: responseHeaders });
  }
}
