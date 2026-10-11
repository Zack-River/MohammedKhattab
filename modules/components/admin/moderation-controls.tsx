import Select from "@khatab/design/ui/select";
import { suspensionPeriods } from "@platform/config/user-moderation";
import type { AdminUser, AdminUsersLabels, SuspensionPeriod, UserModeration } from "@platform/types/admin-users";
export default function ModerationControls({ user, labels, period, pending, onPeriod, onAction }: {
  user: AdminUser; labels: AdminUsersLabels; period: SuspensionPeriod; pending: boolean;
  onPeriod: (period: SuspensionPeriod) => void; onAction: (change: UserModeration) => void;
}) {
  return <div className="lms-admin-controls">
    <fieldset disabled={pending}><legend>{labels.access}</legend><p>{labels.accessHint}</p>
      <div className="lms-admin-suspend"><Select label={labels.period} value={period} disabled={pending}
        options={suspensionPeriods.map(item => ({ value: item.id, label: item.label }))}
        onValueChange={value => onPeriod(value as SuspensionPeriod)} /><button type="button" className="lms-secondary-button" onClick={() => onAction({ action: "suspend", period })}>{labels.suspend}</button></div>
      <div className="lms-admin-actions">
        {user.suspendedUntil && <button type="button" className="lms-secondary-button" onClick={() => onAction({ action: "restore" })}>{labels.restore}</button>}
        <button type="button" className="lms-admin-danger" onClick={() => onAction({ action: "ban" })}>{labels.ban}</button>
      </div>
    </fieldset>
    <fieldset disabled={pending || !user.confirmed}><legend>{labels.permissions}</legend><p>{labels.confirmPromote}</p>
      <button type="button" className="lms-secondary-button" onClick={() => onAction({ action: "promote" })}>{labels.promote}</button>
      {!user.confirmed && <p>{labels.unconfirmed}</p>}
    </fieldset>
    <fieldset disabled={pending} className="lms-admin-destructive"><legend>{labels.danger}</legend><p>{labels.confirmRemove}</p>
      <button type="button" className="lms-admin-danger" onClick={() => onAction({ action: "remove" })}>{labels.remove}</button>
    </fieldset>
  </div>;
}
