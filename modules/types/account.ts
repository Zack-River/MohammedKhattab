export interface AccountProfile {
  id: string; name: string; username: string; firstName: string; lastName: string;
  email: string; pendingEmail: string | null; phone: string; avatarUrl: string | null;
  emailVerified: boolean; phoneVerified: boolean; admin: boolean;
}
export interface AccountSettingsInput {
  firstName: string; lastName: string; username: string; email: string; phone: string; currentPassword: string;
}
export type ContactField = "email" | "phone";
