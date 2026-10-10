import type { RoadmapDayData, RoadmapStatus } from "@khatab/design/types/workshop";

export default function RoadmapDay({
  day,
  status,
}: {
  day: RoadmapDayData;
  status: RoadmapStatus;
}) {
  const classes = [
    "timeline-item day-item",
    day.kind !== "lesson" && `day-item-${day.kind}`,
    status !== "pending" && `is-${status}`,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <article
      className={classes}
      aria-current={status === "active" ? "step" : undefined}
    >
      <div className="timeline-marker day-number-col">
        <div className="day-badge-num">
          <span className="day-badge-digit">{day.number}</span>
          <span className="day-badge-text">{day.label}</span>
        </div>
      </div>
      <div className="timeline-content day-card">
        <div className="day-card-header">
          <h3 className="day-card-title">{day.title}</h3>
          <span className="day-card-type-tag">{day.type}</span>
        </div>
        {day.kind === "pause" ? (
          <div className="day-pause-banner">
            <h4>{day.pauseHeading}</h4>
            <p>{day.pauseDescription}</p>
          </div>
        ) : (
          <ul className="day-lessons-list">
            {day.lessons.map((lesson) => (
              <li key={lesson}>{lesson}</li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
