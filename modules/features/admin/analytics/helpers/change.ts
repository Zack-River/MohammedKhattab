export function periodChange(current: number, previous: number) {
  if (previous === 0) return { direction: current === 0 ? "flat" : "new", percent: null } as const;
  const difference = current - previous;
  return { direction: difference === 0 ? "flat" : difference > 0 ? "up" : "down", percent: Math.abs(difference / previous * 100) } as const;
}
