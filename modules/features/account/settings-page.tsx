import { readAccount } from "./repositories/read-account";
import { accountCopy } from "@platform/data/account";
import { creatorContacts } from "../../../config/creator-contacts";
import SettingsView from "@platform/components/account/settings/settings-view";
export default async function AccountSettingsPage() {
  return <SettingsView profile={await readAccount()} labels={accountCopy} supportHref={creatorContacts.whatsapp} />;
}
