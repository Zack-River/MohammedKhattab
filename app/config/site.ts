export const siteConfig = {
  name: "ورشة التغيير",
  title: "ورشة التغيير — أول عميل خلال 7 أيام | محمد خطاب",
  description:
    "انضم إلى أقوى الإديتورز في الوطن العربي وابدأ طريقك نحو أول عميل خلال 7 أيام فقط من خلال ورشة التغيير مع محمد خطاب.",
  promotionalDescription:
    "سيستم عملي يعلمك تفكير الإديتور + جذب العملاء + التسعير الذكي للحصول على أول عميل حقيقي خلال 7 أيام فقط.",
  author: "محمد خطاب - Muhammed Khattab",
  defaultUrl: "https://warshataltagheer.vercel.app",
  phoneE164: "+201558590242",
  phoneDisplay: "+20 155 859 0242",
  email: "mohamedkhattab494@gmail.com",
  enrollmentMessage: "مرحباً أريد الاستفسار عن ورشة التغيير",
  enrollmentLabel: "احجز مكانك في ورشة التغيير",
  instructorImage: {
    src: "/assets/images/instructor.webp",
    width: 720,
    height: 960,
  },
} as const;

export const contactLinks = {
  phone: `tel:${siteConfig.phoneE164}`,
  email: `mailto:${siteConfig.email}`,
  whatsapp: `https://wa.me/${siteConfig.phoneE164.slice(1)}?text=${encodeURIComponent(siteConfig.enrollmentMessage)}`,
} as const;

export const socialLinks = [
  {
    platform: "facebook",
    label: "Facebook",
    title: "فيسبوك محمد خطاب",
    href: "https://www.facebook.com/profile.php?id=61567528060353",
  },
  {
    platform: "tiktok",
    label: "TikTok",
    title: "تيك توك محمد خطاب",
    href: "https://www.tiktok.com/@muhammed.khattab54?_r=1&_t=ZS-9A3rPdMAhMY",
  },
  {
    platform: "instagram",
    label: "Instagram",
    title: "إنستجرام محمد خطاب",
    href: "https://www.instagram.com/mohamed_khatttab7/",
  },
  {
    platform: "youtube",
    label: "YouTube",
    title: "يوتيوب محمد خطاب",
    href: "https://youtube.com/@mkhattab1?si=LcAIQxJq_FdXfG-j",
  },
] as const;

export type SocialPlatform = (typeof socialLinks)[number]["platform"];
