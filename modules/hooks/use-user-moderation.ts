"use client";
import { useRouter } from "next/navigation";
import { useAdminSave } from "./use-admin-save";
import { endpoints, routes } from "@platform/config/navigation";
import type { UserModeration } from "@platform/types/admin-users";
export function useUserModeration(id: string, errorLabel: string) {
  const router = useRouter(), command = useAdminSave(endpoints.adminUser(id), errorLabel, { refresh: false });
  const execute = async (change: UserModeration) => {
    const saved = await command.save(change);
    if (saved) { if (change.action === "remove") router.push(routes.adminUsers); router.refresh(); }
    return saved;
  };
  return { execute, pending: command.pending, error: command.error };
}
