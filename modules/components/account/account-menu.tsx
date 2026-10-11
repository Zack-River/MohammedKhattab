"use client";
import Avatar from "@khatab/design/ui/avatar";
import ActionMenu from "@khatab/design/ui/action-menu";
import { useLogout } from "@platform/hooks/use-logout";
import type { accountMenuContent } from "@platform/config/account-menu";
export default function AccountMenu({ name, avatarUrl, content }: { name: string; avatarUrl?: string | null; content: typeof accountMenuContent }) {
  const { logout, pending, error } = useLogout(content.errorLabel);
  return <ActionMenu label={content.label} links={content.links} error={error}
    trigger={<Avatar name={name} url={avatarUrl} label={content.imageLabel} className="lms-avatar" />}
    action={{ label: content.logoutLabel, onSelect: logout, disabled: pending }} />;
}
