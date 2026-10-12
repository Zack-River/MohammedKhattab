import assert from "node:assert/strict";
import test from "node:test";
import { readCheckoutLink } from "../../modules/features/payments/helpers/read-checkout-link";

const intent_key = "550e8400-e29b-41d4-a716-446655440000";
const origin = "https://app.fawaterk.com";
test("Accept Fawaterak short checkout links and retain Arabic language", () => {
  const url = `${origin}/ts/a1b2c?lg=ar`;
  assert.deepEqual(readCheckoutLink({ intent_key, url }, origin), { intentKey: intent_key, url });
});
test("Accept full checkout links and staging URLs on their own origin", () => {
  for (const host of [origin, "https://staging.fawaterk.com"])
    assert.equal(readCheckoutLink({ intent_key, url: `${host}/transactions/${intent_key}` }, host).intentKey, intent_key);
});
test("Reject foreign origins, credentials, invalid intents, and unrelated paths", () => {
  for (const url of ["not a URL", "javascript:alert(1)", "https://evil.example/ts/a", "https://app.fawaterk.com.evil.example/ts/a", "https://user:password@app.fawaterk.com/ts/a", `${origin}/ts/`, `${origin}/transactions/a/extra`, `${origin}/unrelated/a`, "http://app.fawaterk.com/ts/a", "https://staging.fawaterk.com/ts/a"])
    assert.throws(() => readCheckoutLink({ intent_key, url }, origin), { code: "PAYMENTS_UNAVAILABLE" });
  assert.throws(() => readCheckoutLink({ intent_key: "invalid", url: `${origin}/ts/a` }, origin), { code: "PAYMENTS_UNAVAILABLE" });
});
