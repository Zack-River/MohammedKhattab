import Link from "next/link";
import { routes } from "@platform/config/navigation";
import { formatCourseDate } from "@platform/helpers/format-course-date";
import type { SaleRecord, SalesLabels } from "@platform/types/sales";
export default function SaleRow({ record, labels, showCustomer, receiptLabel }: {
  record: SaleRecord; labels: SalesLabels; showCustomer: boolean; receiptLabel?: string;
}) {
  return <tr>
    <th scope="row">{record.title}<small>{record.live ? labels.live : labels.test}</small></th>
    {showCustomer && <td data-label={labels.customer}>{record.username
      ? <Link href={routes.adminUser(record.username)} className="lms-course-text-link">{record.name}</Link>
      : labels.noCustomer}</td>}
    <td data-label={labels.amount}><bdi className="numeral">{record.amountMinor / 100} {labels.currency}</bdi>
      {record.discountMinor > 0 && <small>{labels.discount}: {record.discountMinor / 100} {labels.currency}
        {record.couponCode && <bdi> · {record.couponCode}</bdi>}</small>}</td>
    <td data-label={labels.status}>{labels.states[record.status]}
      {receiptLabel && <small><Link className="lms-course-text-link" href={routes.payment(record.id)}>{receiptLabel}</Link></small>}</td>
    <td data-label={labels.date}><time dateTime={record.createdAt}>{formatCourseDate(record.createdAt, labels.empty)}</time></td>
  </tr>;
}
