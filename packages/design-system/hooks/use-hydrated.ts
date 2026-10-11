"use client";
import { useSyncExternalStore } from "react";
const subscribe = () => () => {};
/** Gate controls whose native events cannot be replayed before React attaches. */
export function useHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
