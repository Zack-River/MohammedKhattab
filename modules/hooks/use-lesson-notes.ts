"use client";
import { persistencePolicy } from "@platform/config/persistence";
import { useCallback, useState, useSyncExternalStore } from "react";
export function useLessonNotes(key: string) {
  const [failed, setFailed] = useState(false);
  const subscribe = useCallback((notify: () => void) => {
    window.addEventListener("storage", notify);
    window.addEventListener(persistencePolicy.notesEvent, notify);
    return () => {
      window.removeEventListener("storage", notify);
      window.removeEventListener(persistencePolicy.notesEvent, notify);
    };
  }, []);
  const snapshot = useCallback(() => {
    try {
      return localStorage.getItem(key) ?? "";
    } catch {
      return "";
    }
  }, [key]);
  const value = useSyncExternalStore(subscribe, snapshot, () => "");
  function save(text: string) {
    try {
      localStorage.setItem(key, text);
      window.dispatchEvent(new Event(persistencePolicy.notesEvent));
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }
  return { value, save, failed };
}
