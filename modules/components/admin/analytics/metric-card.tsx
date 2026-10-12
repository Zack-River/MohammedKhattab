import { formatAnalyticsNumber } from "@platform/features/admin/analytics/helpers/format";
import type { AnalyticsLabels } from "@platform/types/admin-analytics";
import MetricChange from "./metric-change";
export default function MetricCard({ title, value, previous, note, labels, suffix }: {
  labels: AnalyticsLabels; title: string; value: number | null; previous?: number; note?: string; suffix?: string;
}) {
  return <article className="analytics-metric" aria-label={title} data-reveal>
    <h2>{title}</h2><strong className="analytics-value numeral">{value === null ? "—" : formatAnalyticsNumber(value)}{value !== null && suffix && ` ${suffix}`}</strong>
    {value !== null && previous !== undefined && <MetricChange labels={labels} current={value} previous={previous} />}
    {value === null && <span className="analytics-unavailable">{labels.unavailable}</span>}
    {note && <p>{note}</p>}
  </article>;
}
