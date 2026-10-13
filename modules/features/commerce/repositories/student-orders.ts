import "server-only";
import { requireIdentity } from "@platform/features/auth/server/identity";
import { ApiError } from "@platform/lib/api/error";
import { commercePolicy } from "@platform/config/commerce";
import type { SaleRecord } from "@platform/types/sales";
/** Select only receipt fields; ownership is enforced in the query and by RLS. */
export async function readStudentOrders(search: string, status: string, page: number) {
  const { client, user } = await requireIdentity(), start = (page - 1) * commercePolicy.pageSize;
  let query = client.from("payment_orders").select("id,course_title,amount_minor,created_at,paid_at,status,live,bundle_slug", { count: "exact" })
    .eq("user_id", user.id).order("created_at", { ascending: false }).order("id").range(start, start + commercePolicy.pageSize - 1);
  if (search) query = query.ilike("course_title", `%${search.replace(/[%_\\]/g, "")}%`);
  if (status !== "all") query = query.eq("status", status);
  const result = await query;
  if (result.error) throw new ApiError(503, "INTERNAL_ERROR");
  const records: SaleRecord[] = result.data.map(row => ({ id: row.id, title: row.course_title, amountMinor: row.amount_minor,
    createdAt: row.created_at, paidAt: row.paid_at, status: row.status, live: row.live, bundle: Boolean(row.bundle_slug),
    username: null, name: "", couponCode: null, discountMinor: 0 }));
  return { records, total: result.count ?? 0 };
}
