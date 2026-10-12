export interface PaymentOrder {
  id: string;
  user_id: string | null;
  course_slug: string;
  course_title: string;
  amount_minor: number;
  currency: string;
  status: string;
  provider_intent_key: string | null;
  checkout_url: string | null;
  created_at: string;
  expires_at: string;
  paid_at: string | null;
  transaction_id: number | null;
}
export interface GatewayTransaction {
  intent_key: string;
  transaction_id: number;
  paid: number;
  total: number;
  currency: string;
  pay_load: unknown;
  status_text: string;
  paid_at: string | null;
}
