import { preload } from "react-dom";

/** Register resource hints during server rendering, including streamed layouts. */
export default function FontPreloads({
  assets,
}: {
  assets: readonly string[];
}) {
  for (const href of assets) {
    preload(href, { as: "font", type: "font/ttf", crossOrigin: "anonymous" });
  }
  return null;
}
