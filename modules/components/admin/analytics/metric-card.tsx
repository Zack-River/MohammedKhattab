import { formatAnalyticsNumber } from "@platform/features/admin/analytics/helpers/format";
import type { AnalyticsLabels } from "@platform/types/admin-analytics";
import MetricChange from "./metric-change";
export default function MetricCard({ title, value, previous, note, source, labels }: {
  labels: AnalyticsLabels; title: string; value: number | null; previous?: number; note: string; source: string;
}) {
  return <article className="analytics-metric" aria-label={title}>
    <h2>{title}</h2><strong className="analytics-value numeral">{value === null ? "—" : formatAnalyticsNumber(value)}</strong>
    {value !== null && previous !== undefined && <MetricChange labels={labels} current={value} previous={previous} />}
    {value === null && <span className="analytics-unavailable">{labels.unavailable}</span>}
    <p>{note}</p><small><span>{labels.source}: </span>{source}</small>
  </article>;
}
