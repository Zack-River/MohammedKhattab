import { routes } from "@platform/config/navigation";
import { applicationOrigin } from "@platform/lib/application-origin";
import type { AccountProfile } from "@platform/types/account";
import type { PaymentOrder } from "../types";
export function checkoutPayload(order: PaymentOrder, account: AccountProfile) {
  const resultUrl = `${applicationOrigin()}${routes.payment(order.id)}`;
  return {
    due_date: order.expires_at,
    currency: order.currency,
    cartTotal: order.amount_minor / 100,
    cartItems: [{ name: order.course_title, price: order.amount_minor / 100, quantity: 1 }],
    customer: {
      first_name: account.firstName || account.name,
      last_name: account.lastName || "Ta3allam",
      email: account.email,
      phone: account.phone.replaceAll("-", ""),
      customer_unique_id: account.id,
    },
    pay_load: { merchant_reference: order.id },
    tr_number: order.id,
    lang: "ar",
    redirectOption: true,
    sendEmail: false,
    sendSMS: false,
    redirectionUrls: {
      successUrl: resultUrl,
      failUrl: resultUrl,
      pendingUrl: resultUrl,
      backUrl: resultUrl,
      webhookUrl: `${applicationOrigin()}/api/payments/fawaterak/webhook_json`,
    },
  };
}
