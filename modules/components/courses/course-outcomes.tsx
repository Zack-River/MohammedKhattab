import type { ContentBindings } from "@platform/types/content";
import Symbol from "@platform/components/ui/symbol";
export default function CourseOutcomes({
  copy,
  course,
}: {
  copy: Pick<ContentBindings["copy"], "outcome">;
  course: Pick<import("@platform/types/lms").Course, "outcomes">;
}) {
  return (
    <div className="lms-outcomes">
      <h2>{copy.outcome}</h2>
      <ul>
        {course.outcomes.map((item) => (
          <li key={item}>
            <Symbol name="check" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
