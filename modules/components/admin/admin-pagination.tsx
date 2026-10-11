import Link from "next/link";
export default function AdminPagination({ page, previousHref, nextHref, labels }: {
  page: number; previousHref?: string; nextHref?: string;
  labels: { heading: string; previous: string; next: string; page: string };
}) {
  return <nav className="lms-admin-pagination" aria-label={labels.heading}>
    {previousHref && <Link href={previousHref} className="lms-secondary-button">{labels.previous}</Link>}
    <span>{labels.page} {page}</span>
    {nextHref && <Link href={nextHref} className="lms-secondary-button">{labels.next}</Link>}
  </nav>;
}
