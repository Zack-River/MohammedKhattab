import "server-only";
import { createAuthAdministrator } from "@platform/lib/supabase/admin";
import { ApiError } from "@platform/lib/api/error";
import type { PaymentOrder } from "../types";
export async function markUnpaid(order: PaymentOrder, statusText: unknown) {
  const terminal =
    typeof statusText === "string" && ["failed", "cancelled", "canceled", "expired"].includes(statusText.toLowerCase());
  if (!terminal && Date.parse(order.expires_at) > Date.now()) return order;
  const result = await createAuthAdministrator()
    .from("payment_orders")
    .update({ status: terminal ? "failed" : "expired" })
    .eq("id", order.id)
    .neq("status", "paid")
    .select("*")
    .maybeSingle();
  if (result.error) throw new ApiError(503, "INTERNAL_ERROR");
  return result.data ?? order;
}
