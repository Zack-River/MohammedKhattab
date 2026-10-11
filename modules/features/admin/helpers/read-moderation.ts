import { suspensionPeriods } from "@platform/config/user-moderation";
import type { UserModeration } from "@platform/types/admin-users";
export function readModeration(value: unknown): UserModeration | null {
  if (!value || typeof value !== "object" || !("action" in value)) return null;
  if (value.action === "suspend" && "period" in value) {
    const period = suspensionPeriods.find(item => item.id === value.period);
    return period ? { action: "suspend", period: period.id } : null;
  }
  if (value.action === "ban" || value.action === "restore" || value.action === "remove" || value.action === "promote") return { action: value.action };
  return null;
}
export function validUserId(id: string) { return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id); }
