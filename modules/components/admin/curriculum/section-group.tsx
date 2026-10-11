import type { Lesson } from "@platform/types/lms";
import type { CurriculumContext } from "@platform/types/curriculum";
import CurriculumAction from "./curriculum-action";
import EntityActions from "./entity-actions";
import LessonRow from "./lesson-row";
export default function SectionGroup({ context, chapterId, group }: { context: CurriculumContext; chapterId: string; group: { id: string; sectionId?: string; title: string; lessons: Lesson[] } }) {
  const sectionId = group.sectionId;
  const target = { kind: "section" as const, id: sectionId, chapterId };
  return <section className="lms-curriculum-group">
    <div className="lms-curriculum-heading"><h3>{group.title || context.labels.ungrouped}</h3><div className="lms-admin-actions">
      <CurriculumAction context={context} target={{ kind: "lesson", operation: "create", chapterId, sectionId }} label={context.labels.addLesson} />
      {sectionId && <EntityActions context={context} target={target} />}
    </div></div>
    {group.lessons.length ? <ul className="lms-curriculum-lessons">{group.lessons.map(lesson => <LessonRow key={lesson.id} context={context} lesson={lesson} chapterId={chapterId} sectionId={sectionId} />)}</ul> : <p className="lms-curriculum-note">{context.labels.empty}</p>}
  </section>;
}
