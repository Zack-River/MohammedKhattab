"use client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAsyncCommand } from "./use-async-command";
import { httpRequest } from "@platform/lib/http-request";
export function useAccountSubmission(path: string, errorLabel: string, successLabel: string, decode: (input: unknown) => unknown = input => input, { refresh = true }: { refresh?: boolean } = {}) {
  const router = useRouter(), command = useAsyncCommand(errorLabel);
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage("");
    const form = event.currentTarget, input = Object.fromEntries(new FormData(form));
    const result = await command.run(() => httpRequest({ path, body: input, failureLabel: errorLabel, decode }));
    if (result) { setMessage(successLabel); form.querySelectorAll<HTMLInputElement>('input[name="password"],input[name="currentPassword"],input[name="confirmPassword"]').forEach(field => { field.value = ""; }); if (refresh) router.refresh(); }
  }
  return { submit, pending: command.pending, error: command.error, message };
}
