import Link from "next/link";
import type { AdminUser } from "@platform/types/admin-users";
import { routes } from "@platform/config/navigation";
import type { AdminUsersLabels } from "@platform/types/admin-users";
import UserStatus from "./user-status";
import UserActions from "./user-actions";
import UserIdentity from "./user-identity";
export default function UsersTable({ users, labels }: { users: AdminUser[]; labels: AdminUsersLabels }) {
  return <div className="lms-admin-table-wrap" data-reveal><table className="lms-admin-table" role="table">
    <caption className="lms-visually-hidden">{labels.heading}</caption>
    <thead><tr>{[labels.name, labels.username, labels.email, labels.status, labels.actions].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead>
    <tbody role="rowgroup">{users.map(user => <tr key={user.id} role="row">
      <th scope="row" role="rowheader"><UserIdentity user={user} labels={labels} /></th>
      <td role="cell" data-label={labels.username}><span className="lms-admin-truncate" dir="ltr" title={user.username}>{user.username}</span></td>
      <td role="cell" data-label={labels.email}><span className="lms-admin-truncate" dir="ltr" title={user.email}>{user.email}</span>{!user.confirmed && <small>{labels.unconfirmed}</small>}</td>
      <td role="cell" data-label={labels.status}><UserStatus user={user} labels={labels} /></td>
      <td role="cell" className="lms-admin-row-actions"><Link href={routes.adminUser(user.username)} className="lms-admin-view">{labels.view}</Link><UserActions user={user} labels={labels} /></td>
    </tr>)}</tbody>
  </table>{!users.length && <p className="lms-admin-empty">{labels.empty}</p>}</div>;
}
