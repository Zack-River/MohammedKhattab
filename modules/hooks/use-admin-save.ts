"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { httpRequest } from "@platform/lib/http-request";
import { useAsyncCommand } from "./use-async-command";
export function useAdminSave(path: string, errorLabel: string, options: { refresh?: boolean } = {}) {
  const router = useRouter(), command = useAsyncCommand(errorLabel);
  const [saved, setSaved] = useState(false);
  const save = async (body: unknown) => {
    setSaved(false);
    const result = await command.run(() => httpRequest({ path, body, failureLabel: errorLabel, decode: value => {
      if (!value || typeof value !== "object" || !("saved" in value) || value.saved !== true) throw new Error(errorLabel);
      return true;
    } }));
    if (result) { setSaved(true); if (options.refresh !== false) router.refresh(); }
    return Boolean(result);
  };
  return { save, pending: command.pending, error: command.error, saved };
}
