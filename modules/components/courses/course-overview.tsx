import Symbol from "@platform/components/ui/symbol";
import type { Course } from "@platform/types/lms";
export default function CourseOverview({
  course,
  instructorName,
  lessonCount,
  lessonsLabel,
  children,
}: {
  course: Pick<Course, "categoryLabel" | "title" | "description" | "duration">;
  instructorName: string;
  lessonCount: number;
  lessonsLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="lms-heading-context">{course.categoryLabel}</p>
      <h1 className="lms-course-title">{course.title}</h1>
      <p className="body-large">{course.description}</p>
      <div className="lms-detail-meta">
        <span>
          <Symbol name="user" />
          {instructorName}
        </span>
        <span>
          <Symbol name="book" />
          {lessonCount} {lessonsLabel}
        </span>
        <span>
          <Symbol name="clock" />
          {course.duration}
        </span>
      </div>
      {children}
    </div>
  );
}
