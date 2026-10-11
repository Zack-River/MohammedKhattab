import EmailConfirmation from "./settings/email-confirmation";
import Link from "next/link";
import type { AccountProfile } from "@platform/types/account";
import type { AccountLabels } from "@platform/types/account-copy";
export default function VerificationStatus({ profile, labels, supportHref }: { profile: AccountProfile; labels: AccountLabels; supportHref: string }) {
  return <section data-reveal className="lms-profile-card lms-verification-card" aria-labelledby="contact-verification-title">
    <h2 id="contact-verification-title">{labels.verification}</h2>
    <dl className="lms-account-data">{[[labels.email, profile.emailVerified], [labels.phone, profile.phoneVerified]].map(([label, verified]) =>
      <div key={String(label)}><dt>{label}</dt><dd className={verified ? "lms-success" : "lms-unverified"}>{verified ? labels.verified : labels.unverified}</dd></div>)}</dl>
    {!profile.emailVerified && <EmailConfirmation email={profile.pendingEmail ?? profile.email} pendingChange={Boolean(profile.pendingEmail)} labels={labels} />}
    {profile.pendingEmail && <p>{labels.pendingEmail}: <b dir="ltr">{profile.pendingEmail}</b></p>}
    {(!profile.emailVerified || !profile.phoneVerified) && <><p>{labels.verificationHint}</p><Link className="lms-text-link" href={supportHref} target="_blank" rel="noopener noreferrer">{labels.support}</Link></>}
  </section>;
}
