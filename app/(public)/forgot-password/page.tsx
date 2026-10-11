import Link from "next/link";
import { accountCopy as labels } from "@platform/data/account";
import { routes } from "@platform/config/navigation";
import RecoveryRequest from "@platform/components/account/settings/recovery-request";
export default function ForgotPasswordPage() {
  return <main className="container lms-recovery-page"><section className="lms-login-card lms-auth-card"><h1>{labels.forgotTitle}</h1><p>{labels.recoveryHint}</p>
    <RecoveryRequest labels={labels} /><Link className="lms-text-link" href={routes.login}>{labels.backLogin}</Link>
  </section></main>;
}
