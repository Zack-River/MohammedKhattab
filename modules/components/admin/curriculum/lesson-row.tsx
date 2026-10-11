import type { Lesson } from "@platform/types/lms";
import type { CurriculumContext } from "@platform/types/curriculum";
import EntityActions from "./entity-actions";
export default function LessonRow({ context, lesson, chapterId, sectionId }: { context: CurriculumContext; lesson: Lesson; chapterId: string; sectionId?: string }) {
  const target = { kind: "lesson" as const, id: lesson.id, chapterId, sectionId };
  return <li className="lms-curriculum-row">
    <div><h4>{lesson.title}</h4><small>{lesson.duration}{lesson.preview && ` · ${context.labels.preview}`}</small></div>
    <div className="lms-admin-actions">
      <EntityActions context={context} target={target} />
    </div>
  </li>;
}
