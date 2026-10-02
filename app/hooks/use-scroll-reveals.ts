import { useEffect, useRef, type RefObject } from "react";
import { getRevealProfile, motionSettings } from "../config/motion";
import { readLengthToken } from "../lib/design-tokens";
import { useReducedMotion } from "./use-reduced-motion";

// One observer and native animations replace dozens of persistent scroll triggers.
export function useScrollReveals(
  rootRef: RefObject<HTMLDivElement | null>,
): void {
  const reducedMotion = useReducedMotion();
  const revealed = useRef(new WeakSet<Element>());
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;
    const animations = new Set<Animation>();
    const targets: HTMLElement[] = [];
    const entries = new Map<Element, (() => void)[]>();
    const observer = new IntersectionObserver(
      (changes) => {
        changes.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          entries.get(entry.target)?.forEach((enter) => enter());
        });
      },
      { rootMargin: `0px 0px ${motionSettings.reveal.viewportInset} 0px` },
    );

    root.querySelectorAll<HTMLElement>("[data-motion]").forEach((group) => {
      const profile = getRevealProfile(group.dataset.motion);
      if (!profile) return;
      const items =
        profile.children || group.hasAttribute("data-motion-children")
          ? Array.from(group.children).filter(
              (item): item is HTMLElement => item instanceof HTMLElement,
            )
          : [group];
      const distance =
        readLengthToken(profile.distanceToken) * (profile.direction ?? 1);
      items.forEach((element, index) => {
        targets.push(element);
        if (
          revealed.current.has(element) ||
          element.getBoundingClientRect().bottom <= 0
        ) {
          element.dataset.revealState = "visible";
          return;
        }
        const transform = `translate${profile.axis === "x" ? "X" : "Y"}(${distance}px) scale(${profile.scale ?? 1})`;
        const initialOpacity = profile.immediate ? 1 : 0;
        element.style.opacity = String(initialOpacity);
        element.style.transform = transform;
        element.dataset.revealState = "waiting";
        const enter = () => {
          element.dataset.revealState = "entering";
          const animation = element.animate(
            [
              { opacity: initialOpacity, transform },
              { opacity: 1, transform: "none" },
            ],
            {
              duration: profile.duration * 1000,
              delay:
                ((profile.delay ?? 0) +
                  (profile.children === "group" ? index : index % 3) *
                    (profile.stagger ?? 0)) *
                1000,
              easing: motionSettings.reveal.easing,
              fill: "both",
            },
          );
          animations.add(animation);
          animation.onfinish = () => {
            element.style.removeProperty("opacity");
            element.style.removeProperty("transform");
            element.dataset.revealState = "visible";
            revealed.current.add(element);
            animations.delete(animation);
            animation.cancel();
          };
        };
        if (profile.immediate) enter();
        else {
          const trigger = profile.children === "group" ? group : element;
          entries.set(trigger, [...(entries.get(trigger) ?? []), enter]);
          observer.observe(trigger);
        }
      });
    });
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      targets.forEach((element) => {
        element.style.removeProperty("opacity");
        element.style.removeProperty("transform");
        delete element.dataset.revealState;
      });
    };
  }, [rootRef, reducedMotion]);
}
