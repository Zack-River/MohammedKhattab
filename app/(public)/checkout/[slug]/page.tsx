import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { currentIdentity } from "@platform/features/auth/server/identity";
import { findCourse } from "@platform/features/catalog/service";
import { readAccount } from "@platform/features/account/repositories/read-account";
import CheckoutButton from "@platform/components/payments/checkout-button";
import { paymentCopy as labels } from "@platform/data/payment-copy";
import { routes } from "@platform/config/navigation";
export const metadata = {
  title: labels.title,
  robots: { index: false, follow: false },
};
export default async function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params,
    identity = await currentIdentity();
  if (!identity) redirect(routes.login);
  const course = await findCourse(slug);
  if (!course) notFound();
  const enrolled = await identity.client
    .from("enrollments")
    .select("course_slug")
    .eq("user_id", identity.user.id)
    .eq("course_slug", slug)
    .maybeSingle();
  if (enrolled.error) throw new Error("Enrollment lookup failed");
  if (enrolled.data) redirect(routes.library);
  const paid = await identity.client
    .from("payment_orders")
    .select("id")
    .eq("user_id", identity.user.id)
    .eq("course_slug", slug)
    .eq("status", "paid")
    .limit(1)
    .maybeSingle();
  if (paid.error) throw new Error("Payment lookup failed");
  if (paid.data) redirect(routes.payment(paid.data.id));
  if (course.offer.amount <= 0) redirect(routes.course(slug, course.delivery));
  const account = await readAccount(),
    verified = account.emailVerified && account.phoneVerified;
  return (
    <main className="container lms-public-main">
      <div className="lms-payment-layout">
        <h1>{labels.title}</h1>
        <p>{labels.summary}</p>
        <section className="lms-profile-card lms-payment-card" data-reveal="true">
          <h2>{course.title}</h2>
          <p>{course.description}</p>
          <dl className="lms-payment-total">
            <dt>{labels.amount}</dt>
            <dd className="numeral">
              {course.offer.amount} {labels.currency}
            </dd>
          </dl>
          {verified ? (
            <CheckoutButton slug={slug} labels={labels} />
          ) : (
            <>
              <p>{labels.verification}</p>
              <Link className="btn-primary" href={account.admin ? routes.adminSettings : routes.settings}>
                {labels.settings}
              </Link>
            </>
          )}
          <p className="lms-payment-caption">{labels.secure}</p>
          <Link className="lms-payment-back" href={routes.course(slug, course.delivery)}>{labels.back}</Link>
        </section>
      </div>
    </main>
  );
}
