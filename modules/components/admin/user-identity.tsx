import Link from "next/link";
import { routes } from "@platform/config/navigation";
import type { AdminUser, AdminUsersLabels } from "@platform/types/admin-users";
import UserAvatar from "./user-avatar";
export default function UserIdentity({ user, labels }: { user: AdminUser; labels: AdminUsersLabels }) {
  return <div className="lms-admin-identity">
    <UserAvatar name={user.name} url={user.avatarUrl} labels={labels} />
    <div><Link href={routes.adminUser(user.id)} className="lms-admin-name">{user.name}</Link>
      <span className="lms-admin-role">{user.admin ? labels.admin : labels.student}</span>
    </div>
  </div>;
}
