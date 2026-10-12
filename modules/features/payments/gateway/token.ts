import "server-only";
import { paymentEnvironment } from "./environment";
import { ApiError } from "@platform/lib/api/error";
let cached: { token: string; until: number } | undefined;
let pending: Promise<string> | undefined;
async function authenticate() {
  const env = paymentEnvironment();
  const response = await fetch(env.tokenUrl, {
    method: "POST",
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(10000),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: env.clientId,
      client_secret: env.clientSecret,
    }),
  });
  if (!response.ok) throw new ApiError(503, "PAYMENTS_UNAVAILABLE");
  const data: unknown = await response.json();
  if (
    !data ||
    typeof data !== "object" ||
    !("access_token" in data) ||
    typeof data.access_token !== "string" ||
    !("expires_in" in data) ||
    typeof data.expires_in !== "number"
  )
    throw new ApiError(503, "PAYMENTS_UNAVAILABLE");
  cached = {
    token: data.access_token,
    until: Date.now() + Math.max(0, data.expires_in - 60) * 1000,
  };
  return cached.token;
}
export async function paymentToken(force = false) {
  if (force) cached = undefined;
  if (cached && cached.until > Date.now()) return cached.token;
  pending ??= authenticate().finally(() => {
    pending = undefined;
  });
  return pending;
}
