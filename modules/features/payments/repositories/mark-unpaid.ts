import "server-only";
import { createAuthAdministrator } from "@platform/lib/supabase/admin";
import { ApiError } from "@platform/lib/api/error";
import type { PaymentOrder } from "../types";
export async function markUnpaid(order: PaymentOrder, statusText: unknown) {
  const terminal =
    typeof statusText === "string" && ["failed", "cancelled", "canceled", "expired"].includes(statusText.toLowerCase());
  if (!terminal && Date.parse(order.expires_at) > Date.now()) return order;
  const client = createAuthAdministrator();
  const result = await client
    .from("payment_orders")
    .update({ status: terminal ? "failed" : "expired" })
    .eq("id", order.id)
    .neq("status", "paid")
    .select("*")
    .maybeSingle();
  if (result.error) throw new ApiError(503, "INTERNAL_ERROR");
  if (result.data) return result.data;
  // Settlement may have won the race: return its committed state, not the stale snapshot.
  const latest = await client.from("payment_orders").select("*").eq("id", order.id).single();
  if (latest.error) throw new ApiError(503, "INTERNAL_ERROR");
  return latest.data;
}
