"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
const HistoryRestoration = createContext(0);
/** Persist history notifications across route unmounts, including visits to public pages. */
export default function HistoryBoundary({ children }: { children: ReactNode }) {
  const [restoration, setRestoration] = useState(0);
  useEffect(() => {
    const restored = () => setRestoration(value => value + 1);
    window.addEventListener("popstate", restored);
    return () => window.removeEventListener("popstate", restored);
  }, []);
  return <HistoryRestoration.Provider value={restoration}>{children}</HistoryRestoration.Provider>;
}
export function useHistoryRestoration() { return useContext(HistoryRestoration); }
