import { routes } from "@platform/config/navigation";
import { site } from "@platform/data/site";
import { offerCopy } from "@platform/data/offers";
import { interfaceCopy } from "@platform/data/interface-copy";
import PageHeading from "@platform/components/ui/page-heading";
import EmptyState from "@platform/components/ui/empty-state";
import CourseGrid from "@platform/components/courses/course-grid";
import { listCourses } from "@platform/features/catalog";
import { readLearningState, courseProgress } from "@platform/features/learning";
import { copy } from "@platform/data/site";
export const metadata = { title: interfaceCopy.libraryPageTitle };
export default async function MyCourses() {
  const state = await readLearningState();
  const courses = await listCourses();
  const enrolled = courses.filter((course) =>
    state.enrolled.includes(course.slug),
  );
  return (
    <>
      <PageHeading
        title={interfaceCopy.libraryTitle}
        description={interfaceCopy.libraryDescription}
      />
      {enrolled.length ? (
        <CourseGrid
          courses={enrolled}
          layout="dashboard"
          progress={Object.fromEntries(
            enrolled.map((course) => [
              course.slug,
              courseProgress(course, state),
            ]),
          )}
          copy={{
            lessons: copy.lessons,
            continue: copy.continue,
            progress: copy.progress,
          }}
          site={{ englishName: site.englishName }}
          offerCopy={{ price: offerCopy.price }}
        />
      ) : (
        <EmptyState
          title={copy.emptyCourses}
          description={copy.coursesDescription}
          href={routes.courses}
          label={copy.browse}
        />
      )}
    </>
  );
}
