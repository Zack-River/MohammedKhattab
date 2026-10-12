/** Provider identifiers are opaque text, independent of our UUID order IDs. */
export const isPaymentIntentKey = (value: unknown): value is string =>
  typeof value === "string" && /^[a-zA-Z0-9_-]{1,128}$/.test(value);
