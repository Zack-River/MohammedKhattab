import SaleRow from "./sale-row";
import type { SaleRecord, SalesLabels } from "@platform/types/sales";
export default function SalesTable({ records, labels, showCustomer = true, receiptLabel }: {
  records: SaleRecord[]; labels: SalesLabels; showCustomer?: boolean; receiptLabel?: string;
}) {
  const headings = [labels.product, ...(showCustomer ? [labels.customer] : []), labels.amount, labels.status, labels.date];
  return <div className="lms-admin-table-wrap" data-reveal="true" data-reveal-motion="fade">
    <table className="lms-admin-table lms-commerce-table">
      <caption className="lms-visually-hidden">{labels.heading}</caption>
      <thead><tr>{headings.map(label => <th key={label} scope="col">{label}</th>)}</tr></thead>
      <tbody>{records.map(record => <SaleRow key={record.id} {...{ record, labels, showCustomer, receiptLabel }} />)}</tbody>
    </table>
    {!records.length && <p className="lms-admin-empty">{labels.empty}</p>}
  </div>;
}
