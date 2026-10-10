import { redirect } from "next/navigation";
import { hasAdminAccess } from "@platform/features/admin/identity";
import { routes } from "@platform/config/navigation";
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!await hasAdminAccess()) redirect(routes.dashboard);
  return children;
}
