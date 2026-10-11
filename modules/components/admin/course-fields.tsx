"use client";
import type { CourseEditorProps } from "@platform/types/course-editor";
import CoursePriceField from "./course-price-field";
import Select from "@khatab/design/ui/select";
import { adminCoursePolicy as policy } from "@platform/config/admin";
import TextareaField from "@platform/components/ui/textarea-field";
import FormField from "@platform/components/ui/form-field";
export default function CourseFields({ course, labels, categories }: Pick<CourseEditorProps,"course" | "labels" | "categories">) {
  return <>
    <FormField label={labels.title} name="title" defaultValue={course.title} required maxLength={policy.titleMax} minLength={policy.titleMin} />
    <TextareaField label={labels.descriptionLabel} name="description" defaultValue={course.description} required maxLength={policy.descriptionMax} rows={4} />
    <CoursePriceField initialAmount={course.offer.amount} labels={labels} />
    <FormField label={labels.duration} name="duration" defaultValue={course.duration} maxLength={policy.durationMax} hint={course.delivery === "live" ? labels.durationHint : undefined} />
    <Select label={labels.category} name="category" defaultValue={course.category} options={categories.map(category => ({ value: category.id, label: category.label }))} />
  </>;
}
