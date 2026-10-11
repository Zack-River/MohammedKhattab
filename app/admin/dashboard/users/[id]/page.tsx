import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeading from "@platform/components/ui/page-heading";
import UserDetails from "@platform/components/admin/user-details";
import UserSubscriptions from "@platform/components/admin/user-subscriptions";
import { requireAdminPage } from "@platform/features/admin/page-identity";
import { readAdminUser } from "@platform/features/admin/repositories/users";
import { readUserSubscriptions } from "@platform/features/admin/repositories/user-subscriptions";
import { validUserId } from "@platform/features/admin/helpers/read-moderation";
import { routes } from "@platform/config/navigation";
import { adminUsersCopy as labels } from "@platform/data/admin-users";
import { ApiError } from "@platform/lib/api/error";
export default async function AdminUserPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage();
  const { id } = await params;
  if (!validUserId(id)) notFound();
  const user = await readAdminUser(id).catch(error => { if (error instanceof ApiError && error.status === 404) notFound(); throw error; });
  const subscriptions = await readUserSubscriptions(id);
  return <><PageHeading title={user.name}><Link className="lms-text-link" href={routes.adminUsers}>{labels.back}</Link></PageHeading>
    <UserDetails labels={labels} user={user} /><UserSubscriptions labels={labels} subscriptions={subscriptions} />
  </>;
}
