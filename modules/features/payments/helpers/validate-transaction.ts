import { ApiError } from "@platform/lib/api/error";
import type { PaymentOrder, GatewayTransaction } from "../types";
export function validateTransaction(data: Record<string, unknown>, order: PaymentOrder): GatewayTransaction {
  let payload: unknown = data.pay_load;
  try {
    if (typeof payload === "string") payload = JSON.parse(payload);
  } catch {
    throw new ApiError(409, "PAYMENT_MISMATCH");
  }
  const reference =
    payload && typeof payload === "object" && "merchant_reference" in payload ? payload.merchant_reference : null;
  if (
    data.intent_key !== order.provider_intent_key ||
    reference !== order.id ||
    data.currency !== order.currency ||
    typeof data.total !== "number" ||
    !Number.isFinite(data.total) ||
    Math.round(data.total * 100) !== order.amount_minor ||
    typeof data.paid !== "number" ||
    ![0, 1].includes(data.paid) ||
    !Number.isSafeInteger(data.transaction_id) ||
    Number(data.transaction_id) < 0
  )
    throw new ApiError(409, "PAYMENT_MISMATCH");
  if (Number(data.paid) === 1 && Number(data.transaction_id) <= 0) throw new ApiError(409, "PAYMENT_MISMATCH");
  return data as unknown as GatewayTransaction;
}
