"use client";
import type { AdminUser } from "@platform/types/admin-users";
import { useCurrentTime } from "@platform/hooks/use-current-time";
import { userAdministration } from "@platform/config/user-moderation";
import { suspensionRemaining } from "@platform/features/admin/helpers/suspension-remaining";
import type { AdminUsersLabels } from "@platform/types/admin-users";
export default function UserStatus({ user, labels }: { user: AdminUser; labels: AdminUsersLabels }) {
  const now = useCurrentTime(userAdministration.refreshMs);
  const remaining = user.suspendedUntil && now ? suspensionRemaining(user.suspendedUntil, now) : null;
  const blocked = user.permanentlyBanned || Boolean(remaining && !remaining.expired);
  return <div className="lms-admin-status" data-blocked={blocked || undefined}>
    <strong>{user.permanentlyBanned ? labels.banned : remaining && !remaining.expired ? labels.suspended : user.suspendedUntil && !now ? "…" : labels.active}</strong>
    {user.suspendedUntil && !user.permanentlyBanned && <>
      <small>{labels.ends}: <time dateTime={user.suspendedUntil}>{new Date(user.suspendedUntil).toISOString().replace("T", " ").slice(0, 16)} UTC</time></small>
      {remaining && <small>{remaining.expired ? labels.expired : `${labels.remaining}: ${remaining.days} ${labels.days} · ${remaining.hours} ${labels.hours} · ${remaining.minutes} ${labels.minutes}`}</small>}
    </>}
  </div>;
}
