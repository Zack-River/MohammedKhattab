/** Return a finite clamped value, or null when either boundary is invalid. */
export function boundedNumber(value: number, maximum: number): number | null {
  if (!Number.isFinite(value) || !Number.isFinite(maximum) || maximum < 0) return null;
  return Math.max(0, Math.min(maximum, value));
}
