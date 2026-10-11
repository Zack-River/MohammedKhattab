import type { suspensionPeriods } from "@platform/config/user-moderation";
export type SuspensionPeriod = typeof suspensionPeriods[number]["id"];
export type UserModeration = { action: "suspend"; period: SuspensionPeriod } | { action: "ban" | "restore" | "remove" | "promote" };
export interface AdminUser {
  id: string; name: string; username: string; email: string; avatarUrl: string | null;
  admin: boolean; confirmed: boolean; suspendedUntil: string | null; permanentlyBanned: boolean;
}
export interface AdminUserPage { users: AdminUser[]; page: number; hasNext: boolean; total: number; }
export interface AdminUserQuery {
  page: number; search: string; statuses: ("suspended" | "banned")[]; adminsOnly: boolean; newcomers: boolean;
}
export interface UserSubscription { slug: string; title: string; enrolledAt: string; delivery: "recorded" | "live"; }

import type { adminUsersCopy } from "@platform/data/admin-users";
export type AdminUsersLabels = { [K in keyof typeof adminUsersCopy]: string };
