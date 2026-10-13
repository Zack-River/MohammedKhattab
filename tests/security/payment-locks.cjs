/* eslint-disable @typescript-eslint/no-require-imports -- Isolated database concurrency regression. */
const assert = require('node:assert/strict');
const { Client } = require('pg');
async function waitForLock(observer, pid) {
  for (let i = 0; i < 100; i++) {
    const result = await observer.query('select wait_event_type from pg_stat_activity where pid=$1', [pid]);
    if (result.rows[0]?.wait_event_type === 'Lock') return;
    await new Promise(resolve => setTimeout(resolve, 20));
  }
  throw new Error('Settlement did not reach the concurrency barrier');
}
module.exports = async function paymentLocks({ connectionString, user, slug, order, intent }) {
  const a = new Client({ connectionString }), b = new Client({ connectionString });
  await a.connect(); await b.connect();
  try {
    await a.query('begin');
    // Commerce serializes all purchases for a user, including overlapping bundles.
    // Hold the actual RPC lock before contacts; the retired per-course key inverted that order.
    await a.query('select pg_advisory_xact_lock(hashtextextended($1,0))', ['commerce:' + user]);
    await a.query('select 1 from public.account_contacts where user_id=$1 for update', [user]);
    const settling = b.query('select public.settle_course_payment($1,$2,999001,120000,\'EGP\')', [order, intent]).then(() => null, e => e);
    await waitForLock(a, b.processID);
    let checkoutError;
    try { await a.query('select public.begin_course_payment($1,$2,false)', [user, slug]); }
    catch (error) { checkoutError = error; }
    await a.query(checkoutError ? 'rollback' : 'commit');
    const settlementError = await settling;
    assert.equal(checkoutError?.code, undefined, 'Checkout must not deadlock against settlement');
    assert.equal(settlementError?.code, undefined, 'Settlement must not deadlock against checkout');
  } finally { await a.query('rollback'); await a.end(); await b.end(); }
};
