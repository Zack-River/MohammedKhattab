import "server-only";
import { requireAdmin } from "../../identity";
import { ApiError } from "@platform/lib/api/error";
import type { PaymentRevenue } from "@platform/types/admin-analytics";
import { readAnalyticsSnapshot } from "../helpers/read-snapshot";
export async function readAdminAnalytics() {
  const { client } = await requireAdmin();
  const [snapshot,revenue] = await Promise.all([client.rpc("admin_dashboard_snapshot"),client.rpc("payment_revenue_snapshot")]);
  if (snapshot.error || revenue.error) throw new ApiError(503,"INTERNAL_ERROR");
  const totals = revenue.data as unknown as PaymentRevenue;
  if (!totals || ![totals.week,totals.month,totals.previousWeek,totals.previousMonth].every(value => Number.isSafeInteger(value) && value >= 0)) throw new ApiError(503,"INTERNAL_ERROR");
  return {...readAnalyticsSnapshot(snapshot.data),revenue:totals};
}
