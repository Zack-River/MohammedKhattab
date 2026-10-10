import { validateArtworkKind } from "./artwork/helpers/validate-kind";
import CourseIllustration from "./artwork/illustration";
import { courseLessons } from "@platform/features/catalog/helpers";
import type { ContentBindings } from "@platform/types/content";

import type { Course } from "@platform/types/lms";
export default function CourseArtwork({
  course,
  large = false,
  showLabels = true,
  site,
  lessonLabel,
}: {
  course: Pick<Course,"modules"|"artwork"|"tool"|"categoryLabel">;
  large?: boolean;
} & (
  | { showLabels: false; lessonLabel?: never }
  | { showLabels?: true; lessonLabel: string }
) & { site: Pick<ContentBindings["site"], "englishName"> }) {
  const kind = course.artwork;
  validateArtworkKind(kind);
  return (
    <div
      className={`lms-course-art lms-art-${kind} ${large ? "lms-art-large" : ""}`}
      aria-hidden="true"
    >
      {showLabels && (
        <div className="lms-art-top">
          <span className="lms-art-logo">{site.englishName.toUpperCase()}</span>
          <span>{course.tool}</span>
        </div>
      )}
      <svg viewBox="0 0 560 260" fill="none">
        <path
          d="M0 52h560M0 104h560M0 156h560M0 208h560M80 0v260M160 0v260M240 0v260M320 0v260M400 0v260M480 0v260"
          stroke="var(--border-hairline)"
        />
        <CourseIllustration kind={kind} />
      </svg>
      {showLabels && (
        <div className="lms-art-bottom">
          <span>{course.categoryLabel}</span>
          <span className="numeral">
            {courseLessons(course).length} {lessonLabel}
          </span>
        </div>
      )}
    </div>
  );
}
