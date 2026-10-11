import Form from "next/form";
import Link from "next/link";
import { routes } from "@platform/config/navigation";
import { userAdministration, userStatusFilters } from "@platform/config/user-moderation";
import type { AdminUserQuery, AdminUsersLabels } from "@platform/types/admin-users";
import { userQueryUrl } from "@platform/features/admin/helpers/user-query-url";
export default function UserFilters({ query, total, labels }: { query: AdminUserQuery; total: number; labels: AdminUsersLabels }) {
  return <Form key={userQueryUrl(query)} action={routes.adminUsers} className="lms-admin-filters" role="search" aria-label={labels.search}>
    <div className="lms-admin-search"><label htmlFor="admin-user-search">{labels.search}</label>
      <input type="search" id="admin-user-search" name="q" defaultValue={query.search} placeholder={labels.searchHint} maxLength={userAdministration.searchMaxLength} />
    </div>
    <fieldset><legend>{labels.filters}</legend><div className="lms-admin-filter-options">
      {userStatusFilters.map(status => <label key={status}><input type="checkbox" name="status" value={status} defaultChecked={query.statuses.includes(status)} />{labels[status]}</label>)}
      <label><input type="checkbox" name="admins" value="1" defaultChecked={query.adminsOnly} />{labels.adminsOnly}</label>
      <label><input type="checkbox" name="newcomers" value="1" defaultChecked={query.newcomers} />{labels.newcomers}</label>
    </div><p className="lms-admin-filter-hint">{labels.filterHint}</p></fieldset>
    <div className="lms-admin-filter-footer"><div className="lms-admin-actions">
      <button type="submit" className="btn-primary">{labels.apply}</button><Link href={routes.adminUsers} className="lms-secondary-button">{labels.clear}</Link>
    </div><p className="lms-admin-result-count">{labels.results}: <strong>{total}</strong></p></div>
  </Form>;
}
