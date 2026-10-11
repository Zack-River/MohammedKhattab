import { courseQueryUrl } from "@platform/features/admin/helpers/course-query-url";
import { searchParams as toParams } from "@platform/helpers/search-params";
import Link from "next/link";
import { readCourseList } from "@platform/features/admin/repositories/course-list";
import { readCourseQuery } from "@platform/features/admin/helpers/read-course-query";
import { routes } from "@platform/config/navigation";
import { adminCoursesCopy as labels } from "@platform/data/admin-courses";
import { categories } from "@platform/config/catalog";
import PageHeading from "@platform/components/ui/page-heading";
import CourseFilters from "@platform/components/admin/course-filters";
import CourseTable from "@platform/components/admin/course-table";
import AdminPagination from "@platform/components/admin/admin-pagination";
import { requireAdminPage } from "@platform/features/admin/page-identity";
export default async function AdminCoursesPage({ searchParams }: { searchParams: Promise<Record<string,string|string[]|undefined>> }) {
 await requireAdminPage();
 const query = readCourseQuery(toParams(await searchParams)), records = await readCourseList(query);
 return <><PageHeading title={labels.heading} actionsFirst><Link href={routes.adminCourseCreate} className="btn-primary">{labels.create}</Link></PageHeading>
  <CourseFilters query={query} total={records.total} labels={labels} categories={categories} /><CourseTable courses={records.courses} labels={labels} />
  <AdminPagination page={query.page} previousHref={query.page > 1 ? courseQueryUrl(query,query.page-1) : undefined} nextHref={records.hasNext ? courseQueryUrl(query,query.page+1) : undefined} labels={{ ...labels, heading: labels.heading }} />
 </>;
}
