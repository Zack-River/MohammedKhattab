"use client";
import type { CourseEditorProps } from "@platform/types/course-editor";
import CoursePriceField from "./course-price-field";
import Select from "@khatab/design/ui/select";
import { adminCoursePolicy as policy } from "@platform/config/admin";
import TextareaField from "@platform/components/ui/textarea-field";
import FormField from "@platform/components/ui/form-field";
import { courseDuration } from "@platform/features/catalog/helpers/course-duration";
export default function CourseFields({ course, labels, categories, delivery = course?.delivery ?? "recorded" }: Pick<CourseEditorProps,"labels" | "categories"> & { course?: CourseEditorProps["course"]; delivery?: "recorded" | "live" }) {
  return <>
    <FormField label={labels.title} name="title" defaultValue={course?.title} required maxLength={policy.titleMax} minLength={policy.titleMin} />
    <TextareaField label={labels.descriptionLabel} name="description" defaultValue={course?.description} required minLength={policy.descriptionMin} maxLength={policy.descriptionMax} rows={4} />
    <CoursePriceField initialAmount={course?.offer.amount} labels={labels} />
    <FormField key={delivery} label={labels.duration} name={delivery === "live" ? "duration" : undefined} readOnly={delivery !== "live"} defaultValue={delivery === "live" ? course?.duration : course ? courseDuration(course) : ""} maxLength={policy.durationMax} hint={delivery === "live" ? labels.durationHint : labels.durationAutomaticHint} />
    <Select label={labels.category} name="category" defaultValue={course?.category ?? categories[0].id} options={categories.map(category => ({ value: category.id, label: category.label }))} />
  </>;
}
