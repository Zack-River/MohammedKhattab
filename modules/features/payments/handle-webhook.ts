import { apiResponse } from "@platform/lib/api/respond";
import { ApiError } from "@platform/lib/api/error";
import { readJson } from "@platform/lib/server-request";
import { createAuthAdministrator } from "@platform/lib/supabase/admin";
import { paymentEnvironment } from "./gateway/environment";
import { verifyPaymentSignature } from "./helpers/verify-signature";
import { reconcilePayment } from "./repositories/reconcile";
export function handlePaymentWebhook(request: Request) {
  return apiResponse(async () => {
    const body = await readJson(request);
    if (!body || !verifyPaymentSignature(body, paymentEnvironment().hashKey))
      throw new ApiError(401, "INVALID_PAYMENT_SIGNATURE");
    const result = await createAuthAdministrator()
      .from("payment_orders")
      .select("*")
      .eq("provider_intent_key", String(body.transaction_key))
      .maybeSingle();
    if (result.error) throw new ApiError(503, "INTERNAL_ERROR");
    if (!result.data) throw new ApiError(404, "NOT_FOUND");
    await reconcilePayment(result.data, Number(body.transaction_id));
    return Response.json({ received: true });
  });
}
