import { authPolicy } from "@platform/config/auth";
import FormField from "@platform/components/ui/form-field";
import PasswordField from "@platform/components/ui/password-field";
import type { AccountProfile } from "@platform/types/account";
import type { AccountLabels } from "@platform/types/account-copy";
export default function ContactFields({ profile, labels }: { profile: AccountProfile; labels: AccountLabels }) {
  return <>
    <FormField label={labels.email} name="email" type="email" dir="ltr" defaultValue={profile.pendingEmail ?? profile.email} readOnly={!profile.admin} required maxLength={authPolicy.emailMax} autoComplete="email" hint={profile.admin ? labels.emailChangeHint : labels.emailLocked} />
    <FormField label={labels.phone} name="phone" type="tel" dir="ltr" defaultValue={profile.phone} required autoComplete="tel" maxLength={20} placeholder={labels.phonePlaceholder} pattern="\+[1-9][0-9]{0,2}-[0-9]{4,14}" hint={labels.phoneHint} />
    <PasswordField label={labels.currentPassword} name="currentPassword" autoComplete="current-password" dir="ltr" maxLength={authPolicy.passwordMax} showLabel={labels.show} hideLabel={labels.hide} hint={labels.currentHint} />
  </>;
}
