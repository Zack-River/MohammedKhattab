"use client";
import Action from "@khatab/design/ui/action";

import type { ContentBindings } from "@platform/types/content";

import FormField from "@platform/components/ui/form-field";
import { usernamePolicy } from "@platform/helpers/validation/username";
import { useProfileSubmission } from "@platform/hooks/use-profile-submission";
import type { Learner } from "@platform/types/lms";
import { profilePolicy } from "@platform/features/profile/validation";
export default function ProfileForm({
  profile,
  entry = false,
  interfaceCopy,
  copy,
  emailPendingMessage,
}: {
  profile: Learner;
  entry?: boolean;
  emailPendingMessage?: string;
} & {
  interfaceCopy: Pick<ContentBindings["interfaceCopy"], "namePlaceholder">;
  copy: Pick<
    ContentBindings["copy"],
    | "error"
    | "name"
    | "username"
    | "usernameHint"
    | "email"
    | "emailPlaceholder"
    | "saving"
    | "enterDemo"
    | "save"
    | "profileSaved"
  >;
}) {
  const { submit, pending, error, saved, emailChangePending } = useProfileSubmission(entry, copy.error);
  return (
    <form className="lms-profile-form" onSubmit={submit}>
      <FormField label={copy.name} name="name" defaultValue={entry ? "" : profile.name} required
        minLength={profilePolicy.nameMin} maxLength={profilePolicy.nameMax} autoComplete="name" placeholder={interfaceCopy.namePlaceholder} />
      {profile.username && <FormField label={copy.username} name="username" defaultValue={profile.username} required dir="auto"
        minLength={usernamePolicy.min} maxLength={usernamePolicy.max} autoComplete="username" hint={copy.usernameHint} />}
      <FormField label={copy.email} name="email" type="email" dir="ltr" defaultValue={profile.email} required
        maxLength={profilePolicy.emailMax} autoComplete="email" placeholder={copy.emailPlaceholder} />
      <Action
        kind="button"
        className="btn-primary"
        type="submit"
        disabled={pending}
      >
        {pending ? copy.saving : entry ? copy.enterDemo : copy.save}
      </Action>
      {error && (
        <p className="lms-error" role="alert">
          {error}
        </p>
      )}
      {saved && !entry && (
        <p className="lms-success" role="status">
          {emailChangePending ? emailPendingMessage ?? copy.profileSaved : copy.profileSaved}
        </p>
      )}
    </form>
  );
}
