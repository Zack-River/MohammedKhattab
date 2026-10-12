import { handlePaymentStatus } from "@platform/features/payments/handle-status";
export async function GET(_request: Request, { params }: { params: Promise<{ orderId: string }> }) {
  return handlePaymentStatus((await params).orderId);
}
