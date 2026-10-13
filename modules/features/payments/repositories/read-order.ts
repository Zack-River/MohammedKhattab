import "server-only";
import { requireIdentity } from "@platform/features/auth/server/identity";
import { ApiError } from "@platform/lib/api/error";
import { isOrderId } from "../helpers/order-id";
import type { PaymentOrder } from "../types";
import { paymentCourseSlugs } from "../helpers/order-courses";
export async function readPaymentOrder(id: string): Promise<PaymentOrder> {
  const { client, user } = await requireIdentity();
  if (!isOrderId(id)) throw new ApiError(404, "NOT_FOUND");
  const { data, error } = await client
    .from("payment_orders")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) throw new ApiError(503, "INTERNAL_ERROR");
  if (!data) throw new ApiError(404, "NOT_FOUND");
  return data;
}
export function publicPaymentOrder(order: PaymentOrder) {
  return {
    id: order.id,
    courseSlug: order.course_slug,
    bundleSlug: order.bundle_slug,
    title: order.course_title,
    amount: order.amount_minor / 100,
    currency: order.currency,
    status: order.status,
    paidAt: order.paid_at,
  };
}
export async function readPaymentReceipt(order: PaymentOrder) {
  const { client, user } = await requireIdentity();
  const slugs=paymentCourseSlugs(order);
  const result = await client.from("enrollment_access").select("course_slug,active,revoked").eq("user_id",user.id).in("course_slug",slugs);
  if (result.error) throw new ApiError(503, "INTERNAL_ERROR");
  return {...publicPaymentOrder(order), accessRevoked: result.data.some(row=>row.revoked), enrolled: slugs.length>0 && slugs.every(slug=>result.data.some(row=>row.course_slug===slug && row.active))};
}
