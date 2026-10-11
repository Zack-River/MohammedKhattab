import Link from "next/link";
import type { AdminUserQuery, AdminUsersLabels } from "@platform/types/admin-users";
import { userQueryUrl } from "@platform/features/admin/helpers/user-query-url";
export default function AdminPagination({ query, hasNext, labels }: { query: AdminUserQuery; hasNext: boolean; labels: AdminUsersLabels }) {
  const page = query.page;
  return <nav className="lms-admin-pagination" aria-label={labels.users}>
    {page > 1 && <Link href={userQueryUrl(query, page - 1)} className="lms-secondary-button">{labels.previous}</Link>}
    <span>{labels.page} {page}</span>{hasNext && <Link href={userQueryUrl(query, page + 1)} className="lms-secondary-button">{labels.next}</Link>}
  </nav>;
}
