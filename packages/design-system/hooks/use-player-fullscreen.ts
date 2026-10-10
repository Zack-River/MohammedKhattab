"use client";
import { useCallback, useEffect, useState, type RefObject } from "react";
export function usePlayerFullscreen(ref: RefObject<HTMLElement | null>) {
  const [fullscreen, setFullscreen] = useState(false);
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    const update = () => {
      setFullscreen(document.fullscreenElement === ref.current);
      setSupported(
        Boolean(document.fullscreenEnabled && ref.current?.requestFullscreen),
      );
    };
    document.addEventListener("fullscreenchange", update);
    update();
    return () => document.removeEventListener("fullscreenchange", update);
  }, [ref]);
  const enterFullscreen = useCallback(async () => {
    const element = ref.current;
    if (!element?.requestFullscreen || !document.fullscreenEnabled) return;
    try {
      if (document.fullscreenElement !== element)
        await element.requestFullscreen();
      element.focus({ preventScroll: true });
    } catch {
      /* Keep inline playback usable if browser policy rejects fullscreen. */
    }
  }, [ref]);
  const exitFullscreen = useCallback(async () => {
    if (document.fullscreenElement !== ref.current) return;
    try { await document.exitFullscreen(); } catch { /* Already exiting. */ }
  }, [ref]);
  const toggleFullscreen = async () => {
    if (document.fullscreenElement === ref.current) await exitFullscreen();
    else await enterFullscreen();
  };
  return { fullscreen, supported, toggleFullscreen, enterFullscreen, exitFullscreen };
}
