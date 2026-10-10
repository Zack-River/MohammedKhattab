export const offerConfig = {
  // The reference uses a visitor-specific five-day window.
  // Set an ISO timestamp with timezone for a shared campaign deadline instead.
  endsAt: process.env.NEXT_PUBLIC_DISCOUNT_ENDS_AT ?? null,
  durationSeconds: 4 * 24 * 60 * 60 + 23 * 60 * 60 + 58 * 60 + 40,
  storageKey: "khatab-discount-deadline-v1",
  tickMs: 1000,
} as const;
