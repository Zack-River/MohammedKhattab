"use client";
import { useAsyncCommand } from "@platform/hooks/use-async-command";
import { paymentRequest } from "@platform/features/payments/client/request";
import { endpoints } from "@platform/config/navigation";
import Action from "@khatab/design/ui/action";
export default function CheckoutButton({
  input,
  totalMinor,
  disabled = false,
  labels,
}: {
  input: import("@platform/types/commerce").PurchaseInput;
  totalMinor: number;
  disabled?: boolean;
  labels: { pay: string; pending: string; error: string };
}) {
  const command = useAsyncCommand(labels.error);
  const checkout = () =>
    command.run(async () => {
      const result = await paymentRequest<{ checkoutUrl: string }>(endpoints.paymentCheckout, { ...input, expectedTotalMinor: totalMinor });
      window.location.assign(result.checkoutUrl);
    });
  return (
    <div>
      <Action
        kind="button"
        type="button"
        className="btn-primary lms-full-button"
        disabled={command.pending || disabled}
        onClick={checkout}
      >
        {command.pending ? labels.pending : labels.pay}
      </Action>
      {command.error && (
        <p role="alert" className="lms-error">
          {command.error}
        </p>
      )}
    </div>
  );
}
