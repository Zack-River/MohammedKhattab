import AccountSettingsPage from "@platform/features/account/settings-page";
import { hasAdminAccess } from "@platform/features/admin/identity";
import { requirePageIdentity } from "@platform/features/auth/server/page-identity";
import { redirect } from "next/navigation";
import { routes } from "@platform/config/navigation";
export default async function SettingsPage() {
  await requirePageIdentity();
  if (await hasAdminAccess()) redirect(routes.adminSettings);
  return <AccountSettingsPage />;
}
