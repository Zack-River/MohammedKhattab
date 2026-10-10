export type PlayerIconName =
  | "play"
  | "pause"
  | "replay"
  | "volume"
  | "muted"
  | "fullscreen"
  | "exit-fullscreen";
const paths: Record<PlayerIconName, string> = {
  play: "M8 5v14l11-7z",
  pause: "M6 5h4v14H6zM14 5h4v14h-4z",
  replay: "M12 5a7 7 0 1 1-6.7 9H3.2A9 9 0 1 0 12 3V0L7 4l5 4V5z",
  volume:
    "M3 9v6h4l5 4V5L7 9H3zm12-1a6 6 0 0 1 0 8v-3a3 3 0 0 0 0-2V8zm3-3a10 10 0 0 1 0 14v-3a7 7 0 0 0 0-8V5z",
  muted:
    "M3 9v6h4l5 4V5L7 9H3zm12-1 3 3 3-3 1 1-3 3 3 3-1 1-3-3-3 3-1-1 3-3-3-3 1-1z",
  fullscreen:
    "M3 3h7v2H5v5H3V3zm11 0h7v7h-2V5h-5V3zM3 14h2v5h5v2H3v-7zm16 0h2v7h-7v-2h5v-5z",
  "exit-fullscreen":
    "M8 3h2v7H3V8h5V3zm6 0h2v5h5v2h-7V3zM3 14h7v7H8v-5H3v-2zm11 0h7v2h-5v5h-2v-7z",
};
export default function PlayerIcon({ name }: { name: PlayerIconName }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={paths[name]} />
    </svg>
  );
}
