import "server-only";
import { requireIdentity } from "@platform/features/auth/server/identity";
import { readAccount } from "@platform/features/account/repositories/read-account";
import { createGatewayCheckout } from "../gateway/create-checkout";
import { beginPaymentOrder } from "./begin-order";
import { saveCheckout } from "./save-checkout";
import { ApiError } from "@platform/lib/api/error";
import { routes } from "@platform/config/navigation";
import type { PurchaseInput } from "@platform/types/commerce";
export async function createCheckout(input: PurchaseInput) {
  const { client, user } = await requireIdentity();
  const verification = await client.rpc("contacts_verified");
  if (verification.error) throw new ApiError(503, "INTERNAL_ERROR");
  if (!verification.data) throw new ApiError(403, "CONTACT_VERIFICATION_REQUIRED");
  const account = await readAccount(),
    record = await beginPaymentOrder(user.id, input);
  if (record.order.amount_minor === 0) return {orderId:record.order.id,checkoutUrl:routes.payment(record.order.id)};
  if (!record.created) {
    if (!record.order.checkout_url) throw new ApiError(409, "PAYMENT_CREATING");
    return { orderId: record.order.id, checkoutUrl: record.order.checkout_url };
  }
  const checkout = await createGatewayCheckout(record.order, account);
  await saveCheckout(record.order.id, checkout);
  return { orderId: record.order.id, checkoutUrl: checkout.url };
}
