"use client";
import { useLogout } from "@platform/hooks/use-logout";
export default function LogoutButton({ label, errorLabel }: { label: string; errorLabel: string }) {
  const { logout, pending, error } = useLogout(errorLabel);
  return <div><button type="button" className="lms-text-link" disabled={pending} onClick={logout}>{label}</button>{error && <p role="alert" className="lms-error">{error}</p>}</div>;
}
