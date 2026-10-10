import type { ContentBindings } from "@platform/types/content";
import CourseCard from "./course-card";
import RevealContent from "@platform/components/marketing/reveal-content";
import type { Course } from "@platform/types/lms";
export default function CourseGrid({
  courses,
  progress = {},
  layout = "public",
  motion = true,
  copy,
  site,
  offerCopy,
}: {
  courses: Course[];
  progress?: Record<
    string,
    import("@platform/features/learning/helpers").CourseProgress
  >;
  layout?: "public" | "dashboard";
  motion?: boolean;
} & {
  copy: Pick<ContentBindings["copy"], "lessons" | "continue" | "progress">;
  site: Pick<ContentBindings["site"], "englishName">;
  offerCopy: Pick<ContentBindings["offerCopy"], "price">;
}) {
  return (
    <RevealContent
      as="div"
      className={`lms-course-grid${layout === "dashboard" ? " lms-dashboard-grid" : ""}`}
      scope="cards"
      motion={motion}
    >
      {courses.map((course) => (
        <div className="lms-card-entrance" data-reveal key={course.slug}>
          <CourseCard
            copy={{
              lessons: copy.lessons,
              continue: copy.continue,
              progress: copy.progress,
            }}
            site={{ englishName: site.englishName }}
            offerCopy={{ price: offerCopy.price }}
            course={course}
            progress={progress[course.slug]}
          />
        </div>
      ))}
    </RevealContent>
  );
}
