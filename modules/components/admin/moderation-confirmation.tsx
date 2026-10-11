"use client";
import type { AdminUsersLabels } from "@platform/types/admin-users";
import { suspensionPeriods } from "@platform/config/user-moderation";
import type { UserModeration } from "@platform/types/admin-users";
import AdminDialog from "./admin-dialog";
export default function ModerationConfirmation({ change, name, labels, pending, error, onConfirm, onCancel }: {
  change: UserModeration; name: string; labels: AdminUsersLabels; pending: boolean; error: string | null;
  onConfirm: () => void; onCancel: () => void;
}) {
  const description = change.action === "remove" ? labels.confirmRemove : change.action === "promote" ? labels.confirmPromote : labels.confirmRestriction;
  return <AdminDialog title={labels.confirmTitle} closeLabel={labels.close} pending={pending} onClose={onCancel}>
    <p>{name}</p><p><strong>{labels[change.action]}</strong>{change.action === "suspend" && ` · ${suspensionPeriods.find(item => item.id === change.period)?.label}`}</p><p>{description}</p>
    {error && <p role="alert" className="lms-error">{error}</p>}
    <div className="lms-admin-actions"><button className="btn-primary" onClick={onConfirm} disabled={pending}>{pending ? labels.pending : labels.confirm}</button>
      <button className="lms-secondary-button" onClick={onCancel} disabled={pending}>{labels.cancel}</button></div>
  </AdminDialog>;
}
