import AccountSettingsPage from "@platform/features/account/settings-page";
import { requireAdminPage } from "@platform/features/admin/page-identity";
export default async function SettingsPage() { await requireAdminPage(); return <AccountSettingsPage />; }
