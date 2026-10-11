"use client";
import type { ImageUploadLabels } from "@platform/types/image-upload";
import { endpoints } from "@platform/config/navigation";
import { useAdminSave } from "@platform/hooks/use-admin-save";
import { readCourseEdit } from "@platform/features/admin/helpers/read-course-edit";
import type { Course } from "@platform/types/lms";
import CourseFields from "./course-fields";
import SaveFeedback from "./save-feedback";
export default function CourseEditor({ course, published, labels, categories, uploadLabels }: { course: Course; published: boolean; labels: Record<string,string> & { save: string; saving: string; saved: string }; categories: readonly { id: string; label: string }[]; uploadLabels: ImageUploadLabels }) {
  const command = useAdminSave(endpoints.adminCourse(course.slug), labels.error);
  return <form className="lms-profile-form lms-admin-form" method="post" onSubmit={event => { event.preventDefault(); void command.save(readCourseEdit(new FormData(event.currentTarget))); }}>
    <CourseFields course={course} published={published} labels={labels} categories={categories} uploadLabels={uploadLabels} />
    <SaveFeedback {...command} labels={labels} />
  </form>;
}
