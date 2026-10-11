"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
export default function RefreshButton({ label, pendingLabel, className }: { label: string; pendingLabel: string; className?: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return <button type="button" className={className} disabled={pending} aria-busy={pending}
    onClick={() => startTransition(() => router.refresh())}>{pending ? pendingLabel : label}</button>;
}
