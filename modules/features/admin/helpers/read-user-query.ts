import { userAdministration, userStatusFilters, userSearchModes } from "@platform/config/user-moderation";
import type { AdminUserQuery } from "@platform/types/admin-users";
import { ApiError } from "@platform/lib/api/error";
import { readAdminPage } from "./read-admin-page";
export function readUserQuery(params: URLSearchParams): AdminUserQuery {
  const search = (params.get("q") ?? "").trim(), statuses = [...new Set(params.getAll("status"))];
  if (search.length > userAdministration.searchMaxLength || statuses.some(status => !userStatusFilters.includes(status as "suspended" | "banned"))
    || ["admins", "newcomers"].some(key => params.has(key) && params.get(key) !== "1")) throw new ApiError(400, "INVALID_INPUT");
  const searchMode = params.get("mode") ?? userSearchModes[0];
  if (!userSearchModes.includes(searchMode as AdminUserQuery["searchMode"])) throw new ApiError(400, "INVALID_INPUT");
  return { searchMode: searchMode as AdminUserQuery["searchMode"], page: readAdminPage(params.get("page")), search, statuses: statuses as AdminUserQuery["statuses"],
    adminsOnly: params.get("admins") === "1", newcomers: params.get("newcomers") === "1" };
}
export function userQueryParams(values: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) for (const item of Array.isArray(value) ? value : value === undefined ? [] : [value]) params.append(key, item);
  return params;
}
