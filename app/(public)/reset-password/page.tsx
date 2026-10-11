import Link from "next/link";
import { accountCopy as labels } from "@platform/data/account";
import { routes } from "@platform/config/navigation";
import PasswordForm from "@platform/components/account/settings/password-form";
import { requirePageIdentity } from "@platform/features/auth/server/page-identity";
import { hasRecoveryGrant } from "@platform/features/account/repositories/recovery-grant";
import { redirect } from "next/navigation";
export default async function ResetPasswordPage() {
  const { client, user } = await requirePageIdentity();
  if (!await hasRecoveryGrant(client, user.id)) redirect(routes.forgotPassword);
  return <main className="container lms-recovery-page"><section className="lms-login-card lms-auth-card"><h1>{labels.resetTitle}</h1>
    <PasswordForm labels={labels} recovery /><Link className="lms-text-link" href={routes.login}>{labels.backLogin}</Link>
  </section></main>;
}
