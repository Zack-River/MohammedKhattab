"use client";
import type { CurriculumContext, CurriculumTarget } from "@platform/types/curriculum";
import FormField from "@platform/components/ui/form-field";
import Select from "@khatab/design/ui/select";
import { curriculumPolicy as policy } from "@platform/config/curriculum";
import LessonFields from "./lesson-fields";
export default function CurriculumFields({ context, target }: { context: CurriculumContext; target: CurriculumTarget }) {
  const { course, labels } = context;
  const chapter = course.modules.find(chapter => chapter.id === target.chapterId || chapter.id === target.id);
  if (target.kind === "lesson") return <LessonFields context={context} target={target} />;
  const record = target.kind === "chapter" ? chapter : chapter?.sections?.find(section => section.id === target.id);
  return <>
    <FormField label={labels.title} name="title" defaultValue={record?.title ?? ""} required minLength={policy.titleMin} maxLength={policy.titleMax} />
    {target.kind === "section" && <Select label={labels.chapterLabel} name="chapterId" required defaultValue={target.chapterId} options={course.modules.map(chapter => ({ value: chapter.id, label: chapter.title }))} />}
  </>;
}
