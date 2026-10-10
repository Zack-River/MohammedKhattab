import EnrollmentPanel from "@platform/components/courses/enrollment-panel";
import CourseOutcomes from "@platform/components/courses/course-outcomes";
import { routes } from "@platform/config/navigation";
import { site } from "@platform/data/site";
import { offerCopy } from "@platform/data/offers";
import { interfaceCopy } from "@platform/data/interface-copy";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findCourse, courseLessons } from "@platform/features/catalog";
import { readLearningState, courseProgress } from "@platform/features/learning";
import Curriculum from "@platform/components/courses/curriculum";
import CourseOverview from "@platform/components/courses/course-overview";
import { copy } from "@platform/data/site";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return {
    title: (await findCourse(slug))?.title ?? interfaceCopy.courseNotFound,
  };
}
export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await findCourse(slug);
  if (!course) notFound();
  const state = await readLearningState();
  const progress = courseProgress(course, state);
  return (
    <main className="container lms-public-main">
      <div className="lms-breadcrumb">
        <Link href={routes.courses}>{interfaceCopy.courseBreadcrumb}</Link>
        <span>/</span>
        <span>{course.categoryLabel}</span>
      </div>
      <div className="lms-course-detail">
        <CourseOverview
          course={course}
          instructorName={interfaceCopy.instructorName}
          lessonCount={courseLessons(course).length}
          lessonsLabel={copy.lessons}
        >
          <CourseOutcomes copy={{ outcome: copy.outcome }} course={course} />
          <div className="lms-content-heading">
            <h2>{copy.courseContent}</h2>
            <p>{copy.curriculumIntro}</p>
          </div>
          <Curriculum
            copy={{ lessons: copy.lessons, preview: copy.preview }}
            course={course}
          />
        </CourseOverview>
        <EnrollmentPanel
          site={{ englishName: site.englishName }}
          offerCopy={{ price: offerCopy.price }}
          interfaceCopy={{
            courseNotesBenefit: interfaceCopy.courseNotesBenefit,
            courseProgressBenefit: interfaceCopy.courseProgressBenefit,
          }}
          copy={{
            artworkLessonLabel: copy.artworkLessonLabel,
            demoVideo: copy.demoVideo,
            error: copy.error,
            saving: copy.saving,
            continue: copy.continue,
            enrollLabel: copy.enrollLabel,
          }}
          course={course}
          slug={slug}
          progress={progress}
          enrolled={state.enrolled.includes(slug)}
        />
      </div>
    </main>
  );
}
