"use client";
import TextareaField from "@platform/components/ui/textarea-field";
import type { CurriculumContext, CurriculumTarget } from "@platform/types/curriculum";
import { curriculumPolicy as policy } from "@platform/config/curriculum";
import LessonMediaFields from "./lesson-media-fields";
import FormField from "@platform/components/ui/form-field";
import { Checkbox } from "@khatab/design/ui/choice-controls";
import LessonAssignment from "./lesson-assignment";
export default function LessonFields({ context, target }: { context: CurriculumContext; target: CurriculumTarget }) {
  const { course, labels, videos } = context;
  const lesson = course.modules.flatMap(chapter => chapter.lessons).find(lesson => lesson.id === target.id);
  return <>
    <FormField label={labels.title} name="title" defaultValue={lesson?.title ?? ""} required minLength={policy.titleMin} maxLength={policy.titleMax} />
    <TextareaField label={labels.description} name="description" defaultValue={lesson?.description ?? ""} maxLength={policy.descriptionMax} rows={3} />
    <LessonAssignment course={course} chapterId={target.chapterId!} sectionId={target.sectionId ?? ""} labels={labels} />
    <LessonMediaFields slug={course.slug} initialUrl={lesson ? videos[lesson.id] ?? "" : ""} initialSeconds={lesson?.durationSeconds} labels={labels} />
    <Checkbox label={labels.preview} name="preview" defaultChecked={lesson?.preview ?? false} />
  </>;
}
