import type { PaymentOrder } from "../types";
export function paymentCourseSlugs(order:Pick<PaymentOrder,"course_slug" | "pricing_snapshot">): string[] {
 const snapshot=order.pricing_snapshot;
 if(snapshot && typeof snapshot==='object' && !Array.isArray(snapshot) && Array.isArray(snapshot.courseSlugs))
  return snapshot.courseSlugs.filter((value): value is string => typeof value==='string');
 return order.course_slug ? [order.course_slug] : [];
}
