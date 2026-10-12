import { isTemplateEndpoint,templatePolicy } from "@platform/config/workshop-template";
import { sameOrigin } from "@platform/lib/server-request";
import { endpoints } from "@platform/config/navigation";
import { imageUploadPolicy } from "@platform/config/image-upload";
import { NextResponse, type NextRequest } from "next/server";
import { securityPolicy } from "@platform/config/security";
import { requestPolicy } from "@platform/config/request";
import { backendCopy } from "@platform/data/backend-copy";
import { requestBudget } from "./request-budget";
import { auditEvent } from "./audit-event";
import { ApiError } from "@platform/lib/api/error";
function denial(code: string, status: number, requestId: string, retryAfter?: number) {
  auditEvent(code, status, requestId);
  const response = NextResponse.json({ error: backendCopy[code], code }, { status });
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Request-Id", requestId);
  if (retryAfter) response.headers.set("Retry-After", String(retryAfter));
  return response;
}
export async function checkIngress(request: NextRequest, requestId: string) {
  const webhook = request.nextUrl.pathname === "/api/payments/fawaterak/webhook_json";
  if (!["GET", "HEAD", "OPTIONS"].includes(request.method) && !webhook && !sameOrigin(request)) {
    return denial("FORBIDDEN", 403, requestId);
  }
  if (request.url.length > securityPolicy.maxUrlLength) return denial("INVALID_INPUT", 414, requestId);
  const length = request.headers.get("content-length");
  const max = request.nextUrl.pathname === endpoints.imageUpload ? imageUploadPolicy.maxRequestBytes : isTemplateEndpoint(request.nextUrl.pathname) ? templatePolicy.maxRequestBytes : requestPolicy.maxJsonBytes;
  if (length && (!/^\d+$/.test(length) || Number(length) > max)) return denial("REQUEST_TOO_LARGE", 413, requestId);
  try {
    const budget = await requestBudget(request);
    return budget.allowed ? null : denial("RATE_LIMITED", 429, requestId, budget.retryAfter);
  } catch (error) {
    return denial(error instanceof ApiError ? error.code : "SECURITY_UNAVAILABLE", 503, requestId);
  }
}
