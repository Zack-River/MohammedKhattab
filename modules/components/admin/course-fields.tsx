"use client";
import CourseThumbnailField from "./course-thumbnail-field";
import type { ImageUploadLabels } from "@platform/types/image-upload";
import Select from "@khatab/design/ui/select";
import { Checkbox } from "@khatab/design/ui/choice-controls";
import { adminCoursePolicy as policy } from "@platform/config/admin";
import { useId } from "react";
import FormField from "@platform/components/ui/form-field";
import type { Course } from "@platform/types/lms";
export default function CourseFields({ course, published, labels, categories, uploadLabels }: { course: Course; published: boolean; labels: Record<string,string>; categories: readonly { id: string; label: string }[]; uploadLabels: ImageUploadLabels }) {
  const id = useId();
  return <>
    <FormField label={labels.title} name="title" defaultValue={course.title} required maxLength={policy.titleMax} minLength={policy.titleMin} />
    <label htmlFor={`${id}-description`}>{labels.descriptionLabel}</label><textarea id={`${id}-description`} name="description" defaultValue={course.description} required maxLength={policy.descriptionMax} rows={4} />
    <FormField label={labels.price} name="amount" type="number" min={0} max={policy.amountMax} step="0.01" defaultValue={course.offer.amount} required />
    <FormField label={labels.duration} name="duration" defaultValue={course.duration} maxLength={policy.durationMax} hint={course.delivery === "live" ? labels.durationHint : undefined} />
    <Select label={labels.category} name="category" defaultValue={course.category} options={categories.map(category => ({ value: category.id, label: category.label }))} />
    <CourseThumbnailField slug={course.slug} initialUrl={course.thumbnailUrl ?? ""} label={labels.thumbnail} maxLength={policy.urlMax} uploadLabels={uploadLabels} />
    <FormField label={labels.video} name="introVideoUrl" dir="ltr" defaultValue={course.introVideoUrl ?? ""} maxLength={policy.urlMax} hint={labels.mediaHint} />
    <Checkbox label={labels.published} name="published" defaultChecked={published} />
  </>;
}
