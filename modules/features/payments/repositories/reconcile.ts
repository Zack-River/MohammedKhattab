import "server-only";
import { createAuthAdministrator } from "@platform/lib/supabase/admin";
import { markUnpaid } from "./mark-unpaid";
import { settleOrder } from "./settle-order";
import { gatewayRequest } from "../gateway/request";
import { validateTransaction } from "../helpers/validate-transaction";
import { ApiError } from "@platform/lib/api/error";
import type { PaymentOrder } from "../types";
export async function reconcilePayment(order: PaymentOrder, expectedTransaction?: number) {
  if (!order.provider_intent_key) return order;
  const client = createAuthAdministrator();
  if (!expectedTransaction && order.status !== "paid") {
    const claim = await client.rpc("claim_payment_check", {
      p_order: order.id,
    });
    if (claim.error) throw new ApiError(503, "INTERNAL_ERROR");
    if (!claim.data) return order;
  }
  const data =
    order.status === "paid"
      ? { paid: 1, transaction_id: order.transaction_id! }
      : validateTransaction(
          await gatewayRequest("getTransactionData", {
            intent_key: order.provider_intent_key,
          }),
          order,
        );
  if (expectedTransaction && data.transaction_id !== expectedTransaction) throw new ApiError(409, "PAYMENT_MISMATCH");
  if (data.paid !== 1) return markUnpaid(order, "status_text" in data ? data.status_text : null);
  return settleOrder(order, data.transaction_id);
}
