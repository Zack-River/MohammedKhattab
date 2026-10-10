import type { ContentBindings } from "@platform/types/content";
import Symbol from "@platform/components/ui/symbol";
export default function LessonTitle({
  interfaceCopy,
  lesson,
  index,
  lessons,
}: {
  interfaceCopy: Pick<
    ContentBindings["interfaceCopy"],
    "lessonCounterLabel" | "lessonCounterSeparator"
  >;
  lesson: import("@platform/types/lms").Lesson;
  index: number;
  lessons: import("@platform/types/lms").Lesson[];
}) {
  return (
    <div className="lms-lesson-title">
      <div>
        <span className="lms-small-label">
          {interfaceCopy.lessonCounterLabel}
          {index + 1} {interfaceCopy.lessonCounterSeparator}
          {lessons.length}
        </span>
        <h1>{lesson.title}</h1>
      </div>
      <span className="lms-lesson-duration numeral">
        <Symbol name="clock" />
        {lesson.duration}
      </span>
    </div>
  );
}
