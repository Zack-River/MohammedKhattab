import { usernamePolicy } from "@platform/helpers/validation/username";
import { profilePolicy } from "@platform/features/profile/validation";
import FormField from "@platform/components/ui/form-field";
import type { AccountProfile } from "@platform/types/account";
import type { AccountLabels } from "@platform/types/account-copy";
export default function IdentityFields({ profile, labels }: { profile: AccountProfile; labels: AccountLabels }) {
  return <>
    <div className="lms-settings-name-grid"><FormField label={labels.firstName} name="firstName" defaultValue={profile.firstName} autoComplete="given-name" required maxLength={profilePolicy.nameMax} />
      <FormField label={labels.lastName} name="lastName" defaultValue={profile.lastName} autoComplete="family-name" maxLength={profilePolicy.nameMax} /></div>
    <FormField label={labels.username} name="username" defaultValue={profile.username} autoComplete="username" dir="ltr" required minLength={usernamePolicy.min} maxLength={usernamePolicy.max} pattern="[a-zA-Z0-9][a-zA-Z0-9_-]{2,47}" />
  </>;
}
