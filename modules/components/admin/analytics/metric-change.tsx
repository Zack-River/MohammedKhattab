import { periodChange } from "@platform/features/admin/analytics/helpers/change";
import { formatAnalyticsNumber } from "@platform/features/admin/analytics/helpers/format";
import type { AnalyticsLabels } from "@platform/types/admin-analytics";
export default function MetricChange({ current, previous, labels }: { current: number; previous: number; labels: AnalyticsLabels }) {
  const change = periodChange(current, previous);
  const text = change.direction === "new" ? labels.new : change.direction === "flat" ? labels.unchanged :
    `${change.direction === "up" ? labels.growth : labels.decline} ${formatAnalyticsNumber(change.percent ?? 0)}%`;
  return <span className="analytics-change" data-direction={change.direction}
    title={change.percent === null && change.direction === "new" ? labels.noBaseline : labels.comparison}>
    <span aria-hidden="true">{change.direction === "up" || change.direction === "new" ? "↗" : change.direction === "down" ? "↘" : "—"}</span>{text}
  </span>;
}
