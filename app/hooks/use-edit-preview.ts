import { useEffect, useRef, useState } from "react";
import { motionSettings } from "@/app/config/motion";
import { readLengthToken } from "@/app/lib/design-tokens";
import { useReducedMotion } from "./use-reduced-motion";

export function useEditPreview(selectionKey?: string) {
  const [edited, setEdited] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const interacted = useRef(false);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    const preview = previewRef.current;
    if (!preview || reducedMotion || !interacted.current) return;
    let cancelled = false;
    let controls: ReturnType<typeof import("motion/mini").animate> | undefined;
    // Motion's mini engine is downloaded only after an actual interaction.
    void import("motion/mini")
      .then(({ animate }) => {
        if (cancelled) return;
        preview.dataset.demoAnimation = "running";
        controls = animate(
          preview,
          {
            opacity: [0.4, 1],
            transform: [
              `translateY(${readLengthToken("--motion-reveal-small")}px)`,
              "translateY(0px)",
            ],
          },
          {
            duration: motionSettings.demo.duration,
            ease: [...motionSettings.demo.easing],
          },
        );
        void controls.finished.then(() => {
          if (!cancelled) {
            preview.dataset.demoAnimation = "complete";
            controls?.cancel();
            preview.style.removeProperty("transform");
            preview.style.removeProperty("opacity");
          }
        });
      })
      .catch((error: unknown) => {
        if (!cancelled) console.error("Could not animate edit preview", error);
      });
    return () => {
      cancelled = true;
      controls?.cancel();
      preview.style.removeProperty("transform");
      preview.style.removeProperty("opacity");
      delete preview.dataset.demoAnimation;
    };
  }, [edited, reducedMotion, selectionKey]);
  const choose = (next: boolean) => {
    interacted.current = true;
    setEdited(next);
  };
  return { edited, choose, previewRef };
}
