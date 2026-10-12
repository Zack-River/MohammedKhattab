import RefreshButton from "@khatab/design/ui/refresh-button";
import type { AdminAnalytics, AnalyticsPeriod } from "@platform/types/admin-analytics";
import type { AnalyticsLabels } from "@platform/types/admin-analytics";
import { formatAnalyticsDate } from "@platform/features/admin/analytics/helpers/format";
import PageHeading from "@platform/components/ui/page-heading";
import MetricCard from "./metric-card";
import SignupChart from "./signup-chart";
import TrendingCourses from "./trending-courses";
import AcquisitionSources from "./acquisition-sources";
import LearningSummary from "./learning-summary";
export default function AnalyticsOverview({ data, period, labels }: { data: AdminAnalytics; period: AnalyticsPeriod; labels: AnalyticsLabels }) {
  const m = data.metrics;
  return <div className="analytics-overview">
    <header className="analytics-overview-header"><PageHeading title={labels.title} description={labels.description} />
      <div><p>{labels.refreshed}: <time dateTime={data.generatedAt}>{formatAnalyticsDate(data.generatedAt, { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</time> · {labels.timezone}</p>
        <RefreshButton label={labels.refresh} pendingLabel={labels.loading} className="lms-secondary-button" /></div></header>
    <div className="analytics-metrics-grid">
      <MetricCard labels={labels} title={labels.studentsWeek} value={m.studentsWeek} previous={m.studentsPreviousWeek} />
      <MetricCard labels={labels} title={labels.enrollmentsWeek} value={m.enrollmentsWeek} previous={m.enrollmentsPreviousWeek} />
      <MetricCard labels={labels} title={labels.totalStudents} value={m.totalStudents} />
      <MetricCard labels={labels} title={labels.publishedCourses} value={m.publishedCourses} />
    </div>
    <div className="analytics-primary-grid"><SignupChart labels={labels} daily={data.daily} metrics={m} /><TrendingCourses labels={labels} courses={data.courses[period]} period={period} /></div>
    <div className="analytics-secondary-grid"><AcquisitionSources labels={labels} sources={data.sources} /><LearningSummary labels={labels} metrics={m} /></div>
    <div className="analytics-revenue-grid">
      <MetricCard labels={labels} title={labels.revenueWeek} value={data.revenue ? data.revenue.week/100 : null} previous={data.revenue ? data.revenue.previousWeek/100 : undefined} suffix={labels.currency} />
      <MetricCard labels={labels} title={labels.revenueMonth} value={data.revenue ? data.revenue.month/100 : null} previous={data.revenue ? data.revenue.previousMonth/100 : undefined} suffix={labels.currency} />
    </div>
    <details className="analytics-definitions"><summary>{labels.definitions}</summary><p>{labels.periodNote}</p><p>{labels.definitionsText}</p></details>
  </div>;
}
