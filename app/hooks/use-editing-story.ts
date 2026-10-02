import { useEffect, type RefObject } from "react";
import { motionSettings } from "@/app/config/motion";
import { useMediaQuery } from "./use-media-query";
import { useReducedMotion } from "./use-reduced-motion";

function storyQuery() {
  const css = getComputedStyle(document.documentElement);
  return `(min-width: ${css.getPropertyValue("--breakpoint-lg").trim()}) and (min-height: ${css.getPropertyValue("--motion-story-min-height").trim()})`;
}

export function useEditingStory(rootRef: RefObject<HTMLDivElement | null>) {
  const reducedMotion = useReducedMotion();
  const desktop = useMediaQuery(storyQuery);
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion || !desktop) return;
    let cancelled = false;
    let context: { revert: () => void } | undefined;
    const originalStyles = new Map<HTMLElement | SVGElement, string | null>();
    const restore = () =>
      originalStyles.forEach((style, element) => {
        if (style === null) element.removeAttribute("style");
        else element.setAttribute("style", style);
      });
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        void Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
          document.fonts.ready,
        ])
          .then(([{ gsap }, { ScrollTrigger }]) => {
            if (cancelled) return;
            gsap.registerPlugin(ScrollTrigger);
            root
              .querySelectorAll<
                HTMLElement | SVGElement
              >("[data-edit-frame], [data-edit-cut], [data-edit-audio], [data-edit-caption], [data-edit-ready], [data-edit-spool]")
              .forEach((element) =>
                originalStyles.set(element, element.getAttribute("style")),
              );
            context = gsap.context(() => {
              const select = gsap.utils.selector(root);
              const settings = motionSettings.editingStory;
              const timeline = gsap.timeline({
                defaults: { ease: "none", duration: settings.duration },
                scrollTrigger: {
                  trigger: root,
                  start: settings.start,
                  end: settings.end,
                  scrub: settings.scrub,
                  invalidateOnRefresh: true,
                },
              });
              timeline
                .addLabel("idea")
                .fromTo(
                  select("[data-edit-frame]"),
                  {
                    rotation: settings.roughRotation,
                    scale: settings.roughScale,
                  },
                  { rotation: 0, scale: 1 },
                  "idea",
                )
                .fromTo(
                  select("[data-edit-cut]"),
                  { scaleX: 0.3 },
                  { scaleX: 1 },
                  "idea",
                )
                .addLabel("rhythm")
                .fromTo(
                  select("[data-edit-audio]"),
                  { scaleY: 0.1, opacity: 0.3 },
                  { scaleY: 1, opacity: 1 },
                  "rhythm",
                )
                .fromTo(
                  select("[data-edit-caption]"),
                  { yPercent: settings.enterYPercent, opacity: 0 },
                  { yPercent: 0, opacity: 1 },
                  "rhythm",
                )
                .addLabel("ready")
                .fromTo(
                  select("[data-edit-ready]"),
                  { scale: 0.7, rotation: -settings.roughRotation, opacity: 0 },
                  { scale: 1, rotation: 0, opacity: 1 },
                  "ready",
                )
                .fromTo(
                  select("[data-edit-spool]"),
                  { rotation: 0 },
                  { rotation: settings.rotation },
                  0,
                );
              // CSS sticky owns layout; this timeline never pins or adds spacers.
            }, root);
          })
          .catch((error: unknown) => {
            context?.revert();
            restore();
            if (!cancelled)
              console.error("Could not initialize editing story", error);
          });
      },
      {
        // Prepare the desktop scene before the reader reaches it. Loading the
        // engine at the visible edge competes with the first scrolling frames.
        rootMargin: `${window.innerHeight * motionSettings.editingStory.preloadViewportRatio}px 0px`,
      },
    );
    observer.observe(root);
    return () => {
      cancelled = true;
      observer.disconnect();
      context?.revert();
      restore();
    };
  }, [rootRef, desktop, reducedMotion]);
}
