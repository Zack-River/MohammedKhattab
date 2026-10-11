import "server-only";
import { currentIdentity } from "./identity";
import { hasAdminAccess } from "@platform/features/admin/identity";
import { routes } from "@platform/config/navigation";
import { interfaceCopy } from "@platform/data/interface-copy";
import { adminUsersCopy } from "@platform/data/admin-users";
import type { NavigationAccount } from "@platform/types/navigation-account";
export async function readNavigationAccount(): Promise<NavigationAccount | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) return null;
  if (!await currentIdentity()) return null;
  const admin = await hasAdminAccess();
  return { href: admin ? routes.adminDashboard : routes.dashboard, label: admin ? adminUsersCopy.dashboard : interfaceCopy.dashboardLabel };
}
