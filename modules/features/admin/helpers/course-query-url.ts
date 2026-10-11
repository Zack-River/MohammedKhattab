import { routes } from "@platform/config/navigation";
import type { AdminCourseQuery } from "@platform/types/admin-courses";
export function courseQueryUrl(query: AdminCourseQuery, page = query.page) {
 const params = new URLSearchParams({ page: String(page), sort: query.sort, direction: query.direction });
 if (query.search) params.set("q", query.search);
 if (query.category !== "all") params.set("category", query.category);
 if (query.delivery !== "all") params.set("delivery", query.delivery);
 for (const status of query.statuses) params.append("status", status);
 return `${routes.admin}?${params}`;
}
