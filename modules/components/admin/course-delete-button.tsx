"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAsyncCommand } from "@platform/hooks/use-async-command";
import { httpRequest } from "@platform/lib/http-request";
import { endpoints } from "@platform/config/navigation";
import type { AdminCourseRow, AdminCoursesLabels } from "@platform/types/admin-courses";
import AdminDialog from "./admin-dialog";

export default function CourseDeleteButton({ course, labels }: { course: AdminCourseRow; labels: AdminCoursesLabels }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const command = useAsyncCommand(labels.error);

  async function remove() {
    const deleted = await command.run(() => httpRequest({
      path: endpoints.adminCourseDelete(course.slug),
      body: { confirmSlug: course.slug },
      failureLabel: labels.error,
      decode: value => {
        if (!value || typeof value !== "object" || !("deleted" in value) || value.deleted !== true) {
          throw new Error(labels.error);
        }
        return true;
      },
    }));
    if (deleted) {
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <div className="lms-course-delete">
      <button type="button" className="lms-admin-danger" aria-haspopup="dialog" onClick={() => setOpen(true)}>
        {labels.remove}
      </button>
      {open && (
        <AdminDialog title={labels.confirmTitle} closeLabel={labels.close} pending={command.pending} onClose={() => setOpen(false)}>
          <p><strong>{course.title}</strong></p>
          <p>{labels.confirmRemove}</p>
          {Boolean(course.students) && (
            <p className="lms-error">
              تنبيه: يوجد {course.students} مشترك في هذه الدورة. سيتم حذف الدورة وكافة اشتراكات وتقدم الطلاب ومحتواها بالكامل.
            </p>
          )}
          {command.error && <p className="lms-error" role="alert">{command.error}</p>}
          <div className="lms-admin-actions">
            <button type="button" className="btn-primary" disabled={command.pending} onClick={() => void remove()}>
              {command.pending ? labels.pending : labels.confirm}
            </button>
            <button type="button" className="lms-secondary-button" disabled={command.pending} onClick={() => setOpen(false)}>
              {labels.cancel}
            </button>
          </div>
        </AdminDialog>
      )}
    </div>
  );
}
