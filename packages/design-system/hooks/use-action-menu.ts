"use client";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { placeSelectMenu } from "../helpers/place-select-menu";
export function useActionMenu() {
  const button = useRef<HTMLButtonElement>(null), panel = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  function close() { panel.current?.hidePopover(); setOpen(false); }
  function toggle() { if (open) close(); else { panel.current?.showPopover(); setOpen(true); } }
  function keyDown(event: KeyboardEvent<HTMLElement>) {
    const items = Array.from(panel.current?.querySelectorAll<HTMLElement>('a,button:not(:disabled)') ?? []);
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault(); if (!open) { panel.current?.showPopover(); setOpen(true); }
      const current = items.indexOf(document.activeElement as HTMLElement);
      const index = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : (current + (event.key === "ArrowUp" ? -1 : 1) + items.length) % items.length;
      items[index]?.focus();
    } else if (event.key === "Escape") { event.preventDefault(); close(); button.current?.focus(); }
  }
  useEffect(() => {
    if (!open) return;
    const place = () => { if (button.current && panel.current) placeSelectMenu(button.current, panel.current, parseFloat(getComputedStyle(panel.current).getPropertyValue("--action-menu-width"))); };
    place(); window.addEventListener("resize", place); window.addEventListener("scroll", place, true);
    return () => { window.removeEventListener("resize", place); window.removeEventListener("scroll", place, true); };
  }, [open]);
  return { button, panel, open, setOpen, close, toggle, keyDown };
}
