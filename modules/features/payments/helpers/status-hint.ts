import type { paymentCopy } from "@platform/data/payment-copy";
export function paymentStatusHint(order: { status: string; enrolled: boolean; bundleSlug?: string | null; accessRevoked?: boolean }, labels: typeof paymentCopy) {
  if (order.accessRevoked) return labels.revokedHint;
  if (order.status === "failed") return labels.failedHint;
  if (order.status === "expired") return labels.expiredHint;
  if (order.status !== "paid") return labels.pendingHint;
  if (!order.enrolled) return labels.activationHint;
  return order.bundleSlug ? labels.paidBundleHint : labels.paidHint;
}
export function paymentNeedsPolling(status: string, enrolled: boolean, accessRevoked = false) {
  if (accessRevoked) return false;
  return status === "creating" || status === "pending" || status === "paid" && !enrolled;
}
