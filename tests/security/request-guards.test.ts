import assert from "node:assert/strict";
import { test } from "node:test";
import { readRequestBytes } from "../../modules/lib/read-request-bytes";
import { sameOrigin, readJson } from "../../modules/lib/server-request";
import { clientAddress } from "../../modules/lib/security/client-address";
import { validMediaRange } from "../../modules/lib/security/media-range";
import { contentPolicy } from "../../modules/lib/security/content-policy";
import { ratePolicy } from "../../modules/lib/security/rate-policy";
function streaming(body: ReadableStream<Uint8Array>) {
  return new Request("http://localhost/body", { method: "POST", body, duplex: "half" } as RequestInit);
}
test("chunked oversized requests cannot bypass the size cap", async () => {
  const request = streaming(new ReadableStream({ start(c) { c.enqueue(new Uint8Array(9)); c.enqueue(new Uint8Array(9)); c.close(); } }));
  await assert.rejects(readRequestBytes(request, 16), { status: 413, code: "REQUEST_TOO_LARGE" });
});
test("stalled bodies and cancellation hooks cannot hold readers indefinitely", async () => {
  const request = streaming(new ReadableStream({ cancel: () => new Promise(() => undefined) }));
  const keepAlive = setTimeout(() => undefined, 1000);
  try { await assert.rejects(readRequestBytes(request, 16, 30), { status: 408, code: "REQUEST_TIMEOUT" }); }
  finally { clearTimeout(keepAlive); }
});
test("malformed Content-Length is rejected", async () => {
  const request = new Request("http://localhost/body", { method: "POST", body: "{}", headers: { "content-length": "NaN" } });
  await assert.rejects(readRequestBytes(request, 16), { status: 413 });
});
test("JSON errors preserve resource denial and non-JSON forms are rejected", async () => {
  assert.equal(await readJson(new Request("http://localhost/body", { method: "POST", body: "{}" })), null);
  await assert.rejects(readJson(new Request("http://localhost/body", { method: "POST", body: "x".repeat(17000), headers: { "content-type": "application/json" } })), { status: 413 });
});
test("CSRF cannot trust a forged Host header or cross-site fetch metadata", () => {
  const saved = process.env.APP_ORIGIN;
  process.env.APP_ORIGIN = "https://ta3allam.vercel.app";
  try {
    assert.equal(sameOrigin(new Request("https://ta3allam.vercel.app/api", { headers: { host: "evil.example", origin: "https://evil.example" } })), false);
    assert.equal(sameOrigin(new Request("https://ta3allam.vercel.app/api", { headers: { "sec-fetch-site": "cross-site" } })), false);
    assert.equal(sameOrigin(new Request("https://ta3allam.vercel.app/api", { headers: { origin: "http://ta3allam.vercel.app" } })), false);
    assert.equal(sameOrigin(new Request("https://ta3allam.vercel.app/api", { headers: { origin: "https://ta3allam.vercel.app" } })), true);
  } finally { if (saved === undefined) delete process.env.APP_ORIGIN; else process.env.APP_ORIGIN = saved; }
});
test("untrusted forwarded headers cannot rotate the local limiter identity", () => {
  assert.equal(clientAddress(new Headers({ "x-forwarded-for": "1.1.1.1", "x-vercel-forwarded-for": "2.2.2.2" }), false), "local-ingress");
  assert.equal(clientAddress(new Headers({ "x-vercel-forwarded-for": "1.1.1.1, 2.2.2.2" }), true), "unknown-ingress");
  assert.equal(clientAddress(new Headers({ "x-vercel-forwarded-for": "1.1.1.1" }), true), "1.1.1.1");
});
test("invalid and excessive byte ranges are rejected", () => {
  for (const range of ["bytes=-", "bytes=-0", "bytes=5-1", "bytes=0-1,3-4", "bytes=9007199254740992-"]) assert.equal(validMediaRange(range), false, range);
  for (const range of ["bytes=0-", "bytes=0-1023", "bytes=-1024"]) assert.equal(validMediaRange(range), true, range);
});
test("CSP restricts scripts, framing, objects, and form submissions", () => {
  const policy = contentPolicy("test-nonce");
  assert.match(policy, /script-src 'self' 'nonce-test-nonce' 'strict-dynamic'/);
  assert.match(policy, /frame-ancestors 'none'/);
  assert.match(policy, /object-src 'none'/);
  assert.match(policy, /form-action 'self'/);
});
test("sensitive actions have independent budgets", () => {
  assert.equal(ratePolicy("/api/auth/login", "POST").name, "auth");
  assert.equal(ratePolicy("/api/account/verification", "POST").name, "email");
  assert.equal(ratePolicy("/api/media/images", "POST").name, "upload");
  assert.equal(ratePolicy("/api/payments/fawaterak/webhook_json", "POST").name, "webhook");
});
