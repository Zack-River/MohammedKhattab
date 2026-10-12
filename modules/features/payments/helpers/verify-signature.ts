import "server-only";
import { isOrderId } from "./order-id";
import { createHmac, timingSafeEqual } from "node:crypto";
export function verifyPaymentSignature(body: Record<string, unknown>, key: string) {
  const { transaction_id: id, transaction_key: intent, payment_method: method, transactionHashKey: hash } = body;
  if (
    !Number.isSafeInteger(Number(id)) ||
    Number(id) <= 0 ||
    !isOrderId(intent) ||
    typeof method !== "string" ||
    typeof hash !== "string" ||
    !/^[a-f0-9]{64}$/i.test(hash)
  )
    return false;
  const digest = createHmac("sha256", key)
    .update(`TransactionId=${id}&TransactionKey=${intent}&PaymentMethod=${method}`)
    .digest();
  return timingSafeEqual(digest, Buffer.from(hash, "hex"));
}
