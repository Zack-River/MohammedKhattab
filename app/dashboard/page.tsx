import { dashboardStats } from "@platform/features/learning/helpers/dashboard-stats";
import { selectCourses } from "@platform/features/catalog/helpers";
import { catalogSettings } from "@platform/data/catalog-settings";
import { routes } from "@platform/config/navigation";
import { site } from "@platform/data/site";
import { offerCopy } from "@platform/data/offers";
import { interfaceCopy } from "@platform/data/interface-copy";
import Link from "next/link";
import PageHeading from "@platform/components/ui/page-heading";
import EmptyState from "@platform/components/ui/empty-state";
import DashboardStats from "@platform/components/learning/dashboard-stats";
import ContinueCard from "@platform/components/learning/continue-card";
import CourseGrid from "@platform/components/courses/course-grid";
import { readStudentState, courseProgress } from "@platform/features/learning";
import { listCourses } from "@platform/features/catalog";
import { copy } from "@platform/data/site";
export const metadata = { title: interfaceCopy.dashboardLabel };
export default async function DashboardPage() {
  const state = await readStudentState();
  const courses = await listCourses();
  const enrolled = courses.filter((course) =>
    state.enrolled.includes(course.slug),
  );
  const active =
    enrolled.find((course) => courseProgress(course, state).percent < 100) ??
    enrolled[0];
  return (
    <>
      <PageHeading
        eyebrow={`${interfaceCopy.greeting} ${state.profile.name}`}
        title={copy.dashboardTitle}
        description={copy.dashboardDescription}
      />
      <DashboardStats stats={dashboardStats({ state, courses: enrolled, labels: copy })} />
      {active ? (
        <ContinueCard
          interfaceCopy={{ continueContext: interfaceCopy.continueContext }}
          copy={{
            artworkLessonLabel: copy.artworkLessonLabel,
            continue: copy.continue,
            progress: copy.progress,
            lessons: copy.lessons,
          }}
          site={{ englishName: site.englishName }}
          course={active}
          progress={courseProgress(active, state)}
        />
      ) : (
        <EmptyState
          title={copy.emptyCourses}
          description={copy.coursesDescription}
          href={routes.courses}
          label={copy.browse}
        />
      )}
      <div className="lms-section-top lms-dashboard-section">
        <h2>{copy.myCourses}</h2>
        <Link href={routes.library} className="lms-text-link">
          {interfaceCopy.libraryAction}
        </Link>
      </div>
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
      <div className="lms-section-top lms-dashboard-section">
        <h2>{copy.recommendations}</h2>
        <Link href={routes.courses} className="lms-text-link">
          {copy.allCourses}
        </Link>
      </div>
      <CourseGrid
        courses={selectCourses(courses, catalogSettings.recommendationIds)
          .filter((course) => !state.enrolled.includes(course.slug))
          .slice(0, catalogSettings.recommendationLimit)}
        layout="dashboard"
        copy={{
          lessons: copy.lessons,
          continue: copy.continue,
          progress: copy.progress,
        }}
        site={{ englishName: site.englishName }}
        offerCopy={{ price: offerCopy.price }}
      />
    </>
  );
}
