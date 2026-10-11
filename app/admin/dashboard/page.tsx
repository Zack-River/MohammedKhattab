import { analyticsCopy } from "@platform/data/admin-analytics";
import AnalyticsOverview from "@platform/components/admin/analytics/overview";
import { requireAdminPage } from "@platform/features/admin/page-identity";
import { readAdminAnalytics } from "@platform/features/admin/analytics/repositories/read-analytics";
import { readAnalyticsPeriod } from "@platform/features/admin/analytics/helpers/read-period";
export default async function AdminHomePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdminPage();
  const period = readAnalyticsPeriod((await searchParams).period);
  return <AnalyticsOverview labels={analyticsCopy} data={await readAdminAnalytics()} period={period} />;
}
