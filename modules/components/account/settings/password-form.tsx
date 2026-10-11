"use client";
import Action from "@khatab/design/ui/action";
import PasswordField from "@platform/components/ui/password-field";
import { endpoints } from "@platform/config/navigation";
import { authPolicy } from "@platform/config/auth";
import { useAccountSubmission } from "@platform/hooks/use-account-submission";
import type { AccountLabels } from "@platform/types/account-copy";
import FormFeedback from "../form-feedback";
export default function PasswordForm({ labels, recovery = false }: { labels: AccountLabels; recovery?: boolean }) {
  const { submit, pending, error, message } = useAccountSubmission(recovery ? endpoints.resetPassword : endpoints.accountPassword, labels.error, recovery ? labels.resetSaved : labels.passwordSaved, undefined, { refresh: !recovery });
  const common = { dir: "ltr" as const, required: true, disabled: pending, maxLength: authPolicy.passwordMax, showLabel: labels.show, hideLabel: labels.hide };
  return <form className="lms-profile-form" onSubmit={submit} aria-busy={pending}>
    {!recovery && <PasswordField {...common} label={labels.currentPassword} name="currentPassword" autoComplete="current-password" />}
    <PasswordField {...common} label={labels.password} name="password" autoComplete="new-password" minLength={authPolicy.passwordMin} hint={labels.passwordHint} />
    <PasswordField {...common} label={labels.confirmPassword} name="confirmPassword" autoComplete="new-password" minLength={authPolicy.passwordMin} />
    <Action kind="button" type="submit" className="btn-primary" disabled={pending}>{pending ? labels.saving : recovery ? labels.reset : labels.save}</Action>
    <FormFeedback error={error} message={message} />
  </form>;
}
