import { requirePageIdentity } from "@platform/features/auth/server/page-identity";
import { readStudentOrders } from "@platform/features/commerce/repositories/student-orders";
import { readCommerceQuery } from "@platform/features/commerce/helpers/read-commerce-query";
import { purchasesCopy as labels } from "@platform/data/purchases";
import SalesTable from "@platform/components/commerce/sales-table";
import SalesFilters from "@platform/components/commerce/sales-filters";
import AdminPagination from "@platform/components/admin/admin-pagination";
import PageHeading from "@platform/components/ui/page-heading";
import { routes } from "@platform/config/navigation";
import { commercePolicy } from "@platform/config/commerce";
export const metadata = { title: labels.heading };
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requirePageIdentity();
  const { search, status, page } = readCommerceQuery(await searchParams, labels.states);
  const result = await readStudentOrders(search, status, page);
  const href = (page: number) => routes.purchases + "?" + new URLSearchParams({ q: search, status, page: String(page) });
  return <><PageHeading title={labels.heading} description={labels.description} />
    <SalesFilters {...{ labels, search, status }} action={routes.purchases} />
    <SalesTable records={result.records} labels={labels} showCustomer={false} receiptLabel={labels.receipt} />
    <AdminPagination page={page} previousHref={page > 1 ? href(page - 1) : undefined}
      nextHref={page * commercePolicy.pageSize < result.total ? href(page + 1) : undefined}
      labels={{ heading: labels.heading, page: "", previous: labels.previous, next: labels.next }} />
  </>;
}
