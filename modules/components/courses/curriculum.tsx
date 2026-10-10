import { numbered } from "@platform/features/catalog/helpers/numbered";
import { routes } from "@platform/config/navigation";
import type { ContentBindings } from "@platform/types/content";
import Link from "next/link";
import Symbol from "@platform/components/ui/symbol";
import type { Course } from "@platform/types/lms";
export default function Curriculum({
  course,
  copy,
}: { course: Course } & {
  copy: Pick<ContentBindings["copy"], "lessons" | "preview">;
}) {
  return (
    <div className="lms-curriculum">
      {course.modules.map((module, index) => (
        <details key={module.title} open={index === 0}>
          <summary>
            <span className="numeral">
              {numbered(index)}
            </span>
            <b>{module.title}</b>
            <small>
              {module.lessons.length} {copy.lessons}
            </small>
          </summary>
          <ul>
            {module.lessons.map((lesson) => (
              <li key={lesson.id}>
                <Symbol name="play" />
                <span>{lesson.title}</span>
                {lesson.preview && (
                  <Link
                    className="lms-preview-link"
                    href={routes.lesson(course.slug, lesson.id)}
                  >
                    {copy.preview}
                  </Link>
                )}
                <time className="numeral">{lesson.duration}</time>
              </li>
            ))}
          </ul>
        </details>
      ))}
    </div>
  );
}
