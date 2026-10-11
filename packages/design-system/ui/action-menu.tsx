"use client";
import Link from "next/link";
import { useId } from "react";
import { useActionMenu } from "../hooks/use-action-menu";
import type { ActionMenuProps } from "../types/action-menu";
export default function ActionMenu({ trigger, label, links, action, error }: ActionMenuProps) {
  const id = useId();
  const { button, panel, open, setOpen, close, toggle, keyDown } = useActionMenu();
  return <div className="ds-action-menu" onKeyDown={keyDown} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) close();
  }}>
    <button ref={button} type="button" className="ds-action-trigger" aria-label={label} aria-expanded={open} aria-controls={id} onClick={toggle}>{trigger}</button>
    <div ref={panel} popover="auto" id={id} className="ds-action-panel" onToggle={event => setOpen(event.newState === "open")}>
      <nav aria-label={label}>{links.map(link => <Link key={link.href} href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined} onClick={close}>{link.label}</Link>)}</nav>
      <button type="button" className="ds-action-logout" disabled={action.disabled} onClick={action.onSelect}>{action.label}</button>
      {error && <p className="lms-error" role="alert">{error}</p>}
    </div>
  </div>;
}
