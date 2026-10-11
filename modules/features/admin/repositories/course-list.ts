import "server-only";
import { requireAdmin } from "../identity";
import { ApiError } from "@platform/lib/api/error";
import { courseAdministration } from "@platform/config/course-administration";
import { readCourseResults } from "../helpers/read-course-results";
import type { AdminCourseQuery } from "@platform/types/admin-courses";
export async function readCourseList(query: AdminCourseQuery) {
 const { client } = await requireAdmin();
 const { data, error } = await client.rpc("search_admin_courses", { p_search: query.search, p_category: query.category, p_statuses: query.statuses, p_delivery: query.delivery, p_sort: query.sort, p_direction: query.direction, p_page: query.page, p_limit: courseAdministration.pageSize });
 if (error) throw new ApiError(503,"INTERNAL_ERROR");
 return readCourseResults(data);
}
