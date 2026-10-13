import {completionPercent} from "@platform/helpers/completion-percent";
import type { ContentBindings } from "@platform/types/content";

export default function ProgressBar({
  percent,
  count,
  total,
  copy,
}: {
  percent: number;
  count: number;
  total: number;
} & { copy: Pick<ContentBindings["copy"], "progress" | "lessons"> }) {
  if (
    ![percent, count, total].every(Number.isFinite) ||
    !Number.isInteger(count) ||
    !Number.isInteger(total) ||
    percent !== completionPercent(count,total) ||
    total < 0 ||
    count < 0 ||
    count > total ||
    percent < 0 ||
    percent > 100
  )
    throw new Error("Invalid progress model");
  return (
    <div className="lms-progress">
      <div className="lms-progress-label">
        <span>{copy.progress}</span>
        <b className="numeral">{percent}%</b>
      </div>
      <progress max="100" value={percent} aria-label={copy.progress} />
      <small className="text-muted">
        {count} / {total} {copy.lessons}
      </small>
    </div>
  );
}
