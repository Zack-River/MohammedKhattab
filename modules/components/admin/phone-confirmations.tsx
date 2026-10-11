import Link from "next/link";
import { routes } from "@platform/config/navigation";
import { phoneConfirmationConfig } from "@platform/config/phone-confirmations";
import type { PhoneConfirmationLabels, PhoneConfirmationRequest } from "@platform/types/phone-confirmations";
import type { AccountLabels } from "@platform/types/account-copy";
import { displayPhoneNumber } from "@platform/features/account/helpers/phone-number";
import PageHeading from "@platform/components/ui/page-heading";
import ConfirmPhoneButton from "@platform/components/account/confirm-phone-button";
export default function PhoneConfirmations({ requests, total, page, labels, accountLabels }: {
  requests: PhoneConfirmationRequest[]; total: number; page: number; labels: PhoneConfirmationLabels; accountLabels: AccountLabels;
}) {
  return <><PageHeading title={labels.title} description={labels.description} />
    <p className="body-regular">{total} {labels.count}</p>
    <div className="lms-phone-requests">{requests.length ? requests.map(request => <article className="lms-profile-card" key={request.user_id}>
      <h2><Link href={routes.adminUser(request.username)}>{request.name}</Link></h2>
      <dl className="lms-account-data"><div><dt>{accountLabels.username}</dt><dd dir="ltr">{request.username}</dd></div>
        <div><dt>{accountLabels.email}</dt><dd dir="ltr">{request.email}</dd></div>
        <div><dt>{labels.phone}</dt><dd dir="ltr">{displayPhoneNumber(request.phone_e164)}</dd></div></dl>
      <div className="lms-phone-request-actions"><Link className="lms-text-link" href={routes.adminUser(request.username)}>{labels.view}</Link>
        <ConfirmPhoneButton userId={request.user_id} phone={request.phone_e164} label={labels.confirm} pendingLabel={accountLabels.saving} errorLabel={accountLabels.error} /></div>
    </article>) : <p>{labels.empty}</p>}</div>
    <nav className="lms-admin-pagination" aria-label={labels.title}>
      {page > 1 && <Link className="lms-secondary-button" href={`${routes.adminPhoneConfirmations}?page=${page - 1}`}>{labels.previous}</Link>}
      <span>{labels.page} {page}</span>{page * phoneConfirmationConfig.pageSize < total && <Link className="lms-secondary-button" href={`${routes.adminPhoneConfirmations}?page=${page + 1}`}>{labels.next}</Link>}
    </nav></>;
}
