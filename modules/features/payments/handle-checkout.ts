import { apiResponse } from "@platform/lib/api/respond";
import { ApiError } from "@platform/lib/api/error";
import { readJson, sameOrigin } from "@platform/lib/server-request";
import { createCheckout } from "./repositories/create-checkout";
import { validatePurchase } from "@platform/features/commerce/helpers/validate-purchase";
export function handleCheckout(request: Request) {
  return apiResponse(async () => {
    if (!sameOrigin(request)) throw new ApiError(403, "FORBIDDEN");
    const input = validatePurchase(await readJson(request));
    if (!input) throw new ApiError(400, "INVALID_INPUT");
    return Response.json(await createCheckout(input));
  });
}
