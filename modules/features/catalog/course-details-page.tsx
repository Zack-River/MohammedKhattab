import { readLiveSchedule } from "@platform/features/live-sessions/repositories/schedule";
import LiveSchedule from "@platform/components/live-sessions/schedule";
import { liveSessionCopy } from "@platform/data/live-sessions";
import { courseLessons } from "@platform/features/catalog/helpers/course-lessons";
import { readLearningState, courseProgress } from "@platform/features/learning";
import { courseDetailsCopy } from "@platform/data/course-details";
import { copy, instructor, site } from "@platform/data/site";
import { offerCopy } from "@platform/data/offers";
import { interfaceCopy } from "@platform/data/interface-copy";
import { routes } from "@platform/config/navigation";
import type { Course } from "@platform/types/lms";
import CourseDetails from "@platform/components/courses/course-details";
import { creatorContacts } from "@/config/creator-contacts";
export default async function CourseDetailsPage({ course }: { course: Course }) {
  const [state,schedule] = await Promise.all([readLearningState(),readLiveSchedule([course.slug])]);
  const nextLesson = courseProgress(course,state).next?.id ?? courseLessons(course)[0]?.id;
  return <><CourseDetails course={course} enrolled={state.enrolled.includes(course.slug)} nextLesson={nextLesson}
    labels={courseDetailsCopy} copy={{error:copy.error,saving:copy.saving,continue:copy.continue,enrollLabel:copy.enrollLabel,outcome:copy.outcome}} site={{englishName:site.englishName}} priceLabel={offerCopy.price} breadcrumbLabel={interfaceCopy.courseBreadcrumb}
    instructor={{ name: instructor.name, tagline: instructor.tagline, image: instructor.image, href: routes.portfolio }} supportHref={creatorContacts.whatsapp} />
    {schedule.sessions.length>0 && <div className="container"><LiveSchedule initial={schedule} slug={course.slug} joinAllowed={state.enrolled.includes(course.slug)} labels={liveSessionCopy} /></div>}</>;
}
