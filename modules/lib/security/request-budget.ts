import "server-only";
import { createHmac } from "node:crypto";
import { createAuthAdministrator } from "@platform/lib/supabase/admin";
import { securityPolicy } from "@platform/config/security";
import { ApiError } from "@platform/lib/api/error";
import { clientAddress } from "./client-address";
import { ratePolicy } from "./rate-policy";
/** Atomic database counters persist across serverless instances; raw IPs are never stored. */
export async function requestBudget(request: Request, userId?: string) {
  const policy = ratePolicy(new URL(request.url).pathname, request.method);
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!secret) throw new ApiError(503, "SUPABASE_NOT_CONFIGURED");
  const bucket = createHmac("sha256", secret).update(`${policy.name}:${userId ? `user:${userId}` : `ip:${clientAddress(request.headers)}`}`).digest("hex");
  const result = await createAuthAdministrator().rpc("consume_request_budget", {
    p_bucket: bucket, p_limit: policy.limit, p_seconds: policy.seconds,
  }).abortSignal(AbortSignal.timeout(securityPolicy.budgetTimeoutMs));
  if (result.error || !result.data || typeof result.data !== "object" || Array.isArray(result.data)) {
    throw new ApiError(503, "SECURITY_UNAVAILABLE");
  }
  return { allowed: result.data.allowed === true, retryAfter: Number(result.data.retryAfter) || policy.seconds };
}
