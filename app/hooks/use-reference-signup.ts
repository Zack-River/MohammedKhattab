import { useEffect, useState } from "react";
import type { SignupOptions } from "@khatab/design/types/interactions";

export function useReferenceSignup(options: SignupOptions) {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState(options.initialName);
  useEffect(() => {
    if (!options.names.length) return;
    let index = Math.max(0, options.names.indexOf(options.initialName));
    let hideTimer = 0;
    const show = () => {
      setName(options.names[index % options.names.length]);
      index++;
      setVisible(true);
      clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => setVisible(false), options.visibleMs);
    };
    const first = window.setTimeout(show, options.delayMs);
    const interval = window.setInterval(show, options.intervalMs);
    return () => {
      clearTimeout(first);
      clearTimeout(hideTimer);
      clearInterval(interval);
    };
  }, [options]);
  return { visible, name, close: () => setVisible(false) };
}
