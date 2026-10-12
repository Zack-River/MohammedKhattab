import "server-only";
import { createAuthAdministrator } from "@platform/lib/supabase/admin";
import { ApiError } from "@platform/lib/api/error";
import type { PaymentOrder } from "../types";
export async function settleOrder(order: PaymentOrder, transactionId: number) {
  const client = createAuthAdministrator();
  const result = await client.rpc("settle_course_payment", {
    p_order: order.id,
    p_intent: order.provider_intent_key!,
    p_transaction: transactionId,
    p_amount: order.amount_minor,
    p_currency: order.currency,
  });
  if (result.error) throw new ApiError(503, "INTERNAL_ERROR");
  const updated = await client.from("payment_orders").select("*").eq("id", order.id).single();
  if (updated.error) throw new ApiError(503, "INTERNAL_ERROR");
  return updated.data;
}
