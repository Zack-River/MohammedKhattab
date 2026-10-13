// This preloader is used only by the isolated live-readiness acceptance server.
if (!/^http:\/\/127\.0\.0\.1:/.test(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "")) throw new Error("Local database required");
const original = globalThis.fetch;
globalThis.fetch = (input, options) => {
  const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
  if (["app.fawaterk.com", "staging.fawaterk.com"].includes(url.hostname)) throw new Error("Live provider network access disabled in acceptance tests");
  return original(input, options);
};
