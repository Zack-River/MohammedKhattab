"use client";
import TextareaField from "@platform/components/ui/textarea-field";
import type { CurriculumContext, CurriculumTarget } from "@platform/types/curriculum";
import { curriculumPolicy as policy } from "@platform/config/curriculum";
import { adminCoursePolicy } from "@platform/config/admin";
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
    <FormField label={labels.duration} name="durationSeconds" type="number" dir="ltr" defaultValue={lesson?.durationSeconds ?? policy.defaultDurationSeconds} min={1} max={policy.maxDurationSeconds} step={1} required />
    <FormField label={labels.video} name="videoUrl" dir="ltr" defaultValue={lesson ? videos[lesson.id] ?? "" : ""} maxLength={adminCoursePolicy.urlMax} hint={labels.mediaHint} required />
    <Checkbox label={labels.preview} name="preview" defaultChecked={lesson?.preview ?? false} />
  </>;
}
