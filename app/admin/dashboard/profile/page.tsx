import AccountProfilePage from "@platform/features/account/profile-page";
import { requireAdminPage } from "@platform/features/admin/page-identity";
export default async function ProfilePage() { await requireAdminPage(); return <AccountProfilePage />; }
