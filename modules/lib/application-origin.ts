export function applicationOrigin() {
  const value = process.env.APP_ORIGIN;
  if (!value) throw new Error("SUPABASE_NOT_CONFIGURED");
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol) || url.pathname !== "/" || url.search || url.hash)
    throw new Error("SUPABASE_NOT_CONFIGURED");
  return url.origin;
}
