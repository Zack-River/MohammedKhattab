import { playerPolicy } from "../../config/player";
import type { PlayerSnapshot } from "../../types/video-player";
export function initialPlayerSnapshot(): PlayerSnapshot {
  return { status: "loading", ready: false, time: 0, duration: 0,
    volume: playerPolicy.initialVolume, muted: false };
}
