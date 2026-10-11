import "server-only";
import { requireAdmin } from "../../identity";
import { ApiError } from "@platform/lib/api/error";
import { readAnalyticsSnapshot } from "../helpers/read-snapshot";
export async function readAdminAnalytics() {
  const { client } = await requireAdmin();
  const { data, error } = await client.rpc("admin_dashboard_snapshot");
  if (error) throw new ApiError(503, "INTERNAL_ERROR");
  return readAnalyticsSnapshot(data);
}
