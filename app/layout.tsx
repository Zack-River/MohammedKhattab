import FontPreloads from "@khatab/design/ui/font-preloads";
import { criticalFontAssets } from "@/config/fonts";
import { interfaceCopy } from "@platform/data/interface-copy";
import type { Metadata, Viewport } from "next";
import palette from "./styles/theme-server.json";
import "./globals.css";
export const metadata: Metadata = {
  title: { default: interfaceCopy.metadataTitle, template: interfaceCopy.metadataTemplate },
  description: interfaceCopy.metadataDescription,
  icons: { icon: "/assets/images/favicon.svg" },
};
export const viewport: Viewport = { themeColor: palette.background };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth">
      <head><FontPreloads assets={criticalFontAssets} /></head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
