"use client";
import { useCallback, useRef, useState } from "react";
import { usePlayerFullscreen } from "./use-player-fullscreen";
import { usePlayerViewportReset } from "./use-player-viewport-reset";
export function useMediaPlayerSession(resetOnScrollOut: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const fullscreen = usePlayerFullscreen(ref);
  const { exitFullscreen } = fullscreen;
  const [generation, setGeneration] = useState(0);
  const reset = useCallback(() => {
    void exitFullscreen();
    setGeneration((value) => value + 1);
  }, [exitFullscreen]);
  usePlayerViewportReset(ref, reset, resetOnScrollOut);
  return { ref, generation, ...fullscreen };
}
