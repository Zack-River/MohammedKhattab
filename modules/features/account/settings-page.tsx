import { readAccount } from "./repositories/read-account";
import { accountCopy } from "@platform/data/account";
import { creatorContacts } from "../../../config/creator-contacts";
import { avatarUploadCopy } from "@platform/data/image-upload";
import SettingsView from "@platform/components/account/settings/settings-view";
export default async function AccountSettingsPage() {
  return <SettingsView profile={await readAccount()} labels={accountCopy} uploadLabels={avatarUploadCopy} supportHref={creatorContacts.whatsapp} />;
}
