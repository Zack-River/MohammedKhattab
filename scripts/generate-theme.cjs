/* eslint-disable @typescript-eslint/no-require-imports -- Build-time generation from canonical CSS; no runtime source parsing. */
const fs = require("node:fs");
const path = require("node:path");
const {
  parseTokens,
  resolveToken,
} = require("../packages/design-system/lib/theme.cjs");
const root = path.resolve(__dirname, "..");
const base = fs.readFileSync(
  path.join(root, "packages/design-system/styles/theme.css"),
  "utf8",
);
for (const entry of ["app/styles", "modules/styles"]) {
  const tokens = parseTokens([
    base,
    fs.readFileSync(path.join(root, entry, "theme.css"), "utf8"),
  ]);
  const theme = Object.fromEntries(
    Object.entries({
      primary: "--primary-red",
      background: "--bg-main",
      text: "--text-primary",
      font: "--font-arabic",
    }).map(([key, name]) => [key, resolveToken(tokens, name)]),
  );
  if (entry === "app/styles") {
    theme.workshopMotion = Object.fromEntries(
      Object.keys(tokens)
        .filter((name) => name.startsWith("--workshop-reveal-"))
        .map((name) => {
          const key = name
            .slice("--workshop-reveal-".length)
            .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
          const raw = resolveToken(tokens, name);
          return [
            key,
            key === "easing"
              ? raw
              : parseFloat(raw) *
                (raw.endsWith("s") && !raw.endsWith("ms") ? 1000 : 1),
          ];
        }),
    );
  }
  fs.writeFileSync(
    path.join(root, entry, "theme-server.json"),
    JSON.stringify(theme, null, 2) + "\n",
  );
}
// Server-only export asset: baked into the server bundle, independent of runtime cwd.
const certificateFont = fs
  .readFileSync(
    path.join(root, "public/assets/fonts/ibm-plex-arabic-700.ttf"),
  )
  .toString("base64");
fs.writeFileSync(
  path.join(root, "modules/styles/certificate-font.json"),
  JSON.stringify({ base64: certificateFont }) + "\n",
);

// Email HTML shares the canonical theme and is regenerated with each build.
require("node:child_process").execFileSync("npx", ["tsx", "scripts/email/generate.ts"], { stdio: "inherit" });
