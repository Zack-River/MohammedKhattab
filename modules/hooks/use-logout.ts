"use client";
import { endpoints, routes } from "@platform/config/navigation";
import { httpRequest } from "@platform/lib/http-request";
import { useAsyncCommand } from "./use-async-command";
export function useLogout(errorLabel: string) {
  const command = useAsyncCommand(errorLabel);
  const logout = () => command.run(async () => {
    await httpRequest({ path: endpoints.auth.logout, body: {}, failureLabel: errorLabel, decode: value => value });
    window.location.replace(routes.login);
  });
  return { logout, pending: command.pending, error: command.error };
}
