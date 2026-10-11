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
    <p className="analytics-period-note">{labels.periodNote}</p>
    <div className="analytics-metrics-grid">
      <MetricCard labels={labels} title={labels.studentsWeek} value={m.studentsWeek} previous={m.studentsPreviousWeek} note={labels.comparison} source={labels.studentsSource} />
      <MetricCard labels={labels} title={labels.enrollmentsWeek} value={m.enrollmentsWeek} previous={m.enrollmentsPreviousWeek} note={labels.recordedSubscriptions} source={labels.enrollmentsSource} />
      <MetricCard labels={labels} title={labels.totalStudents} value={m.totalStudents} note={labels.studentsOnly} source={labels.studentsSource} />
      <MetricCard labels={labels} title={labels.publishedCourses} value={m.publishedCourses} note={labels.availableCourses} source={labels.courseSource} />
    </div>
    <div className="analytics-primary-grid"><SignupChart labels={labels} daily={data.daily} /><TrendingCourses labels={labels} courses={data.courses[period]} period={period} /></div>
    <div className="analytics-secondary-grid"><AcquisitionSources labels={labels} sources={data.sources} /><LearningSummary labels={labels} metrics={m} /></div>
    <div className="analytics-revenue-grid">
      <MetricCard labels={labels} title={labels.revenueWeek} value={null} note={labels.revenueNote} source={labels.paymentSource} />
      <MetricCard labels={labels} title={labels.revenueMonth} value={null} note={labels.revenueNote} source={labels.paymentSource} />
    </div>
    <details className="analytics-definitions"><summary>{labels.definitions}</summary><p>{labels.definitionsText}</p></details>
  </div>;
}
