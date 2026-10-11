import { Checkbox, Radio } from "@khatab/design/ui/choice-controls";
import Form from "next/form";
import Link from "next/link";
import { routes } from "@platform/config/navigation";
import { userAdministration, userStatusFilters, userSearchModes } from "@platform/config/user-moderation";
import type { AdminUserQuery, AdminUsersLabels } from "@platform/types/admin-users";
import { userQueryUrl } from "@platform/features/admin/helpers/user-query-url";
export default function UserFilters({ query, total, labels }: { query: AdminUserQuery; total: number; labels: AdminUsersLabels }) {
  return <Form key={userQueryUrl(query)} action={routes.adminUsers} className="lms-admin-filters" role="search" aria-label={labels.search}>
    <div className="lms-admin-search"><label htmlFor="admin-user-search">{labels.search}</label>
      <input type="search" id="admin-user-search" name="q" defaultValue={query.search} placeholder={labels.searchHint} maxLength={userAdministration.searchMaxLength} />
    </div>
    <fieldset><legend>{labels.searchMode}</legend><div className="lms-admin-filter-options">
      {userSearchModes.map(mode => <Radio key={mode} name="mode" value={mode} label={labels[mode]} defaultChecked={query.searchMode === mode} />)}
    </div></fieldset>
    <fieldset><legend>{labels.filters}</legend><div className="lms-admin-filter-options">
      {userStatusFilters.map(status => <Checkbox key={status} name="status" value={status} label={labels[status]} defaultChecked={query.statuses.includes(status)} />)}
      <Checkbox name="admins" value="1" label={labels.adminsOnly} defaultChecked={query.adminsOnly} />
      <Checkbox name="newcomers" value="1" label={labels.newcomers} defaultChecked={query.newcomers} />
    </div><p className="lms-admin-filter-hint">{labels.filterHint}</p></fieldset>
    <div className="lms-admin-filter-footer"><div className="lms-admin-actions">
      <button type="submit" className="btn-primary">{labels.apply}</button><Link href={routes.adminUsers} className="lms-secondary-button">{labels.clear}</Link>
    </div><p className="lms-admin-result-count">{labels.results}: <strong>{total}</strong></p></div>
  </Form>;
}
