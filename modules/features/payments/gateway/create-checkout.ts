import "server-only";
import { isOrderId } from "../helpers/order-id";
import { checkoutPayload } from "./checkout-payload";
import { paymentEnvironment } from "./environment";
import { gatewayRequest } from "./request";
import { ApiError } from "@platform/lib/api/error";
import type { AccountProfile } from "@platform/types/account";
import type { PaymentOrder } from "../types";
export async function createGatewayCheckout(order: PaymentOrder, account: AccountProfile) {
  const result = await gatewayRequest("createTransaction", checkoutPayload(order, account));
  if (!isOrderId(result.intent_key) || typeof result.url !== "string") throw new ApiError(503, "PAYMENTS_UNAVAILABLE");
  const url = new URL(result.url);
  if (
    url.origin !== paymentEnvironment().origin ||
    !url.pathname.startsWith("/transactions/") ||
    url.username ||
    url.password
  )
    throw new ApiError(503, "PAYMENTS_UNAVAILABLE");
  return { intentKey: result.intent_key, url: url.href };
}
