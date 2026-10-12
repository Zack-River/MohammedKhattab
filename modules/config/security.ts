/** Central resource budgets, shared by proxy, body readers, and upstream fetches. */
export const securityPolicy = {
  bodyTimeoutMs: 10_000,
  uploadBodyTimeoutMs: 30_000,
  budgetTimeoutMs: 3_000,
  upstreamHeadersTimeoutMs: 15_000,
  maxUrlLength: 2_048,
  maxRangeLength: 80,
  maxRedirects: 3,
  page: { limit: 600, seconds: 60 },
  api: { limit: 600, seconds: 60 },
  auth: { limit: 30, seconds: 900 },
  email: { limit: 8, seconds: 900 },
  upload: { limit: 15, seconds: 60 },
  mutation: { limit: 120, seconds: 60 },
  webhook: { limit: 300, seconds: 60 },
} as const;
