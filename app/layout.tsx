import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/app/config/site";
import "plyr/dist/plyr.css";
import "./globals.css";

// Keep browser chrome aligned with the CSS palette without duplicating its color.
const designTokenSource = readFileSync(
  join(process.cwd(), "app", "styles", "theme.css"),
  "utf8",
);
const themeColor = designTokenSource
  .match(/--color-canvas:\s*([^;]+);/i)?.[1]
  ?.trim();

if (!themeColor) {
  throw new Error("The --color-canvas design token is missing a color value.");
}

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.defaultUrl,
  ),
  title: siteConfig.title,
  description: siteConfig.description,
  authors: [{ name: siteConfig.author }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "ar_AR",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.promotionalDescription,
    images: [
      {
        url: siteConfig.instructorImage.src,
        width: siteConfig.instructorImage.width,
        height: siteConfig.instructorImage.height,
        alt: "محمد خطاب",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.promotionalDescription,
    images: [siteConfig.instructorImage.src],
  },
  icons: { icon: "/assets/images/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      {/* ColorZilla can add body attributes before hydration; children stay checked. */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
