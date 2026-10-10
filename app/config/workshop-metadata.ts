import type { Metadata } from "next";
import { siteConfig } from "./site";

export const workshopMetadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.defaultUrl,
  ),
  title: { absolute: siteConfig.title },
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

