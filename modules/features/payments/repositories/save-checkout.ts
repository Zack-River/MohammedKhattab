import "server-only";
import { createAuthAdministrator } from "@platform/lib/supabase/admin";
import { ApiError } from "@platform/lib/api/error";
export async function saveCheckout(orderId: string, checkout: { intentKey: string; url: string }) {
  const result = await createAuthAdministrator()
    .from("payment_orders")
    .update({ provider_intent_key: checkout.intentKey, checkout_url: checkout.url, status: "pending" })
    .eq("id", orderId)
    .eq("status", "creating")
    .select("id")
    .single();
  if (result.error) throw new ApiError(503, "INTERNAL_ERROR");
}
