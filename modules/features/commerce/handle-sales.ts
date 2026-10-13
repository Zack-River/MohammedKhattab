import { readCommerceQuery } from "./helpers/read-commerce-query";
import { paymentCopy } from "@platform/data/payment-copy";
import { apiResponse } from "@platform/lib/api/respond";
import { requireAdmin } from "@platform/features/admin/identity";
import { readSales } from "./repositories/sales";
export function handleSales(request:Request) {
 return apiResponse(async()=>{await requireAdmin();const params=new URL(request.url).searchParams;const {search,status,page}=readCommerceQuery(Object.fromEntries(params),paymentCopy.states);return Response.json(await readSales(search,status,page));});
}
