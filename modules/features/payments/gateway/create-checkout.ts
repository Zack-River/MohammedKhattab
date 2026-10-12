import "server-only";
import { readCheckoutLink } from "../helpers/read-checkout-link";
import { checkoutPayload } from "./checkout-payload";
import { paymentEnvironment } from "./environment";
import { gatewayRequest } from "./request";
import type { AccountProfile } from "@platform/types/account";
import type { PaymentOrder } from "../types";
export async function createGatewayCheckout(order: PaymentOrder, account: AccountProfile) {
  const result = await gatewayRequest("createTransaction", checkoutPayload(order, account));
  return readCheckoutLink(result, paymentEnvironment().origin);
}
