/** Nonce-authorized scripts; inline styles remain necessary for charts and motion. */
export function contentPolicy(nonce: string) {
  const development = process.env.NODE_ENV !== "production";
  const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const backend = supabase ? new URL(supabase).origin : "";
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${development ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://res.cloudinary.com https://i.ytimg.com https://img.youtube.com",
    "font-src 'self'",
    `connect-src 'self' ${backend}${development ? " ws: http://localhost:* http://127.0.0.1:*" : ""}`,
    "media-src 'self' blob: https://drive.google.com https://drive.usercontent.google.com https://*.googleusercontent.com",
    "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(development ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
}
