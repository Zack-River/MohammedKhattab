import { apiResponse } from "@platform/lib/api/respond";
import { requireAdmin } from "@platform/features/admin/identity";
export async function GET() { return apiResponse(async () => { await requireAdmin(); return Response.json({ status: "authenticated" }); }); }
