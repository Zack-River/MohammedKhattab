"use client";
import { useEffect, useState } from "react";
import { endpoints } from "@platform/config/navigation";
import { paymentRequest } from "@platform/features/payments/client/request";
import { useAsyncCommand } from "./use-async-command";
import type { readPaymentReceipt } from "@platform/features/payments/repositories/read-order";
type Receipt = Awaited<ReturnType<typeof readPaymentReceipt>>;
export function usePaymentStatus(initial: Receipt, errorLabel: string) {
  const [order, setOrder] = useState(initial),
    command = useAsyncCommand(errorLabel);
  const refresh = () =>
    command.run(async () => setOrder(await paymentRequest<Receipt>(endpoints.paymentReconcile(order.id))));
  useEffect(() => {
    if (initial.status === "paid" && initial.enrolled) return;
    let stopped = false,
      attempts = 0,
      timer: ReturnType<typeof setTimeout>;
    const controller = new AbortController();
    const poll = async () => {
      try {
        const response = await fetch(endpoints.paymentReconcile(initial.id), {
          method: "POST",
          signal: controller.signal,
        });
        if (!response.ok) return;
        const next = (await response.json()) as Receipt;
        if (!stopped) setOrder(next);
        if (next.status === "paid" || next.status === "expired" || next.status === "failed") return;
      } catch {
        if (stopped) return;
      }
      if (!stopped && ++attempts < 6) timer = setTimeout(poll, 16000);
    };
    void poll();
    return () => {
      stopped = true;
      controller.abort();
      clearTimeout(timer);
    };
  }, [initial.id, initial.status, initial.enrolled]);
  return { order, refresh, pending: command.pending, error: command.error };
}
