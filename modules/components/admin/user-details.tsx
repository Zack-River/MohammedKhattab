import type { AdminUser } from "@platform/types/admin-users";
import type { AdminUsersLabels } from "@platform/types/admin-users";
import UserAvatar from "./user-avatar";
import UserStatus from "./user-status";
import UserActions from "./user-actions";
export default function UserDetails({ user, labels }: { user: AdminUser; labels: AdminUsersLabels }) {
  return <section className="lms-profile-card lms-admin-user-details">
    <UserAvatar name={user.name} url={user.avatarUrl} labels={labels} />
    <dl>{[[labels.name, user.name], [labels.username, user.username], [labels.email, user.email], [labels.role, user.admin ? labels.admin : labels.student]].map(([label, value]) =>
      <div key={label}><dt>{label}</dt><dd dir={label === labels.name ? undefined : "auto"}>{value}</dd></div>)}</dl>
    <UserStatus user={user} labels={labels} /><UserActions user={user} labels={labels} />
  </section>;
}
