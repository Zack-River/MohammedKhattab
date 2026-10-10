export function readRoadmapGeometry(timeline: HTMLElement, endInset: number) {
  const rect = timeline.getBoundingClientRect();
  if (rect.bottom < 0 || rect.top > window.innerHeight) return;
  const markers = Array.from(timeline.querySelectorAll<HTMLElement>(".timeline-marker"));
  if (!markers.length) return;
  const centers = markers.map((marker) => {
    const box = marker.getBoundingClientRect();
    return box.top + box.height / 2;
  });
  const lastCard = timeline.querySelector<HTMLElement>(".day-item:last-child .day-card");
  const start = centers[0];
  const end = lastCard ? lastCard.getBoundingClientRect().bottom - endInset : centers[centers.length - 1];
  return { top: start - rect.top, start, centers, height: Math.max(1, end - start) };
}
