import Symbol from "@platform/components/ui/symbol";
export default function DashboardStats({
  stats,
}: {
  stats: ReturnType<
    typeof import("@platform/features/learning/helpers/dashboard-stats").dashboardStats
  >;
}) {
  return (
    <div className="lms-stat-grid">
      {stats.map((stat) => (
        <div key={stat.label} className="lms-stat-card">
          <Symbol name={stat.symbol} />
          <div>
            <b className="numeral">{String(stat.value).padStart(2, "0")}</b>
            <span>{stat.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
