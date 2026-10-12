import "server-only";
import { ApiError } from "@platform/lib/api/error";
function approvedTokenUrl(url: URL) {
  const localTest =
    process.env.NODE_ENV !== "production" &&
    process.env.FAWATERAK_TEST_ORIGIN === url.origin &&
    /^http:\/\/127\.0\.0\.1:/.test(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
  const hosted = url.protocol === "https:" && ["app.fawaterk.com", "staging.fawaterk.com"].includes(url.hostname);
  return (
    (localTest || hosted) &&
    url.pathname === "/oauth/token" &&
    !url.username &&
    !url.password &&
    !url.search &&
    !url.hash
  );
}
export function paymentEnvironment() {
  const {
    FAWATERAK_TOKEN_URL: tokenUrl,
    FAWATERAK_CLIENT_ID: clientId,
    FAWATERAK_CLIENT_SECRET: clientSecret,
    HASH_API_KEY: hashKey,
  } = process.env;
  if (!tokenUrl || !clientId || !clientSecret || !hashKey) throw new ApiError(503, "PAYMENTS_UNAVAILABLE");
  let url: URL;
  try {
    url = new URL(tokenUrl);
  } catch {
    throw new ApiError(503, "PAYMENTS_UNAVAILABLE");
  }
  if (!approvedTokenUrl(url)) throw new ApiError(503, "PAYMENTS_UNAVAILABLE");
  return { tokenUrl, origin: url.origin, clientId, clientSecret, hashKey, live: url.hostname === "app.fawaterk.com" };
}
