"use client";
import { useState } from "react";
import type { AdminUser, SuspensionPeriod, UserModeration } from "@platform/types/admin-users";
import type { AdminUsersLabels } from "@platform/types/admin-users";
import { useUserModeration } from "@platform/hooks/use-user-moderation";
import ModerationConfirmation from "./moderation-confirmation";
import AdminDialog from "./admin-dialog";
import ModerationControls from "./moderation-controls";
import UserIdentity from "./user-identity";
import UserStatus from "./user-status";
export default function UserActions({ user, labels }: { user: AdminUser; labels: AdminUsersLabels }) {
  const [open, setOpen] = useState(false);
  const [period, setPeriod] = useState<SuspensionPeriod>("day"), [change, setChange] = useState<UserModeration | null>(null);
  const command = useUserModeration(user.id, labels.error);
  const confirm = async () => { if (change && await command.execute(change)) { setChange(null); setOpen(false); } };
  const action = async (next: UserModeration) => {
    if (next.action === "restore") { if (await command.execute(next)) setOpen(false); }
    else setChange(next);
  };
  if (user.admin) return <span className="lms-admin-protected" title={labels.protectedAdmin}>{labels.protected}</span>;
  return <div className="lms-admin-user-actions">
    <button type="button" className="lms-secondary-button lms-admin-manage" aria-haspopup="dialog" onClick={() => setOpen(true)}>{labels.manage}</button>
    {open && <AdminDialog title={labels.manage} closeLabel={labels.close} pending={command.pending} onClose={() => setOpen(false)}>
      <UserIdentity user={user} labels={labels} /><p className="lms-admin-account-email" dir="ltr">{user.email}</p>
      <UserStatus user={user} labels={labels} />
      <ModerationControls user={user} labels={labels} period={period} pending={command.pending} onPeriod={setPeriod} onAction={next => void action(next)} />
      {command.error && !change && <p role="alert" className="lms-error">{command.error}</p>}
    </AdminDialog>}
    {change && <ModerationConfirmation labels={labels} change={change} name={`${user.name} · ${user.email}`} pending={command.pending} error={command.error} onConfirm={() => void confirm()} onCancel={() => setChange(null)} />}
  </div>;
}
