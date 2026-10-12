import { ApiError } from "@platform/lib/api/error";
import { isOrderId } from "./order-id";

/** Fawaterak serves hosted checkout using both full and shortened URLs. */
export function readCheckoutLink(result: Record<string, unknown>, origin: string) {
  if (!isOrderId(result.intent_key) || typeof result.url !== "string")
    throw new ApiError(503, "PAYMENTS_UNAVAILABLE");
  let url: URL;
  try { url = new URL(result.url); }
  catch { throw new ApiError(503, "PAYMENTS_UNAVAILABLE"); }
  if (url.origin !== origin || !/^\/(?:transactions|ts)\/[a-zA-Z0-9_-]+\/?$/.test(url.pathname) || url.username || url.password)
    throw new ApiError(503, "PAYMENTS_UNAVAILABLE");
  return { intentKey: result.intent_key, url: url.href };
}
