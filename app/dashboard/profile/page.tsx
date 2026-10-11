import AccountProfilePage from "@platform/features/account/profile-page";
import { hasAdminAccess } from "@platform/features/admin/identity";
import { requirePageIdentity } from "@platform/features/auth/server/page-identity";
import { redirect } from "next/navigation";
import { routes } from "@platform/config/navigation";
export default async function ProfilePage() {
  await requirePageIdentity();
  if (await hasAdminAccess()) redirect(routes.adminProfile);
  return <AccountProfilePage />;
}
