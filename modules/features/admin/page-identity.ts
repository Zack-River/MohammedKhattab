import { redirect } from "next/navigation";
import { requirePageIdentity } from "@platform/features/auth/server/page-identity";
import { hasAdminAccess } from "./identity";
import { routes } from "@platform/config/navigation";
export async function requireAdminPage() {
  const identity = await requirePageIdentity();
  if (!await hasAdminAccess()) redirect(routes.dashboard);
  return identity;
}
