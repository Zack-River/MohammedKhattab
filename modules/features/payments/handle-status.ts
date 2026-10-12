import { apiResponse } from "@platform/lib/api/respond";
import { ApiError } from "@platform/lib/api/error";
import { sameOrigin } from "@platform/lib/server-request";
import { readPaymentOrder, readPaymentReceipt } from "./repositories/read-order";
import { reconcilePayment } from "./repositories/reconcile";
export function handlePaymentStatus(id: string, request?: Request) {
  return apiResponse(async () => {
    if (request && !sameOrigin(request)) throw new ApiError(403, "FORBIDDEN");
    const order = await readPaymentOrder(id);
    return Response.json(await readPaymentReceipt(request ? await reconcilePayment(order) : order));
  });
}
