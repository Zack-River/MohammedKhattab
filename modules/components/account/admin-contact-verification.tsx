"use client";
import { useRouter } from "next/navigation";
import { useAsyncCommand } from "@platform/hooks/use-async-command";
import { httpRequest } from "@platform/lib/http-request";
import { endpoints } from "@platform/config/navigation";
import type { AccountLabels } from "@platform/types/account-copy";
import FormFeedback from "./form-feedback";
export default function AdminContactVerification({ userId, email, phone, phoneValue, emailVerified, phoneVerified, labels }: {
  userId: string; email: string; phone: string; phoneValue: string | null; emailVerified: boolean; phoneVerified: boolean; labels: AccountLabels;
}) {
  const router = useRouter(), command = useAsyncCommand(labels.error);
  async function confirm() {
    const result = await command.run(() => httpRequest({ path: endpoints.contactVerification(userId), body: { field: "phone", value: phoneValue }, failureLabel: labels.error, decode: input => input }));
    if (result) router.refresh();
  }
  return <section className="lms-profile-card lms-verification-card"><h2>{labels.verification}</h2>
    <dl className="lms-account-data"><div><dt>{labels.email}</dt><dd><span dir="ltr">{email}</span><br />{emailVerified ? labels.verified : labels.unverified}</dd></div>
      <div><dt>{labels.phone}</dt><dd><span dir="ltr">{phone || labels.missing}</span><br />{phoneVerified ? labels.verified : labels.unverified}</dd></div></dl>
    <p>{labels.confirmationHint}</p>
    <button className="lms-secondary-button" type="button" disabled={!phoneValue || phoneVerified || command.pending} onClick={confirm}>{command.pending ? labels.saving : labels.confirmPhone}</button>
    <FormFeedback error={command.error} />
  </section>;
}
