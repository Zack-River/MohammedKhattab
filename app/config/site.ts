import { creatorContacts, creatorSocials } from "../../config/creator-contacts";
import {creatorIdentity} from "../../config/identity";

export const siteConfig = {
  name: "ورشة التغيير",
  title: "ورشة التغيير — أول عميل خلال 7 أيام | محمد خطاب",
  description:
    "انضم إلى أقوى الإديتورز في الوطن العربي وابدأ طريقك نحو أول عميل خلال 7 أيام فقط من خلال ورشة التغيير مع محمد خطاب.",
  promotionalDescription:
    "سيستم عملي يعلمك تفكير الإديتور + جذب العملاء + التسعير الذكي للحصول على أول عميل حقيقي خلال 7 أيام فقط.",
  author: creatorIdentity.author,
  defaultUrl: "https://warshataltagheer.vercel.app",
  phoneE164: creatorIdentity.phoneE164,
  phoneDisplay: creatorIdentity.phoneDisplay,
  email: creatorIdentity.email,
  enrollmentMessage: "مرحباً أريد الاستفسار عن ورشة التغيير",
  enrollmentLabel: "احجز مكانك في ورشة التغيير",
  instructorImage: {
    src: "/assets/images/instructor.webp",
    width: 720,
    height: 960,
  },
} as const;

export const contactLinks = {
  phone: creatorContacts.phone,
  email: creatorContacts.email,
  whatsapp: `${creatorContacts.whatsapp}?text=${encodeURIComponent(siteConfig.enrollmentMessage)}`,
} as const;
export const socialLinks = Object.values(creatorSocials);

export type { SocialPlatform } from "@khatab/design/types/ui";
