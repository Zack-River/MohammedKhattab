"use client";
import { useAccountSubmission } from "@platform/hooks/use-account-submission";
import { endpoints } from "@platform/config/navigation";
import type { AccountLabels } from "@platform/types/account-copy";
import FormFeedback from "../form-feedback";
export default function EmailConfirmation({ email, pendingChange, labels }: { email: string; pendingChange: boolean; labels: AccountLabels }) {
  const { submit, pending, error, message } = useAccountSubmission(endpoints.emailConfirmation, labels.error, labels.emailSent);
  return <form onSubmit={submit}><input type="hidden" name="email" value={email} /><input type="hidden" name="type" value={pendingChange ? "email_change" : "signup"} />
    <button className="lms-text-link" type="submit" disabled={pending}>{pending ? labels.saving : labels.resendEmail}</button><FormFeedback error={error} message={message} />
  </form>;
}
