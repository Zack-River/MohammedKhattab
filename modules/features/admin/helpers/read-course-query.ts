import { categories } from "@platform/config/catalog";
import { courseAdministration, courseSorts, courseStatuses, courseDeliveries } from "@platform/config/course-administration";
import { ApiError } from "@platform/lib/api/error";
import { readAdminPage } from "./read-admin-page";
import type { AdminCourseQuery } from "@platform/types/admin-courses";
export function readCourseQuery(params: URLSearchParams): AdminCourseQuery {
 const search = (params.get("q") ?? "").trim(), category = params.get("category") ?? "all", statuses = [...new Set(params.getAll("status"))];
 const delivery = params.get("delivery") ?? "all", sort = params.get("sort") ?? "created", direction = params.get("direction") ?? "desc";
 if (search.length > courseAdministration.searchMaxLength || !categories.some(value => value.id === category) || statuses.some(value => !courseStatuses.includes(value as "draft" | "published")) || !courseDeliveries.includes(delivery as AdminCourseQuery["delivery"]) || !courseSorts.includes(sort as AdminCourseQuery["sort"]) || !["asc", "desc"].includes(direction)) throw new ApiError(400, "INVALID_INPUT");
 return { search, category: category as AdminCourseQuery["category"], statuses: statuses as AdminCourseQuery["statuses"], delivery: delivery as AdminCourseQuery["delivery"], sort: sort as AdminCourseQuery["sort"], direction: direction as AdminCourseQuery["direction"], page: readAdminPage(params.get("page")) };
}
