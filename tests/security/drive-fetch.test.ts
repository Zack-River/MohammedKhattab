import assert from "node:assert/strict";
import { test } from "node:test";
import { fetchDrive } from "../../modules/lib/security/drive-fetch";
test("Drive redirects cannot reach loopback, metadata, or arbitrary hosts", async () => {
  const original = globalThis.fetch;
  try {
    for (const location of ["http://127.0.0.1/private", "http://169.254.169.254/latest/meta-data", "https://evil.example/video", "https://drive.usercontent.google.com@evil.example/video"]) {
      let calls = 0;
      globalThis.fetch = async () => { calls++; return new Response(null, { status: 302, headers: { location } }); };
      await assert.rejects(fetchDrive(new URL("https://drive.usercontent.google.com/download"), {}, new AbortController().signal), { status: 503 });
      assert.equal(calls, 1, "Unsafe redirect must be rejected before the second fetch");
    }
  } finally { globalThis.fetch = original; }
});
test("Drive CDN redirects retain ranges and stream cancellation", async () => {
  const original = globalThis.fetch;
  const controller = new AbortController();
  const requests: RequestInit[] = [];
  try {
    globalThis.fetch = async (_url, options) => {
      requests.push(options!);
      return requests.length === 1 ? new Response(null, { status: 302, headers: { location: "https://doc-00.googleusercontent.com/video" } }) : new Response("video", { status: 206 });
    };
    const result = await fetchDrive(new URL("https://drive.usercontent.google.com/download"), { Range: "bytes=0-1023" }, controller.signal);
    assert.equal(result.status, 206);
    assert.equal(requests[1].redirect, "manual");
    assert.deepEqual(requests[1].headers, { Range: "bytes=0-1023" });
    controller.abort();
    assert.equal(requests[1].signal?.aborted, true);
  } finally { globalThis.fetch = original; }
});
test("redirect loops have a finite request budget", async () => {
  const original = globalThis.fetch;
  let calls = 0;
  try {
    globalThis.fetch = async () => { calls++; return new Response(null, { status: 302, headers: { location: "/again" } }); };
    await assert.rejects(fetchDrive(new URL("https://drive.usercontent.google.com/download"), {}, new AbortController().signal), { status: 503 });
    assert.equal(calls, 4);
  } finally { globalThis.fetch = original; }
});
