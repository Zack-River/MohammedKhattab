"use client";
import { useEffect, useId, useRef, type ReactNode } from "react";
export default function AdminDialog({ title, closeLabel, pending = false, onClose, children }: {
  title: string; closeLabel: string; pending?: boolean; onClose: () => void; children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null), titleId = useId();
  useEffect(() => {
    const element = dialog.current;
    const opener = document.activeElement;
    element?.showModal();
    return () => { element?.close(); if (opener instanceof HTMLElement && opener.isConnected) opener.focus(); };
  }, []);
  return <dialog ref={dialog} className="lms-admin-dialog" aria-labelledby={titleId}
    onCancel={event => { event.preventDefault(); if (!pending) onClose(); }}>
    <header className="lms-admin-dialog-header"><h2 id={titleId}>{title}</h2>
      <button type="button" className="lms-admin-close" aria-label={closeLabel} disabled={pending} onClick={onClose}><span aria-hidden="true">×</span></button>
    </header>{children}
  </dialog>;
}
