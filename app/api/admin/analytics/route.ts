import { apiResponse } from "@platform/lib/api/respond";
import { readAdminAnalytics } from "@platform/features/admin/analytics/repositories/read-analytics";
export async function GET() {
  return apiResponse(async () => Response.json(await readAdminAnalytics()));
}
