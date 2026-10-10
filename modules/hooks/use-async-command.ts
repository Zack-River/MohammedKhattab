"use client";
import { useRef, useState } from "react";
/** Own pending/error and exclusion for the entire workflow, not each HTTP step. */
export function useAsyncCommand(failureLabel: string) {
  const inFlight = useRef(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function run<T>(command: () => Promise<T>): Promise<T | null> {
    if (inFlight.current) return null;
    inFlight.current = true;
    setPending(true);
    setError("");
    try { return await command(); }
    catch (error) {
      setError(error instanceof Error ? error.message : failureLabel);
      return null;
    } finally { inFlight.current = false; setPending(false); }
  }
  return { pending, error, run };
}
