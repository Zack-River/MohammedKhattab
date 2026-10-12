"use client";
import { useSyncExternalStore } from "react";
const subscribe=()=>()=>{};
const clientSnapshot=()=>true;
const serverSnapshot=()=>false;
/** Use a deterministic hydration render before displaying browser-local values. */
export function useHydrationState() { return useSyncExternalStore(subscribe,clientSnapshot,serverSnapshot); }
