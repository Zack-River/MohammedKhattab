"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAsyncCommand } from "./use-async-command";
import { httpRequest } from "@platform/lib/http-request";
import { authFields } from "@platform/config/auth";
import { validateAuth } from "@platform/features/auth/helpers/validate";
import { readAuthValues } from "@platform/features/auth/helpers/read-values";
import { validateAuthField } from "@platform/features/auth/helpers/validate-field";
import { readAuthResponse } from "@platform/features/auth/helpers/read-response";
import type { AuthErrors, AuthPageModel } from "@platform/types/auth";
export function useAuthForm({ mode, endpoint, redirectTo, copy }: Pick<AuthPageModel, "mode" | "endpoint" | "redirectTo" | "copy">) {
  const router = useRouter(), command = useAsyncCommand(copy.requestError);
  const [errors, setErrors] = useState<AuthErrors>({});
  const [edited, setEdited] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  function change(event: FormEvent<HTMLFormElement>) {
    if (!(event.target instanceof HTMLInputElement)) return;
    const field = authFields[mode].find((field) => field === (event.target as HTMLInputElement).name);
    if (field) setErrors((current) => ({ ...current, [field]: undefined }));
    setEdited(true);
    setConfirmation(false);
  }
  function blur(event: FormEvent<HTMLFormElement>) {
    if (!(event.target instanceof HTMLInputElement)) return;
    const field = authFields[mode].find((field) => field === (event.target as HTMLInputElement).name);
    if (!field) return;
    const issue = validateAuthField(field, readAuthValues(Object.fromEntries(new FormData(event.currentTarget))));
    setErrors((current) => ({ ...current, [field]: issue }));
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const result = validateAuth(Object.fromEntries(new FormData(form)), mode);
    setEdited(false);
    if (!result.valid) {
      setErrors(result.errors);
      const field = authFields[mode].find((field) => result.errors[field]);
      const input = field && form.elements.namedItem(field);
      if (input instanceof HTMLElement) input.focus();
      return;
    }
    setErrors({});
    const response = await command.run(() => httpRequest({ path: endpoint, body: result.values, failureLabel: copy.requestError, decode: (input) => readAuthResponse(input, copy.requestError) }));
    if (response?.status === "confirmation_required") { form.reset(); setConfirmation(true); }
    if (response?.status === "authenticated") { form.reset(); router.push(redirectTo); router.refresh(); }
  }
  return { submit, change, blur, errors, pending: command.pending, confirmation, error: edited ? "" : command.error };
}
