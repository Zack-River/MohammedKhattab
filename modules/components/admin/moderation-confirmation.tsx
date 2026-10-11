"use client";
import { useEffect, useRef, useId } from "react";
import type { AdminUsersLabels } from "@platform/types/admin-users";
import { suspensionPeriods } from "@platform/config/user-moderation";
import type { UserModeration } from "@platform/types/admin-users";
export default function ModerationConfirmation({ change, name, labels, pending, error, onConfirm, onCancel }: {
  change: UserModeration; name: string; labels: AdminUsersLabels; pending: boolean; error: string | null;
  onConfirm: () => void; onCancel: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null), titleId = useId();
  useEffect(() => { dialog.current?.showModal(); }, []);
  const description = change.action === "remove" ? labels.confirmRemove : change.action === "promote" ? labels.confirmPromote : labels.confirmRestriction;
  return <dialog ref={dialog} className="lms-admin-dialog" aria-labelledby={titleId} onCancel={event => { event.preventDefault(); if (!pending) onCancel(); }}>
    <h2 id={titleId}>{labels.confirmTitle}</h2><p>{name}</p><p><strong>{labels[change.action]}</strong>{change.action === "suspend" && ` · ${suspensionPeriods.find(item => item.id === change.period)?.label}`}</p><p>{description}</p>
    {error && <p role="alert" className="lms-error">{error}</p>}
    <div className="lms-admin-actions"><button className="btn-primary" onClick={onConfirm} disabled={pending}>{pending ? labels.pending : labels.confirm}</button>
      <button className="btn-secondary" onClick={onCancel} disabled={pending}>{labels.cancel}</button></div>
  </dialog>;
}
