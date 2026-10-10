export function readRoadmapOptions() {
  const theme = getComputedStyle(document.documentElement);
  return {
    activation: Number(theme.getPropertyValue("--timeline-activation")),
    endInset: parseFloat(theme.getPropertyValue("--timeline-end-inset")),
    milestoneOffset: Number(theme.getPropertyValue("--timeline-milestone-offset")),
  };
}
