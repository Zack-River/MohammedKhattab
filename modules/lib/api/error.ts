export class ApiError extends Error {
  constructor(public readonly status: number, public readonly code: string, public readonly retryAfter?: number) { super(code); }
}
