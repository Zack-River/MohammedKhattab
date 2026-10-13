import AdminContactVerification from "@platform/components/account/admin-contact-verification";
import { readUserContacts } from "@platform/features/account/repositories/read-user-contacts";
import { displayPhoneNumber } from "@platform/features/account/helpers/phone-number";
import { accountCopy } from "@platform/data/account";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import PageHeading from "@platform/components/ui/page-heading";
import UserDetails from "@platform/components/admin/user-details";
import EnrollmentManager from "@platform/components/admin/enrollment-manager";
import EnrollmentHistory from "@platform/components/admin/enrollment-history";
import {adminCourseTitles} from "@platform/features/admin/repositories/course-titles";
import {readEnrollmentHistory} from "@platform/features/admin/enrollments/repository";
import {enrollmentCopy} from "@platform/data/enrollment";
import { requireAdminPage } from "@platform/features/admin/page-identity";
import { readUserSubscriptions } from "@platform/features/admin/repositories/user-subscriptions";
import { resolveAdminUser } from "@platform/features/admin/repositories/user-handle";
import { routes } from "@platform/config/navigation";
import { adminUsersCopy as labels } from "@platform/data/admin-users";
import { ApiError } from "@platform/lib/api/error";
export default async function AdminUserPage({ params }: { params: Promise<{ username: string }> }) {
  await requireAdminPage();
  const { username } = await params;
  const user = await resolveAdminUser(username).catch(error => { if (error instanceof ApiError && error.status === 404) notFound(); throw error; });
  if (username !== user.username) redirect(routes.adminUser(user.username));
  const [subscriptions,contact,courses,events] = await Promise.all([readUserSubscriptions(user.id),readUserContacts(user.id),adminCourseTitles(),readEnrollmentHistory(user.id)]);
  return <><PageHeading title={user.name}><Link className="lms-text-link" href={routes.adminUsers}>{labels.back}</Link></PageHeading>
    <UserDetails labels={labels} user={user} /><AdminContactVerification userId={user.id} email={contact.pending_email ?? contact.email} phone={displayPhoneNumber(contact.phone_e164)} phoneValue={contact.phone_e164} emailVerified={Boolean(contact.email_verified_at && !contact.pending_email)} phoneVerified={Boolean(contact.phone_verified_at)} labels={accountCopy} />
    <EnrollmentManager userId={user.id} userLabels={labels} labels={enrollmentCopy} {...{subscriptions,courses}} />
    <EnrollmentHistory {...{events,courses}} labels={enrollmentCopy}/>
  </>;
}
