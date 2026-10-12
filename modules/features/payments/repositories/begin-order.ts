import "server-only";
import { createAuthAdministrator } from "@platform/lib/supabase/admin";
import { paymentEnvironment } from "../gateway/environment";
import type { PaymentOrder } from "../types";
import type { PurchaseInput } from "@platform/types/commerce";
import { commerceDatabaseError } from "@platform/features/commerce/helpers/database-error";
export async function beginPaymentOrder(userId: string, input: PurchaseInput) {
 const result = await createAuthAdministrator().rpc("begin_commerce_payment", {
  p_expected:input.expectedTotalMinor,p_user:userId,p_kind:input.bundleSlug ? "bundle" : "course",p_slug:input.bundleSlug ?? input.courseSlug!,p_coupon:input.couponCode ?? "",p_live:paymentEnvironment().live,
 });
 if(result.error) commerceDatabaseError(result.error);
 return result.data as unknown as {order:PaymentOrder;created:boolean};
}
