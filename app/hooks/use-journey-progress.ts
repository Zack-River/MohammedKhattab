import { useEffect, useState, type RefObject } from "react";
import { journeyChapters } from "@/app/data/journey";

export function useJourneyProgress(rootRef: RefObject<HTMLDivElement | null>) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const next = journeyChapters.findIndex(
            (chapter) => chapter.id === entry.target.id,
          );
          if (next >= 0) setIndex(next);
        });
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    journeyChapters.forEach((chapter) => {
      const section = root.querySelector(`#${chapter.id}`);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, [rootRef]);
  return index;
}
