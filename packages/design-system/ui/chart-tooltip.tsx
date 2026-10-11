import type { TimeSeriesPoint, TimeSeriesLabels } from "../types/charts";
export default function ChartTooltip({ active, payload, labels }: {
  active?: boolean; payload?: readonly { payload: TimeSeriesPoint }[]; labels: TimeSeriesLabels;
}) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;
  return <div className="analytics-tooltip" dir="rtl">
    <strong>{point.label}</strong>
    <dl><div><dt>{labels.current}</dt><dd>{point.current} {labels.value}</dd></div>
      <div><dt>{labels.previous}</dt><dd>{point.previous ?? "—"}</dd></div></dl>
  </div>;
}
