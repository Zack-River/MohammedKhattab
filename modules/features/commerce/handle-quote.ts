import { apiResponse } from "@platform/lib/api/respond";
import { ApiError } from "@platform/lib/api/error";
import { readJson,sameOrigin } from "@platform/lib/server-request";
import { currentIdentity } from "@platform/features/auth/server/identity";
import { validatePurchase } from "./helpers/validate-purchase";
import { quotePurchase } from "./repositories/quote";
export function handlePriceQuote(request:Request) {
 return apiResponse(async()=>{
  if(!sameOrigin(request)) throw new ApiError(403,"FORBIDDEN");
  const input=validatePurchase(await readJson(request));if(!input) throw new ApiError(400,"INVALID_INPUT");
  const identity=await currentIdentity();
  if(input.couponCode && !identity) throw new ApiError(401,"UNAUTHENTICATED");
  return Response.json(await quotePurchase(input,identity?.user.id));
 });
}
