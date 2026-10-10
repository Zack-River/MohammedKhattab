import { playerPolicy } from "./player";
export const youtubePlayerPolicy = {
  apiUrl: "https://www.youtube.com/iframe_api",
  scriptId: "khatab-youtube-api",
  timeoutMs: 15000,
  sampleMs: 250,
  ...playerPolicy,
} as const;
