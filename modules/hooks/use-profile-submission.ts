"use client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAsyncCommand } from "./use-async-command";
import { httpRequest } from "@platform/lib/http-request";
import { readProfileResponse } from "@platform/helpers/read-profile-response";
import { validateProfile } from "@platform/features/profile/validation";
import { endpoints, routes } from "@platform/config/navigation";
export function useProfileSubmission(entry: boolean, errorLabel: string) {
  const router = useRouter();
  const { run, pending, error } = useAsyncCommand(errorLabel);
  const [validationError, setValidationError] = useState("");
  const [emailChangePending, setEmailChangePending] = useState(false);
  const [saved, setSaved] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(false);
    setValidationError("");
    const form = new FormData(event.currentTarget);
    const input = { name: form.get("name"), email: form.get("email"), ...(form.has("username") ? { username: form.get("username") } : {}) };
    if (!validateProfile(input)) {
      setValidationError(errorLabel);
      return;
    }
    const result = await run(() => httpRequest({ path: endpoints.profile,
      body: input,
      failureLabel: errorLabel, decode: input => ({ profile: readProfileResponse(input), emailChangePending: Boolean(input && typeof input === "object" && "emailChangePending" in input && input.emailChangePending) }) }));
    if (result) {
      setSaved(true);
      setEmailChangePending(result.emailChangePending);
      if (entry) router.push(routes.dashboard);
      router.refresh();
    }
  }
  return { submit, pending, error: validationError || error, saved, emailChangePending };
}
