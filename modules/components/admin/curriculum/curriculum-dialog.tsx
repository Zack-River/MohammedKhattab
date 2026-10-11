"use client";
import type { CurriculumContext, CurriculumTarget } from "@platform/types/curriculum";
import { useAdminSave } from "@platform/hooks/use-admin-save";
import { endpoints } from "@platform/config/navigation";
import { readCurriculumForm } from "@platform/features/admin/helpers/read-curriculum-form";
import AdminDialog from "../admin-dialog";
import SaveFeedback from "../save-feedback";
import CurriculumFields from "./curriculum-fields";
export default function CurriculumDialog({ context, target, onClose }: { context: CurriculumContext; target: CurriculumTarget; onClose: () => void }) {
  const { course, labels, revision } = context;
  const command = useAdminSave(endpoints.adminCurriculum(course.slug),labels.error);
  const title = `${target.operation === "delete" ? labels.remove : labels[target.operation]} ${labels[target.kind]}`;
  return <AdminDialog title={title} closeLabel={labels.close} pending={command.pending} onClose={onClose}>
    <div className="lms-curriculum-dialog"><form className="lms-profile-form lms-admin-form" onSubmit={async event => {
      event.preventDefault();
      if (await command.save(readCurriculumForm(new FormData(event.currentTarget),target,revision))) onClose();
    }}>
      <p className="lms-curriculum-note">{labels.courseLabel}: {course.title}</p>
      {target.operation === "delete" ? <p>{labels.deleteHint}</p> : <CurriculumFields context={context} target={target} />}
      <fieldset disabled={command.pending}><SaveFeedback {...command} labels={{ ...labels, save: target.operation === "delete" ? labels.remove : labels.save }} /></fieldset>
    </form></div>
  </AdminDialog>;
}
