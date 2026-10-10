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
    return Response.json({ error: backendCopy[code] ?? backendCopy.INTERNAL_ERROR, code }, { status, headers: { "Cache-Control": "private, no-store" } });
  }
}
