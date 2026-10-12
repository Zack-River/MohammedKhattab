import { apiResponse } from "@platform/lib/api/respond";
import { requireAdmin } from "@platform/features/admin/identity";
import { readSales } from "./repositories/sales";
export function handleSales(request:Request) {
 return apiResponse(async()=>{await requireAdmin();const params=new URL(request.url).searchParams;return Response.json(await readSales((params.get('q') ?? '').slice(0,100),params.get('status') ?? 'all',Math.min(10000,Math.max(1,Math.floor(Number(params.get('page')) || 1)))));});
}
