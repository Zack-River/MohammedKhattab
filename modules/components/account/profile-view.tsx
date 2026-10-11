import Link from "next/link";
import PageHeading from "@platform/components/ui/page-heading";
import AccountSummary from "./account-summary";
import type { AccountProfile } from "@platform/types/account";
import type { AccountLabels } from "@platform/types/account-copy";
export default function ProfileView({ profile, labels, settingsHref, adminHref, children }: { profile: AccountProfile; labels: AccountLabels; settingsHref: string; adminHref: string; children?: React.ReactNode }) {
  return <><PageHeading title={labels.profileTitle}><Link className="lms-text-link" href={settingsHref}>{labels.settings}</Link></PageHeading>
    <AccountSummary profile={profile} labels={labels} />
    <PageHeading level={2} title={profile.admin ? labels.adminPanel : labels.courses} />
    {profile.admin ? <Link className="lms-secondary-button" href={adminHref}>{labels.viewAdmin}</Link> : children}
  </>;
}
