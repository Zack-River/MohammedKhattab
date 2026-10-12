import { sectionIds } from "@platform/config/navigation";
import type { ContentBindings } from "@platform/types/content";
import { courseLessons } from "@platform/features/catalog/helpers";
import CourseArtwork from "@platform/components/courses/course-artwork";
import CoursePrice from "@platform/components/courses/course-price";
import EnrollButton from "@platform/components/courses/enroll-button";
import Symbol from "@platform/components/ui/symbol";
export default function EnrollmentPanel({
  site,
  offerCopy,
  interfaceCopy,
  copy,
  course,
  slug,
  progress,
  enrolled,
}: {
  site: Pick<ContentBindings["site"], "englishName">;
  offerCopy: Pick<ContentBindings["offerCopy"], "price">;
  interfaceCopy: Pick<
    ContentBindings["interfaceCopy"],
    "courseNotesBenefit" | "courseProgressBenefit"
  >;
  copy: Pick<
    ContentBindings["copy"],
    | "artworkLessonLabel"
    | "demoVideo"
    | "error"
    | "saving"
    | "continue"
    | "enrollLabel"
  >;
  course: import("@platform/types/lms").Course;
  slug: string;
  progress: import("@platform/features/learning/helpers").CourseProgress;
  enrolled: boolean;
}) {
  return (
    <aside className="lms-enrollment-card" id={sectionIds.enrollment}>
      <CourseArtwork
        lessonLabel={copy.artworkLessonLabel}
        site={{ englishName: site.englishName }}
        course={course}
        large
      />
      <div className="lms-enrollment-body">
        <CoursePrice
          offerCopy={{ price: offerCopy.price }}
          offer={course.offer}
        />
        <EnrollButton
          copy={{
            error: copy.error,
            saving: copy.saving,
            continue: copy.continue,
            enrollLabel: copy.enrollLabel,
          }}
          slug={slug}
          firstLesson={progress.next?.id ?? courseLessons(course)[0]?.id}
          enrolled={enrolled}
          paid={course.offer.amount > 0}
        />
        <ul>
          {[
            course.level,
            course.tool,
            interfaceCopy.courseNotesBenefit,
            interfaceCopy.courseProgressBenefit,
          ].map((item) => (
            <li key={item}>
              <Symbol name="check" />
              {item}
            </li>
          ))}
        </ul>
        <p className="lms-demo-note">{copy.demoVideo}</p>
      </div>
    </aside>
  );
}
