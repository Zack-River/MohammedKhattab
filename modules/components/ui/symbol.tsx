import type { ComponentPropsWithoutRef } from "react";
const paths = {
  home: "m3 10 9-7 9 7v11h-6v-7H9v7H3V10z",
  grid: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  book: "M4 3h6a3 3 0 0 1 3 3v15a4 4 0 0 0-4-2H4V3zm16 0h-4a3 3 0 0 0-3 3v15a4 4 0 0 1 4-2h3V3z",
  folder: "M3 7V4h6l3 3h9v13H3V7z",
  award: "M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm-4-1-2 7 6-3 6 3-2-7",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8 9a8 8 0 0 1 16 0",
  play: "m9 5 10 7-10 7V5z",
  check: "m5 12 4 4L19 6",
  arrow: "M20 12H4m6-6-6 6 6 6",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm0-16v6l4 2",
  search: "M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm6-2 6 6",
  menu: "M3 6h18M3 12h18M3 18h18",
  close: "m5 5 14 14M19 5 5 19",
  download: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5",
  spark: "m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7",
} as const;
export type SymbolName = keyof typeof paths;
export default function Symbol({
  name,
  className,
  ...props
}: { name: SymbolName } & ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      className={["lms-icon", className].filter(Boolean).join(" ")}
      data-icon={name}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}
