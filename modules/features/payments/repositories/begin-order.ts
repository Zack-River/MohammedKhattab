import "server-only";
import { createAuthAdministrator } from "@platform/lib/supabase/admin";
import { paymentEnvironment } from "../gateway/environment";
import { ApiError } from "@platform/lib/api/error";
import type { PaymentOrder } from "../types";
const orderErrors: Record<string, number> = {
  PAYMENT_ALREADY_PAID: 409,
  CONTACT_VERIFICATION_REQUIRED: 403,
  ALREADY_ENROLLED: 409,
  INVALID_PAYMENT_COURSE: 400,
};
export async function beginPaymentOrder(userId: string, slug: string) {
  const result = await createAuthAdministrator().rpc("begin_course_payment", {
    p_user: userId,
    p_slug: slug,
    p_live: paymentEnvironment().live,
  });
  if (result.error) {
    const code = Object.keys(orderErrors).find((key) => result.error!.message.includes(key));
    throw new ApiError(code ? orderErrors[code] : 503, code ?? "INTERNAL_ERROR");
  }
  return result.data as unknown as { order: PaymentOrder; created: boolean };
}
