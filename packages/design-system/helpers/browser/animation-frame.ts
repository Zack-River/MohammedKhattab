/** Coalesce events and release scheduled work when its owning effect ends. */
export function createFrameScheduler(update: () => void) {
  let frame = 0, disposed = false;
  const schedule = () => {
    if (!disposed && !frame) frame = requestAnimationFrame(() => {
      frame = 0;
      update();
    });
  };
  const dispose = () => {
    disposed = true;
    cancelAnimationFrame(frame);
  };
  return { schedule, dispose };
}
