import AnalyticsPanel from "@khatab/design/ui/analytics-panel";
import type { AnalyticsMetrics } from "@platform/types/admin-analytics";
import type { AnalyticsLabels } from "@platform/types/admin-analytics";
import { formatAnalyticsNumber } from "@platform/features/admin/analytics/helpers/format";
export default function LearningSummary({ metrics, labels }: { metrics: AnalyticsMetrics; labels: AnalyticsLabels }) {
  return <AnalyticsPanel title={labels.learningTitle} source={labels.learningSource} sourceLabel={labels.source}>
    <dl className="analytics-learning">{(["totalEnrollments", "studentsEnrolled", "completedLessons"] as const).map(key =>
      <div key={key}><dt>{key === "totalEnrollments" ? labels.totalSubscriptions : key === "studentsEnrolled" ? labels.enrolledStudents : labels.completedLessons}</dt>
        <dd className="numeral">{formatAnalyticsNumber(metrics[key])}</dd></div>)}</dl>
  </AnalyticsPanel>;
}
