"use client";
import { useRouter } from "next/navigation";
import { useAsyncCommand } from "@platform/hooks/use-async-command";
import { httpRequest } from "@platform/lib/http-request";
import { endpoints } from "@platform/config/navigation";
import FormFeedback from "./form-feedback";
export default function ConfirmPhoneButton({ userId, phone, verified = false, label, pendingLabel, errorLabel }: {
  userId: string; phone: string | null; verified?: boolean; label: string; pendingLabel: string; errorLabel: string;
}) {
  const router = useRouter(), command = useAsyncCommand(errorLabel);
  async function confirm() {
    const result = await command.run(() => httpRequest({ path: endpoints.contactVerification(userId), body: { field: "phone", value: phone }, failureLabel: errorLabel, decode: input => input }));
    if (result) router.refresh();
  }
  return <><button className="lms-secondary-button" type="button" disabled={!phone || verified || command.pending} onClick={confirm}>{command.pending ? pendingLabel : label}</button>
    <FormFeedback error={command.error} /></>;
}
