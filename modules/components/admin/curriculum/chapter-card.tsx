import type { CurriculumChapter, CurriculumContext } from "@platform/types/curriculum";
import { courseContentGroups } from "@platform/features/admin/helpers/course-content-groups";
import CurriculumAction from "./curriculum-action";
import EntityActions from "./entity-actions";
import SectionGroup from "./section-group";
export default function ChapterCard({ context, chapter }: { context: CurriculumContext; chapter: CurriculumChapter }) {
  const target = { kind: "chapter" as const, id: chapter.id };
  return <section className="lms-profile-card" data-reveal>
    <header className="lms-curriculum-heading"><div><h2>{chapter.title}</h2><small className="lms-curriculum-note">{context.labels.chapter}</small></div><div className="lms-admin-actions">
      <CurriculumAction context={context} target={{ kind: "section", operation: "create", chapterId: chapter.id }} label={context.labels.addSection} />
      <CurriculumAction context={context} target={{ kind: "lesson", operation: "create", chapterId: chapter.id }} label={context.labels.addLesson} />
      <EntityActions context={context} target={target} />
    </div></header>
    <div className="lms-curriculum-groups">{courseContentGroups(chapter,context.labels.ungrouped).map(group => <SectionGroup key={group.sectionId ? `section-${group.sectionId}` : "unassigned"} context={context} chapterId={chapter.id} group={group} />)}</div>
  </section>;
}
