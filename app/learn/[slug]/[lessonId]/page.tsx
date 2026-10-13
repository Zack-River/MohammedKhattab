import Link from "next/link";
import CourseLiveSchedule from "@platform/features/live-sessions/course-schedule";
import { readLessonContext } from "@platform/features/learning/read-lesson-context";
import { lessonPlaybackModel } from "@platform/features/learning/models/lesson-playback";
import { lessonInformationModel } from "@platform/features/learning/models/lesson-information";
import { lessonShellModel } from "@platform/features/learning/models/lesson-shell";
import LessonInformation from "@platform/components/learning/lesson-information";
import LessonActions from "@platform/components/learning/lesson-actions";
import LessonTitle from "@platform/components/learning/lesson-title";
import LearningHeader from "@platform/components/learning/learning-header";
import LessonOutline from "@platform/components/learning/lesson-outline";
import LessonPlayer from "@platform/components/learning/lesson-player";
import { routes } from "@platform/config/navigation";
import { copy } from "@platform/data/site";
export default async function LessonPage({ params }: { params: Promise<{ slug: string; lessonId: string }> }) {
  const { slug, lessonId } = await params;
  const context = await readLessonContext(slug, lessonId);
  const playback = lessonPlaybackModel(context);
  const shell = lessonShellModel(context);
  return (
    <div className="lms-learn">
      <LearningHeader {...shell.header} />
      <div className="lms-learn-grid">
        <LessonOutline {...shell.outline} />
        <main className="lms-lesson-main">
          <Link href={routes.course(slug, context.course.delivery)} className="lms-breadcrumb">{copy.back}</Link>
          <LessonTitle {...playback.title} />
          <LessonPlayer {...playback.player} />
          <LessonActions {...playback.actions} />
          <LessonInformation {...lessonInformationModel(context)} />
          <CourseLiveSchedule slug={slug} joinAllowed={context.enrolled} />
        </main>
      </div>
    </div>
  );
}
