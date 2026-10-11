"use client";
import type { CourseEditorProps } from "@platform/types/course-editor";
import { adminCoursePolicy as policy } from "@platform/config/admin";
import FormField from "@platform/components/ui/form-field";
import CourseThumbnailField from "./course-thumbnail-field";
export default function CourseMediaFields({ course, labels, uploadLabels }: Pick<CourseEditorProps,"course" | "labels" | "uploadLabels">) {
  return <>
    <CourseThumbnailField slug={course.slug} initialUrl={course.thumbnailUrl ?? ""} label={labels.thumbnail} maxLength={policy.urlMax} uploadLabels={uploadLabels} />
    <FormField label={labels.video} name="introVideoUrl" dir="ltr" defaultValue={course.introVideoUrl ?? ""} maxLength={policy.urlMax} hint={labels.mediaHint} />
  </>;
}
