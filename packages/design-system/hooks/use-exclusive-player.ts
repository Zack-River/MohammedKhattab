"use client";
import { useCallback, useEffect, useRef } from "react";

const activationEvent = "khatab:player-activation";

/** Claim playback before retrieval starts, resetting other deferred instances. */
export function useExclusivePlayer(reset: () => void) {
  const identity = useRef(Symbol("player"));
  useEffect(() => {
    const onActivation = (event: Event) => {
      if ((event as CustomEvent<symbol>).detail !== identity.current) reset();
    };
    document.addEventListener(activationEvent, onActivation);
    return () => document.removeEventListener(activationEvent, onActivation);
  }, [reset]);
  return useCallback(() => {
    document.dispatchEvent(new CustomEvent(activationEvent, { detail: identity.current }));
  }, []);
}
