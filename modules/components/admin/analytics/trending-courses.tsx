import Link from "next/link";
import AnalyticsPanel from "@khatab/design/ui/analytics-panel";
import type { AnalyticsPeriod, TrendingCourse } from "@platform/types/admin-analytics";
import { routes } from "@platform/config/navigation";
import { analyticsConfig } from "@platform/config/admin-analytics";
import type { AnalyticsLabels } from "@platform/types/admin-analytics";
import { formatAnalyticsNumber } from "@platform/features/admin/analytics/helpers/format";
import MetricChange from "./metric-change";
export default function TrendingCourses({ courses, period, labels }: { courses: TrendingCourse[]; period: AnalyticsPeriod; labels: AnalyticsLabels }) {
  return <AnalyticsPanel title={labels.trendTitle} description={labels.trendDescription} source={labels.courseSource} sourceLabel={labels.source}>
    <nav className="analytics-periods" aria-label={labels.periodLabel}>{analyticsConfig.periods.map(value =>
      <Link key={value} href={`${routes.adminDashboard}?period=${value}`} aria-current={period === value ? "page" : undefined}>{labels[value]}</Link>)}</nav>
    {courses.length === 0 ? <p className="analytics-empty-note">{labels.trendEmpty}</p> : <ol className="analytics-course-ranking">
      {courses.map((course, index) => <li key={course.slug}>
        <span className="analytics-rank numeral" aria-hidden="true">{index + 1}</span>
        <div><Link href={routes.adminCourse(course.slug)}>{course.title}</Link>{!course.published && <small>{labels.draft}</small>}
          <div className="analytics-rank-bar" aria-hidden="true"><progress value={course.count} max={courses[0].count} /></div>
          {period !== "all" && <MetricChange labels={labels} current={course.count} previous={course.previous} />}</div>
        <strong className="numeral">{formatAnalyticsNumber(course.count)}<small>{labels.subscriptions}</small></strong>
      </li>)}
    </ol>}
  </AnalyticsPanel>;
}
