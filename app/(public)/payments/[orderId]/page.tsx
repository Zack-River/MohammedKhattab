import { redirect, notFound } from "next/navigation";
import { currentIdentity } from "@platform/features/auth/server/identity";
import { readPaymentOrder, readPaymentReceipt } from "@platform/features/payments/repositories/read-order";
import { ApiError } from "@platform/lib/api/error";
import {creatorContacts} from "@/config/creator-contacts";
import OrderResult from "@platform/components/payments/order-result";
import { paymentCopy as labels } from "@platform/data/payment-copy";
import { routes } from "@platform/config/navigation";
export const metadata = {
  title: labels.resultTitle,
  robots: { index: false, follow: false },
};
export default async function PaymentPage({ params }: { params: Promise<{ orderId: string }> }) {
  if (!(await currentIdentity())) redirect(routes.login);
  const { orderId } = await params;
  const order = await readPaymentOrder(orderId).catch((error) => {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  });
  return (
    <main className="container lms-public-main">
      <div className="lms-payment-layout">
        <h1>{labels.resultTitle}</h1>
        <OrderResult
          initial={await readPaymentReceipt(order)}
          labels={labels}
          libraryHref={routes.library}
          retryHref={order.bundle_slug ? routes.bundleCheckout(order.bundle_slug) : routes.checkout(order.course_slug!)}
          settingsHref={routes.settings}
          supportHref={creatorContacts.whatsapp}
        />
      </div>
    </main>
  );
}
