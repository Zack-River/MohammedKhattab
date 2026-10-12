import { handlePaymentStatus } from "@platform/features/payments/handle-status";
export const runtime = "nodejs";
export async function POST(request: Request, { params }: { params: Promise<{ orderId: string }> }) {
  return handlePaymentStatus((await params).orderId, request);
}
