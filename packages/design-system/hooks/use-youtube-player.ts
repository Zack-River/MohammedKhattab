"use client";
import { useEffect, useRef, useState, type RefObject } from "react";
import type { YouTubePlayerInstance } from "../types/video-player";
import { initialPlayerSnapshot } from "../helpers/media/initial-snapshot";
import { mountYouTubePlayer } from "../helpers/media/youtube/mount";
import { toggleYouTubePlayer } from "../helpers/media/youtube/toggle";
import { seekYouTubePlayer } from "../helpers/media/youtube/seek";
import { toggleYouTubeMute } from "../helpers/media/youtube/toggle-mute";
import { setYouTubeVolume } from "../helpers/media/youtube/set-volume";
export function useYouTubePlayer(hostRef: RefObject<HTMLDivElement | null>, url: string, title: string, callbacks: { onPlay?: () => void; onEnded?: () => void } = {}) {
  const { onPlay, onEnded } = callbacks;
  const playerRef = useRef<YouTubePlayerInstance | null>(null);
  const [snapshot, setSnapshot] = useState(initialPlayerSnapshot);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const host = hostRef.current;
    if (host) return mountYouTubePlayer({ host, url, title, session: { disposed: false, playerRef, publish: setSnapshot, onPlay, onEnded } });
  }, [hostRef, url, title, attempt, onPlay, onEnded]);
  return {
    snapshot,
    toggle: () => toggleYouTubePlayer(playerRef.current, snapshot),
    seek: (time: number) => seekYouTubePlayer(playerRef.current, snapshot.duration, time, setSnapshot),
    toggleMute: () => toggleYouTubeMute(playerRef.current, setSnapshot),
    volume: (value: number) => setYouTubeVolume(playerRef.current, value, setSnapshot),
    retry: () => {
      setSnapshot(initialPlayerSnapshot());
      setAttempt((value) => value + 1);
    },
  };
}
