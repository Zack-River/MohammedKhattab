import PageHeading from "@platform/components/ui/page-heading";
import UsersTable from "@platform/components/admin/users-table";
import AdminPagination from "@platform/components/admin/admin-pagination";
import { readAdminUsers } from "@platform/features/admin/repositories/users";
import { requireAdminPage } from "@platform/features/admin/page-identity";
import { readAdminPage } from "@platform/features/admin/helpers/read-admin-page";
import { adminUsersCopy as labels } from "@platform/data/admin-users";
export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await requireAdminPage();
  const records = await readAdminUsers(readAdminPage((await searchParams).page));
  return <><PageHeading title={labels.heading} description={labels.description} />
    <UsersTable labels={labels} users={records.users} /><AdminPagination labels={labels} page={records.page} hasNext={records.hasNext} />
  </>;
}
