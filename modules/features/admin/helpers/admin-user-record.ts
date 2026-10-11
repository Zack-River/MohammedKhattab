import type { User } from "@supabase/supabase-js";
import type { AdminUser } from "@platform/types/admin-users";
import type { Database } from "@platform/types/database";
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export function adminUserRecord(user: User, profile: Profile | undefined, admin: boolean): AdminUser {
  const until = (user as User & { banned_until?: string }).banned_until ?? null;
  const avatar = profile?.avatar_url ?? user.user_metadata?.avatar_url;
  const name = profile?.name ?? user.user_metadata?.name;
  return { id: user.id, name: typeof name === "string" ? name : "—",
    username: profile?.username ?? `user-${user.id.replaceAll("-", "")}`, email: user.email ?? "—",
    avatarUrl: typeof avatar === "string" && /^https:\/\//.test(avatar) ? avatar : null,
    admin, confirmed: Boolean(user.email_confirmed_at), suspendedUntil: until,
    permanentlyBanned: Boolean(until && Date.parse(until) - Date.now() > 3650 * 86400000) };
}
