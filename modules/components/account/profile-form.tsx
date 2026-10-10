"use client";
import Action from "@khatab/design/ui/action";

import type { ContentBindings } from "@platform/types/content";

import { useId } from "react";
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
    | "email"
    | "emailPlaceholder"
    | "saving"
    | "enterDemo"
    | "save"
    | "profileSaved"
  >;
}) {
  const id = useId();
  const { submit, pending, error, saved, emailChangePending } = useProfileSubmission(entry, copy.error);
  return (
    <form className="lms-profile-form" onSubmit={submit}>
      <label htmlFor={`${id}-name`}>{copy.name}</label>
      <input
        id={`${id}-name`}
        name="name"
        defaultValue={entry ? "" : profile.name}
        required
        minLength={profilePolicy.nameMin}
        maxLength={profilePolicy.nameMax}
        autoComplete="name"
        placeholder={interfaceCopy.namePlaceholder}
      />
      <label htmlFor={`${id}-email`}>{copy.email}</label>
      <input
        id={`${id}-email`}
        name="email"
        type="email"
        dir="ltr"
        defaultValue={profile.email}
        required
        maxLength={profilePolicy.emailMax}
        autoComplete="email"
        placeholder={copy.emailPlaceholder}
      />
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
