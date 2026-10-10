import { numbered } from "@platform/features/catalog/helpers/numbered";
import type { ContentBindings } from "@platform/types/content";
import Link from "next/link";
import Symbol from "@platform/components/ui/symbol";
import ProgressBar from "@platform/components/ui/progress-bar";
import type { LessonOutlineModel } from "@platform/features/learning/helpers/lesson-outline";
export default function LessonOutline({
  model,
  active,
  copy,
}: {
  model: LessonOutlineModel;
  active: string;
} & {
  copy: Pick<
    ContentBindings["copy"],
    "courseContent" | "completed" | "pending" | "progress" | "lessons"
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
          <div key={module.title} className="lms-outline-module">
            <h3>
              <span className="numeral">
                {numbered(index)}
              </span>
              {module.title}
            </h3>
            {module.lessons.map((lesson) => {
              const complete = lesson.complete;
              return (
                <Link
                  href={lesson.href}
                  key={lesson.id}
                  className={active === lesson.id ? "is-active" : ""}
                  aria-current={active === lesson.id ? "page" : undefined}
                >
                  <span
                    className={`lms-outline-check ${complete ? "is-complete" : ""}`}
                  >
                    <Symbol name={complete ? "check" : "play"} />
                  </span>
                  <span>
                    {lesson.title}
                    <small className="numeral">
                      {lesson.duration} ·{" "}
                      {complete ? copy.completed : copy.pending}
                    </small>
                  </span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
