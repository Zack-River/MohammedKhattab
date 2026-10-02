import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { useReducedMotion } from "./use-reduced-motion";

// Native carousel: cache geometry on resize, never read it during scroll.
export function useHorizontalShowcase(
  rootRef: RefObject<HTMLDivElement | null>,
  count: number,
) {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const currentIndex = useRef(0);
  const navigateRef = useRef<((index: number) => void) | null>(null);
  useEffect(() => {
    const root = rootRef.current;
    const viewport = root?.querySelector<HTMLElement>(
      "[data-showcase-viewport]",
    );
    const track = root?.querySelector<HTMLElement>("[data-showcase-track]");
    if (!root || !viewport || !track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    let positions: number[] = [];
    const onScroll = () => {
      let nearest = 0;
      positions.forEach((position, candidate) => {
        if (
          Math.abs(position - viewport.scrollLeft) <
          Math.abs(positions[nearest] - viewport.scrollLeft)
        )
          nearest = candidate;
      });
      if (nearest !== currentIndex.current) {
        currentIndex.current = nearest;
        setIndex(nearest);
      }
    };
    const measure = () => {
      const distance = Math.max(0, track.scrollWidth - viewport.clientWidth);
      positions = cards.map((card) => Math.min(card.offsetLeft, distance));
      onScroll();
    };
    measure();
    navigateRef.current = (next) =>
      viewport.scrollTo({
        left: positions[next],
        behavior: reducedMotion ? "instant" : "smooth",
      });
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    viewport.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      viewport.removeEventListener("scroll", onScroll);
      navigateRef.current = null;
    };
  }, [rootRef, count, reducedMotion]);
  const goTo = useCallback(
    (next: number) =>
      navigateRef.current?.(Math.max(0, Math.min(count - 1, next))),
    [count],
  );
  return { index, goTo };
}
