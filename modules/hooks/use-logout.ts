"use client";
import { useRouter } from "next/navigation";
import { endpoints, routes } from "@platform/config/navigation";
import { httpRequest } from "@platform/lib/http-request";
import { useAsyncCommand } from "./use-async-command";
export function useLogout(errorLabel: string) {
  const router = useRouter();
  const command = useAsyncCommand(errorLabel);
  const logout = () => command.run(async () => {
    await httpRequest({ path: endpoints.auth.logout, body: {}, failureLabel: errorLabel, decode: value => value });
    router.replace(routes.login);
    router.refresh();
  });
  return { logout, pending: command.pending, error: command.error };
}
