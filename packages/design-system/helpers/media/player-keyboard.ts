import type { KeyboardEvent } from "react";
import type { PlayerController } from "../../types/video-player";
import { playerPolicy } from "../../config/player";
export function handlePlayerKey(event: KeyboardEvent, controller: PlayerController, toggleFullscreen: () => Promise<void>) {
  if (event.target instanceof Element && event.target.closest("button,input,select,a")) return;
  if (event.altKey || event.ctrlKey || event.metaKey || !controller.snapshot.ready) return;
  const actions: Record<string, () => void> = {
    " ": controller.toggle,
    k: controller.toggle,
    arrowleft: () => controller.seek(controller.snapshot.time - playerPolicy.seekStepSeconds),
    arrowright: () => controller.seek(controller.snapshot.time + playerPolicy.seekStepSeconds),
    m: controller.toggleMute,
    f: () => void toggleFullscreen(),
  };
  const action = actions[event.key.toLowerCase()];
  if (action) {
    event.preventDefault();
    action();
  }
}
