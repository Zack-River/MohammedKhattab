"use client";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { formControlBehavior } from "../config/form-controls";
import type { SelectOption } from "../types/select";
import { placeSelectMenu } from "../helpers/place-select-menu";
import { selectNavigation, selectTypeahead } from "../helpers/select-navigation";
export function useSelectMenu(options: readonly SelectOption[], selected: string, choose: (value: string) => void) {
  const button = useRef<HTMLButtonElement>(null), panel = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false), [active, setActive] = useState(-1);
  const typing = useRef({ text: "", time: 0 });
  function toggle(show = !open) {
    setOpen(show);
    if (show) { setActive(Math.max(0, options.findIndex(option => option.value === selected))); panel.current?.showPopover(); }
    else panel.current?.hidePopover();
  }
  function commit(index: number) {
    const option = options[index];
    if (!option || option.disabled) return;
    choose(option.value); toggle(false); button.current?.focus();
  }
  function keyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault(); if (!open) toggle(true);
      setActive(current => selectNavigation(event.key, open ? current : options.findIndex(option => option.value === selected), options));
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault(); if (open) commit(active); else toggle(true);
    } else if (event.key === "Escape" && open) { event.preventDefault(); event.stopPropagation(); toggle(false); }
    else if (event.key === "Tab") { toggle(false); }
    else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
      const now = performance.now(); typing.current = { text: (now - typing.current.time < formControlBehavior.typeaheadResetMs ? typing.current.text : "") + event.key, time: now };
      const index = selectTypeahead(typing.current.text, options);
      if (index >= 0) { if (!open) toggle(true); setActive(index); }
    }
  }
  useEffect(() => {
    if (!open) return;
    const reposition = () => { if (button.current && panel.current) placeSelectMenu(button.current, panel.current); };
    reposition(); window.addEventListener("resize", reposition); window.addEventListener("scroll", reposition, true);
    const observer = new ResizeObserver(reposition); if (button.current) observer.observe(button.current);
    return () => { observer.disconnect(); window.removeEventListener("resize", reposition); window.removeEventListener("scroll", reposition, true); };
  }, [open]);
  useEffect(() => { if (open) panel.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" }); }, [active, open]);
  return { button, panel, open, active, setOpen, toggle, commit, keyDown, setActive };
}
