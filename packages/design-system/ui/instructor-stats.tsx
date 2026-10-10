import type { StatData } from "../types/marketing";

export default function InstructorStats({
  items,
}: {
  items: readonly StatData[];
}) {
  return (
    <div className="instructor-stats-row">
      {items.map((stat, index) => (
        <div className="inst-stat-item" key={index}>
          <span
            className="inst-stat-num numeral"
            data-target={stat.target}
            data-prefix={stat.prefix}
            data-suffix={stat.suffix}
          >
            {stat.value}
          </span>
          <span className="inst-stat-lbl">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
