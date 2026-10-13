import type { paymentCopy } from "@platform/data/payment-copy";
export function paymentStatusHint(order: { status: string; enrolled: boolean; bundleSlug?: string | null }, labels: typeof paymentCopy) {
  if (order.status === "failed") return labels.failedHint;
  if (order.status === "expired") return labels.expiredHint;
  if (order.status !== "paid") return labels.pendingHint;
  if (!order.enrolled) return labels.activationHint;
  return order.bundleSlug ? labels.paidBundleHint : labels.paidHint;
}
export function paymentNeedsPolling(status: string, enrolled: boolean) {
  return status === "creating" || status === "pending" || status === "paid" && !enrolled;
}
