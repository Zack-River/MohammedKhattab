import Link from "next/link";
import { routes } from "@platform/config/navigation";
import { formatCourseDate } from "@platform/helpers/format-course-date";
import type { SaleRecord,SalesLabels } from "@platform/types/sales";
export default function SalesTable({records,labels}:{records:SaleRecord[];labels:SalesLabels}) {
 return <div className="lms-admin-table-wrap" data-reveal="true"><table className="lms-admin-table lms-commerce-table"><caption className="lms-visually-hidden">{labels.heading}</caption><thead><tr>{[labels.product,labels.customer,labels.amount,labels.status,labels.date].map(label=><th key={label} scope="col">{label}</th>)}</tr></thead>
 <tbody>{records.map(record=><tr key={record.id}><th scope="row">{record.title}<small>{record.live ? labels.live : labels.test}</small></th><td data-label={labels.customer}>{record.username ? <Link href={routes.adminUser(record.username)} className="lms-course-text-link">{record.name}</Link> : labels.noCustomer}</td><td data-label={labels.amount}><bdi className="numeral">{record.amountMinor/100} {labels.currency}</bdi>{record.discountMinor>0 && <small>{labels.discount}: {record.discountMinor/100} {labels.currency}{record.couponCode && <bdi> · {record.couponCode}</bdi>}</small>}</td><td data-label={labels.status}>{labels.states[record.status]}</td><td data-label={labels.date}><time dateTime={record.createdAt}>{formatCourseDate(record.createdAt,labels.empty)}</time></td></tr>)}</tbody></table>{!records.length && <p className="lms-admin-empty">{labels.empty}</p>}</div>;
}
