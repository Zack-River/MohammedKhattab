"use client";
import type { CourseEditorProps } from "@platform/types/course-editor";
import { endpoints } from "@platform/config/navigation";
import { useAdminSave } from "@platform/hooks/use-admin-save";
import { readCourseEdit } from "@platform/features/admin/helpers/read-course-edit";
import CourseMediaFields from "./course-media-fields";
import { Checkbox } from "@khatab/design/ui/choice-controls";
import CourseFields from "./course-fields";
import CourseFormLayout from "./course-form-layout";
import SaveFeedback from "./save-feedback";
export default function CourseEditor({ course, published, revision, labels, categories, uploadLabels }: CourseEditorProps) {
  const command = useAdminSave(endpoints.adminCourse(course.slug), labels.error);
  return <CourseFormLayout method="post" labels={labels} pending={command.pending}
    onSubmit={event => { event.preventDefault(); void command.save(readCourseEdit(new FormData(event.currentTarget))); }}
    details={<CourseFields course={course} labels={labels} categories={categories} />}
    media={<CourseMediaFields course={course} labels={labels} uploadLabels={uploadLabels} />}
    actions={<><Checkbox label={labels.published} name="published" defaultChecked={published} disabled={command.pending} /><SaveFeedback {...command} labels={labels} /></>}>
    <input type="hidden" name="revision" value={revision} />
  </CourseFormLayout>;
}
