import { routes } from "@platform/config/navigation";
import type { AdminUserQuery } from "@platform/types/admin-users";
export function userQueryUrl(query: AdminUserQuery, page = query.page) {
  const params = new URLSearchParams({ page: String(page) });
  if (query.search) params.set("q", query.search);
  for (const status of query.statuses) params.append("status", status);
  if (query.adminsOnly) params.set("admins", "1");
  if (query.newcomers) params.set("newcomers", "1");
  return `${routes.adminUsers}?${params}`;
}
