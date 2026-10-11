"use client";
import { useId, useState } from "react";
import type { AdminUser, SuspensionPeriod, UserModeration } from "@platform/types/admin-users";
import { suspensionPeriods } from "@platform/config/user-moderation";
import type { AdminUsersLabels } from "@platform/types/admin-users";
import { useUserModeration } from "@platform/hooks/use-user-moderation";
import ModerationConfirmation from "./moderation-confirmation";
export default function UserActions({ user, labels }: { user: AdminUser; labels: AdminUsersLabels }) {
  const periodId = useId();
  const [period, setPeriod] = useState<SuspensionPeriod>("day"), [change, setChange] = useState<UserModeration | null>(null);
  const command = useUserModeration(user.id, labels.error);
  const confirm = async () => { if (change && await command.execute(change)) setChange(null); };
  if (user.admin) return <small>{labels.protectedAdmin}</small>;
  return <div className="lms-admin-actions">
    <label className="lms-visually-hidden" htmlFor={periodId}>{labels.period}: {user.name}</label>
    <select id={periodId} value={period} onChange={event => setPeriod(event.target.value as SuspensionPeriod)} disabled={command.pending}>
      {suspensionPeriods.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
    </select>
    <button className="btn-secondary" disabled={command.pending} onClick={() => setChange({ action: "suspend", period })}>{labels.suspend}</button>
    <button className="btn-secondary" disabled={command.pending} onClick={() => setChange({ action: "ban" })}>{labels.ban}</button>
    {user.suspendedUntil && <button className="btn-secondary" onClick={() => void command.execute({ action: "restore" })} disabled={command.pending}>{labels.restore}</button>}
    <button className="btn-secondary" disabled={command.pending || !user.confirmed} onClick={() => setChange({ action: "promote" })}>{labels.promote}</button>
    <button className="lms-admin-danger" disabled={command.pending} onClick={() => setChange({ action: "remove" })}>{labels.remove}</button>
    {command.error && !change && <p role="alert" className="lms-error">{command.error}</p>}
    {change && <ModerationConfirmation labels={labels} change={change} name={`${user.name} · ${user.email}`} pending={command.pending} error={command.error} onConfirm={() => void confirm()} onCancel={() => setChange(null)} />}
  </div>;
}
