export interface DismissalOptions {
  root: HTMLElement;
  onClose: () => void;
  toggle?: HTMLElement | null;
  desktopQuery?: string;
  restoreFocus?: boolean;
}
/** Subscribe only while open; the owner controls state and supplies layout policy. */
export function subscribeDismissal({ root, toggle, onClose, desktopQuery, restoreFocus = true }: DismissalOptions) {
  const media = desktopQuery ? window.matchMedia(desktopQuery) : undefined;
  const key = (event: KeyboardEvent) => {
    if (event.key !== "Escape") return;
    onClose();
    if (restoreFocus) toggle?.focus();
  };
  const outside = (event: PointerEvent) => {
    if (event.target instanceof Node && !root.contains(event.target) && !toggle?.contains(event.target)) onClose();
  };
  const desktop = () => { if (media?.matches) onClose(); };
  document.addEventListener("keydown", key);
  document.addEventListener("pointerdown", outside);
  media?.addEventListener("change", desktop);
  return () => {
    document.removeEventListener("keydown", key);
    document.removeEventListener("pointerdown", outside);
    media?.removeEventListener("change", desktop);
  };
}
