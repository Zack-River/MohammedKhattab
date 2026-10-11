import type { phoneConfirmationCopy } from "@platform/data/phone-confirmations";
export type PhoneConfirmationLabels = { [K in keyof typeof phoneConfirmationCopy]: string };
export interface PhoneConfirmationRequest {
  user_id: string; email: string; phone_e164: string; updated_at: string; name: string; username: string;
}
