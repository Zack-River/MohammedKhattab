import { analyticsCopy as labels } from "@platform/data/admin-analytics";
export default function Loading() {
  return <div className="analytics-loading" role="status" aria-busy="true"><p>{labels.loading}</p>
    <div className="analytics-metrics-grid">{[1, 2, 3, 4].map(key => <div className="analytics-skeleton" key={key} />)}</div>
    <div className="analytics-skeleton analytics-skeleton-chart" />
  </div>;
}
