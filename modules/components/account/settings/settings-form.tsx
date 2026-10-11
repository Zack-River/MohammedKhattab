"use client";
import Action from "@khatab/design/ui/action";
import { endpoints } from "@platform/config/navigation";
import { useAccountSubmission } from "@platform/hooks/use-account-submission";
import { readAccountResponse } from "@platform/features/account/helpers/read-account-response";
import type { AccountProfile } from "@platform/types/account";
import type { AccountLabels } from "@platform/types/account-copy";
import IdentityFields from "./identity-fields";
import ContactFields from "./contact-fields";
import FormFeedback from "../form-feedback";
export default function SettingsForm({ profile, labels }: { profile: AccountProfile; labels: AccountLabels }) {
  const { submit, pending, error, message } = useAccountSubmission(endpoints.accountSettings, labels.error, labels.profileSaved, readAccountResponse);
  return <form className="lms-profile-form" onSubmit={submit} aria-busy={pending}>
    <fieldset disabled={pending}><IdentityFields profile={profile} labels={labels} /><ContactFields profile={profile} labels={labels} /></fieldset>
    <Action kind="button" type="submit" className="btn-primary" disabled={pending}>{pending ? labels.saving : labels.save}</Action>
    <FormFeedback error={error} message={message} />
  </form>;
}
