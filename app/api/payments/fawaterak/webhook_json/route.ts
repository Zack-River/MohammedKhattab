import { handlePaymentWebhook } from "@platform/features/payments/handle-webhook";
export const runtime = "nodejs";
export async function POST(request: Request) {
  return handlePaymentWebhook(request);
}
