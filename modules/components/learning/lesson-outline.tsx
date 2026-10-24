import { numbered } from "@platform/features/catalog/helpers/numbered";
import type { ContentBindings } from "@platform/types/content";
import Link from "next/link";
import Symbol from "@platform/components/ui/symbol";
import ProgressBar from "@platform/components/ui/progress-bar";
import type { LessonOutlineModel } from "@platform/features/learning/helpers/lesson-outline";
export default function LessonOutline({
  model,
  lockedLabel,
  active,
  copy,
}: {
  model: LessonOutlineModel;
  lockedLabel: string;
  active: string;
} & {
  copy: Pick<
    ContentBindings["copy"],
    "preview" | "courseContent" | "completed" | "pending" | "progress" | "lessons"
  >;
}) {
  return (
    <aside className="lms-lesson-outline">
      <div className="lms-outline-heading">
        <span className="lms-small-label">{copy.courseContent}</span>
        <h2>{model.title}</h2>
        <ProgressBar
          copy={{ progress: copy.progress, lessons: copy.lessons }}
          {...model.progress}
        />
      </div>
      <nav aria-label={copy.courseContent}>
        {model.modules.map((module, index) => (
          <div key={module.id} className="lms-outline-module">
            <h3>
              <span className="numeral">
                {numbered(index)}
              </span>
              {module.title}
            </h3>
            {module.groups.map(group => <div key={group.id}>
            {group.title && <h4 className="lms-outline-section-title">{group.title}</h4>}
            {group.lessons.map((lesson) => {
              const complete = lesson.complete;
              return (
                <Link
                  href={lesson.href}
                  key={lesson.id}
                  className={active === lesson.id ? "is-active" : ""}
                  aria-current={active === lesson.id ? "page" : undefined}
                >
                  <span
                    className={`lms-outline-check ${complete ? "is-complete" : lesson.unreleased ? "is-unreleased" : ""}`}
                  >
                    <Symbol name={lesson.locked ? "lock" : complete ? "check" : lesson.unreleased ? "clock" : "play"} />
                  </span>
                  <span>
                    {lesson.title}
                    <small className="numeral">
                      {lesson.duration} ·{" "}
                      {lesson.locked ? lockedLabel : complete ? copy.completed : lesson.unreleased ? "قريبًا" : lesson.preview ? copy.preview : copy.pending}
                    </small>
                  </span>
                </Link>
              );
            })}</div>)}
          </div>
        ))}
      </nav>
    </aside>
  );
}
