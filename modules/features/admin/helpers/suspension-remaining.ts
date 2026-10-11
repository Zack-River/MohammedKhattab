export function suspensionRemaining(until: string, now: number) {
  const minutes = Math.max(0, Math.ceil((Date.parse(until) - now) / 60000));
  return { days: Math.floor(minutes / 1440), hours: Math.floor(minutes % 1440 / 60), minutes: minutes % 60, expired: minutes === 0 };
}
