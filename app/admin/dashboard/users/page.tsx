import { userQueryUrl } from "@platform/features/admin/helpers/user-query-url";
import { searchParams as toParams } from "@platform/helpers/search-params";
import PageHeading from "@platform/components/ui/page-heading";
import UsersTable from "@platform/components/admin/users-table";
import AdminPagination from "@platform/components/admin/admin-pagination";
import UserFilters from "@platform/components/admin/user-filters";
import { readAdminUsers } from "@platform/features/admin/repositories/users";
import { requireAdminPage } from "@platform/features/admin/page-identity";
import { readUserQuery } from "@platform/features/admin/helpers/read-user-query";
import { adminUsersCopy as labels } from "@platform/data/admin-users";
export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdminPage();
  const query = readUserQuery(toParams(await searchParams)), records = await readAdminUsers(query);
  return <><PageHeading title={labels.heading} />
    <UserFilters query={query} total={records.total} labels={labels} /><UsersTable labels={labels} users={records.users} />
    <AdminPagination page={query.page} previousHref={query.page > 1 ? userQueryUrl(query,query.page-1) : undefined} nextHref={records.hasNext ? userQueryUrl(query,query.page+1) : undefined} labels={{ ...labels, heading: labels.users }} />
  </>;
}
