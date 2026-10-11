import PageHeading from "@platform/components/ui/page-heading";
import SettingsForm from "./settings-form";
import PasswordForm from "./password-form";
import VerificationStatus from "../verification-status";
import type { AccountProfile } from "@platform/types/account";
import type { AccountLabels } from "@platform/types/account-copy";
export default function SettingsView({ profile, labels, supportHref }: { profile: AccountProfile; labels: AccountLabels; supportHref: string }) {
  return <><PageHeading title={labels.settingsTitle} /><div className="lms-account-stack">
    <section className="lms-profile-card"><SettingsForm profile={profile} labels={labels} /></section>
    <VerificationStatus profile={profile} labels={labels} supportHref={supportHref} />
    <section className="lms-profile-card"><h2>{labels.passwordTitle}</h2><PasswordForm labels={labels} /></section>
  </div></>;
}
