import Link from "next/link";
import Symbol from "@platform/components/ui/symbol";
import { routes } from "@platform/config/navigation";
import type { Lesson } from "@platform/types/lms";
import type { CourseDetailsLabels } from "@platform/types/course-details";
export default function CurriculumLesson({ lesson, slug, enrolled, labels }: { lesson: Lesson; slug: string; enrolled: boolean; labels: CourseDetailsLabels }) {
  const accessible = enrolled || lesson.preview;
  return <li>
    <Symbol name="play" />
    <div className="lms-curriculum-lesson-title">{accessible ? <Link href={routes.lesson(slug,lesson.id)}>{lesson.title}</Link> : <span>{lesson.title}</span>}
      {!enrolled && lesson.preview && <small>{labels.preview}</small>}
    </div>
    <time className="numeral" dateTime={`PT${lesson.durationSeconds}S`}>{lesson.duration}</time>
    {!accessible && <span className="lms-lesson-lock" aria-label={labels.locked} title={labels.locked}><Symbol name="lock" /></span>}
  </li>;
}
