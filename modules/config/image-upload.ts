/** Shared browser/server image rules; visual values remain in the theme. */
export const imageUploadPolicy = {
  maxBytes: 3 * 1024 * 1024,
  maxRequestBytes: 3 * 1024 * 1024 + 64 * 1024,
  accept: "image/jpeg,image/png,image/webp", formats: "jpg,png,webp", timeoutMs: 20000,
  avatarTransform: "c_fill,g_auto,h_512,w_512/fl_strip_profile",
  thumbnailTransform: "c_limit,h_2048,w_2048/fl_strip_profile",
} as const;
