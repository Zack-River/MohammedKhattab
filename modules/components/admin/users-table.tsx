import Link from "next/link";
import type { AdminUser } from "@platform/types/admin-users";
import { routes } from "@platform/config/navigation";
import type { AdminUsersLabels } from "@platform/types/admin-users";
import UserStatus from "./user-status";
import UserActions from "./user-actions";
export default function UsersTable({ users, labels }: { users: AdminUser[]; labels: AdminUsersLabels }) {
  return <><p className="lms-admin-table-hint">{labels.tableHint}</p><div className="lms-admin-table-wrap" role="region" aria-label={labels.heading} tabIndex={0}><table className="lms-admin-table">
    <caption className="lms-visually-hidden">{labels.heading}</caption>
    <thead><tr>{[labels.name, labels.username, labels.email, labels.status, labels.actions].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead>
    <tbody>{users.map(user => <tr key={user.id}>
      <th scope="row"><Link href={routes.adminUser(user.id)} className="lms-text-link">{user.name}</Link><small>{user.admin ? labels.admin : labels.student}</small></th>
      <td dir="ltr">{user.username}</td><td><span dir="ltr">{user.email}</span>{!user.confirmed && <small>{labels.unconfirmed}</small>}</td>
      <td><UserStatus user={user} labels={labels} /></td><td><Link href={routes.adminUser(user.id)} className="lms-text-link">{labels.view}</Link><UserActions user={user} labels={labels} /></td>
    </tr>)}</tbody>
  </table>{!users.length && <p>{labels.empty}</p>}</div></>;
}
