"use client";
import Action from "@khatab/design/ui/action";
import FormField from "@platform/components/ui/form-field";
import { endpoints } from "@platform/config/navigation";
import { useAccountSubmission } from "@platform/hooks/use-account-submission";
import type { AccountLabels } from "@platform/types/account-copy";
import FormFeedback from "../form-feedback";
export default function RecoveryRequest({ labels, confirmation = false }: { labels: AccountLabels; confirmation?: boolean }) {
  const { submit, pending, error, message } = useAccountSubmission(confirmation ? endpoints.emailConfirmation : endpoints.forgotPassword, labels.error, confirmation ? labels.emailSent : labels.recoverySent);
  return <form className="lms-profile-form" onSubmit={submit} aria-busy={pending}>
    <FormField label={labels.email} name="email" type="email" required dir="ltr" autoComplete="email" maxLength={100} disabled={pending} />
    <Action kind="button" className="btn-primary" type="submit" disabled={pending}>{pending ? labels.saving : confirmation ? labels.resendEmail : labels.sendRecovery}</Action>
    <FormFeedback error={error} message={message} />
  </form>;
}
