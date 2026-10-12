"use client";
import Link from "next/link";
import Action from "@khatab/design/ui/action";
import { usePaymentStatus } from "@platform/hooks/use-payment-status";
import type { readPaymentReceipt } from "@platform/features/payments/repositories/read-order";
import type { paymentCopy } from "@platform/data/payment-copy";
export default function OrderResult({
  initial,
  labels,
  libraryHref,
  retryHref,
  settingsHref,
}: {
  initial: Awaited<ReturnType<typeof readPaymentReceipt>>;
  labels: typeof paymentCopy;
  libraryHref: string;
  retryHref: string;
  settingsHref: string;
}) {
  const { order, refresh, pending, error } = usePaymentStatus(initial, labels.error);
  return (
    <section className="lms-profile-card lms-payment-card" aria-live="polite" data-reveal="true">
      <h2>{labels.states[order.status]}</h2>
      <p>{order.title}</p>
      <strong className="lms-payment-amount numeral">
        {order.amount} {labels.currency}
      </strong>
      <p>{order.status === "paid" ? (order.enrolled ? (order.bundleSlug ? labels.paidBundleHint : labels.paidHint) : labels.activationHint) : labels.pendingHint}</p>
      {order.status === "paid" && order.enrolled ? (
        <Link className="btn-primary" href={libraryHref}>
          {labels.course}
        </Link>
      ) : (
        <>
          <Action kind="button" type="button" className="btn-primary" disabled={pending} onClick={refresh}>
            {pending ? labels.checking : labels.refresh}
          </Action>
          <Link className="lms-payment-back" href={order.status === "paid" ? settingsHref : retryHref}>
            {order.status === "paid" ? labels.settings : labels.retry}
          </Link>
        </>
      )}
      {error && (
        <p className="lms-error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
