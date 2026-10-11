import AnalyticsPanel from "@khatab/design/ui/analytics-panel";
import type { AnalyticsSource } from "@platform/types/admin-analytics";
import type { AnalyticsLabels } from "@platform/types/admin-analytics";
import { formatAnalyticsNumber } from "@platform/features/admin/analytics/helpers/format";
export default function AcquisitionSources({ sources, labels }: { sources: AnalyticsSource[]; labels: AnalyticsLabels }) {
  const total = sources.reduce((sum, source) => sum + source.count, 0);
  const known = sources.some(source => source.source !== "unknown");
  return <AnalyticsPanel title={labels.sourcesTitle} description={labels.sourcesDescription} source={labels.attributionSource} sourceLabel={labels.source}>
    {!known && <p className="analytics-empty-note">{total ? labels.sourcesUnavailable : labels.sourcesEmpty}</p>}
    <ul className="analytics-sources-list">{sources.map(source => <li key={source.source}>
      <div><span>{labels.sourceNames[source.source]}</span><strong>{formatAnalyticsNumber(source.count)}</strong></div>
      <progress aria-label={labels.sourceNames[source.source]} value={source.count} max={total} />
      <small>{formatAnalyticsNumber(source.count / total * 100)}%</small>
    </li>)}</ul>
  </AnalyticsPanel>;
}
