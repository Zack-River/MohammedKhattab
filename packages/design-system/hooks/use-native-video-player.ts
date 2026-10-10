"use client";
import { useEffect, useState, type RefObject } from "react";
import { initialPlayerSnapshot } from "../helpers/media/initial-snapshot";
import { subscribeNativePlayer } from "../helpers/media/native/subscribe";
import { toggleNativeVideo } from "../helpers/media/native/toggle";
import { seekNativeVideo } from "../helpers/media/native/seek";
import { toggleNativeMute } from "../helpers/media/native/toggle-mute";
import { setNativeVolume } from "../helpers/media/native/set-volume";
import { retryNativeVideo } from "../helpers/media/native/retry";
import type { PlayerController } from "../types/video-player";
export function useNativeVideoPlayer(ref: RefObject<HTMLVideoElement | null>, sourceUrl: string): PlayerController {
  const [snapshot, setSnapshot] = useState(initialPlayerSnapshot);
  useEffect(() => {
    const video = ref.current;
    if (video) return subscribeNativePlayer({ video, sourceUrl, publish: setSnapshot });
  }, [ref, sourceUrl]);
  return {
    snapshot,
    toggle: () => toggleNativeVideo(() => ref.current, setSnapshot),
    seek: (time) => seekNativeVideo(ref.current, time, setSnapshot),
    toggleMute: () => toggleNativeMute(ref.current),
    volume: (value) => setNativeVolume(ref.current, value),
    retry: () => retryNativeVideo(() => ref.current, setSnapshot),
  };
}
