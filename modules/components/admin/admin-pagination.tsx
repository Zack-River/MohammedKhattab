import Link from "next/link";
import { routes } from "@platform/config/navigation";
import type { AdminUsersLabels } from "@platform/types/admin-users";
export default function AdminPagination({ page, hasNext, labels }: { page: number; hasNext: boolean; labels: AdminUsersLabels }) {
  return <nav className="lms-admin-pagination" aria-label={labels.users}>
    {page > 1 && <Link href={`${routes.adminUsers}?page=${page - 1}`} className="btn-secondary">{labels.previous}</Link>}
    <span>{page}</span>{hasNext && <Link href={`${routes.adminUsers}?page=${page + 1}`} className="btn-secondary">{labels.next}</Link>}
  </nav>;
}
