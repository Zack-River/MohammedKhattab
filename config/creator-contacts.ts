import { creatorIdentity } from "./identity";
import type { SocialLinkData } from "@khatab/design/types/ui";
/** Approved destinations; portfolio variants intentionally preserve the source reference. */
export const creatorContacts = {
  phone: `tel:${creatorIdentity.phoneE164}`,
  email: `mailto:${creatorIdentity.email}`,
  portfolioEmail: "mailto:contact@muhammedkhattab.com",
  whatsapp: `https://wa.me/${creatorIdentity.phoneE164.slice(1)}`,
};
export const creatorSocials = {
  facebook: { platform: "facebook", label: "Facebook", title: "فيسبوك محمد خطاب", href: "https://www.facebook.com/profile.php?id=61567528060353" },
  tiktok: { platform: "tiktok", label: "TikTok", title: "تيك توك محمد خطاب", href: "https://www.tiktok.com/@muhammed.khattab54?_r=1&_t=ZS-9A3rPdMAhMY" },
  instagram: { platform: "instagram", label: "Instagram", title: "إنستجرام محمد خطاب", href: "https://www.instagram.com/mohamed_khatttab7/" },
  youtube: { platform: "youtube", label: "YouTube", title: "يوتيوب محمد خطاب", href: "https://youtube.com/@mkhattab1?si=LcAIQxJq_FdXfG-j" },
} as const satisfies Record<string, SocialLinkData>;
export const portfolioSocials: readonly SocialLinkData[] = [
  { ...creatorSocials.facebook, href: "https://www.facebook.com/share/1GaKrsfaVo/" },
  creatorSocials.tiktok,
  { ...creatorSocials.instagram, href: "https://www.instagram.com/khatttab7?stkn=YWk5ZzVmMDBkNWp4" },
  creatorSocials.youtube,
];
