/** Bounded, secret-free security records. Do not pass request bodies, identities, or exceptions. */
export function auditEvent(code: string, status: number, requestId: string) {
  // Sample repeated flood denials to keep logging from becoming a resource attack.
  if ((status === 429 || status === 413 || status === 403) && !requestId.endsWith("0")) return;
  console.warn(JSON.stringify({ event: "security", code, status, requestId }));
}
