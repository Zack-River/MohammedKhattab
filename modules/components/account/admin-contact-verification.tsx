"use client";
import type { AccountLabels } from "@platform/types/account-copy";
import ConfirmPhoneButton from "./confirm-phone-button";
export default function AdminContactVerification({ userId, email, phone, phoneValue, emailVerified, phoneVerified, labels }: {
  userId: string; email: string; phone: string; phoneValue: string | null; emailVerified: boolean; phoneVerified: boolean; labels: AccountLabels;
}) {
  return <section className="lms-profile-card lms-verification-card"><h2>{labels.verification}</h2>
    <dl className="lms-account-data"><div><dt>{labels.email}</dt><dd><span dir="ltr">{email}</span><br />{emailVerified ? labels.verified : labels.unverified}</dd></div>
      <div><dt>{labels.phone}</dt><dd><span dir="ltr">{phone || labels.missing}</span><br />{phoneVerified ? labels.verified : labels.unverified}</dd></div></dl>
    <p>{labels.confirmationHint}</p>
    <ConfirmPhoneButton userId={userId} phone={phoneValue} verified={phoneVerified} label={labels.confirmPhone} pendingLabel={labels.saving} errorLabel={labels.error} />
  </section>;
}
