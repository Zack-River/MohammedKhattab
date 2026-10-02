import { useEffect, useRef } from "react";
import { motionSettings } from "@/app/config/motion";
import { useReducedMotion } from "./use-reduced-motion";

export function useCountUp(target: number, prefix: string, suffix: string) {
  const reducedMotion = useReducedMotion();
  const completedTarget = useRef<string | null>(null);
  const elementRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const key = `${target}|${prefix}|${suffix}`;
    const format = (value: number) => `${prefix}${value}${suffix}`;
    if (reducedMotion || completedTarget.current === key) {
      element.textContent = format(target);
      return;
    }
    let frame = 0;
    let lastValue = target;
    const write = (value: number) => {
      if (value === lastValue) return;
      lastValue = value;
      element.textContent = format(value);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        write(0);
        let start: number | undefined;
        const animate = (time: number) => {
          start ??= time;
          const progress = Math.min(
            (time - start) / motionSettings.countUp.durationMs,
            1,
          );
          write(Math.floor(target * (1 - (1 - progress) ** 3)));
          if (progress < 1) frame = requestAnimationFrame(animate);
          else {
            completedTarget.current = key;
            write(target);
          }
        };
        frame = requestAnimationFrame(animate);
      },
      { threshold: motionSettings.countUp.visibilityThreshold },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, prefix, suffix, reducedMotion]);
  return elementRef;
}
