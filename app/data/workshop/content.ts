import { designerCredit } from "../../../config/designer";
import { projectNavigation, projectRoutes } from "../../../config/project-navigation";
import { introVideo } from "../../../config/marketing-intro";
import type { MarketingPageContent } from "@khatab/design/types/marketing";
import { contactLinks, siteConfig, socialLinks } from "@/app/config/site";
import { offerConfig } from "@/app/config/offer";
import { referenceMotion } from "@/app/config/reference-motion";
import { referenceUi } from "@/app/config/reference-ui";
import { workSamplesContent, testimonialsContent } from "../../../config/marketing-proof";
import { roadmapDays } from "./curriculum";
import { faqItems } from "./faq";
import { referenceSignupNames } from "./signup";

const sections = {
  hero: { id: "hero", className: "hero-section" },
  clients: workSamplesContent.section,
  transformation: { id: "transformation", className: "transformation-section" },
  roadmap: { id: "roadmap", className: "roadmap-section section-alt" },
  testimonials: testimonialsContent.section,
  instructor: { id: "instructor", className: "instructor-section section-alt" },
  guarantee: { id: "guarantee", className: "guarantee-section" },
  faq: { id: "faq", className: "faq-section section-alt" },
  finalCta: { id: "enroll", className: "final-cta-section" },
} as const;
const action = {
  href: contactLinks.whatsapp,
  label: siteConfig.enrollmentLabel,
  external: true,
};
const microcopy = ["محاضرات لايف", "تطبيق عملي", "متابعة مباشرة"];
const brand = { href: `#${sections.hero.id}`, label: siteConfig.name };

export const workshopPage = {
  offer: offerConfig,
  motion: referenceMotion,
  header: {
    id: "siteHeader",
    brand: { ...brand, title: "الرئيسية ورشة التغيير" },
    navigation: [
      { href: `#${sections.hero.id}`, label: "الرئيسية" },
      { href: `#${sections.clients.id}`, label: "ثقة العملاء" },
      { href: `#${sections.transformation.id}`, label: "التحول" },
      { href: `#${sections.roadmap.id}`, label: "خريطة الورشة" },
      { href: `#${sections.testimonials.id}`, label: "آراء الطلاب" },
      { href: `#${sections.instructor.id}`, label: "عن المدرب" },
      { href: `#${sections.faq.id}`, label: "الأسئلة الشائعة" },
    ],
    navigationLabel: "شريط التنقل الرئيسي",
    toggleLabel: "فتح القائمة",
    action: { ...action, label: " احجز مكانك " },
    scarcityLabel: "تفاصيل الورشة",
    viewerCount: referenceUi.initialViewers,
    viewerLabel: " بيشاهدوا الآن",
    countdown: {
      label: "ينتهي الخصم خلال :",
      accessibleLabel: "الوقت المتبقي لانتهاء الخصم",
      units: [
        { key: "days", label: "يوم" },
        { key: "hours", label: "ساعة" },
        { key: "minutes", label: "دقيقة" },
        { key: "seconds", label: "ثانية" },
      ],
    },
  },
  footer: {
    projectNavigation,
    brand: { ...brand, title: "الرجوع لأعلى الصفحة" },
    copyright: "جميع الحقوق محفوظة © ورشة التغيير — محمد خطاب",
    credit: designerCredit,
    social: socialLinks,
  },
  hero: {
    section: sections.hero,
    title: [
      " انضم إلى ",
      {
        kind: "span",
        className: "highlight-editors",
        icon: {
          name: "sparkle",
          className: "badge-sparkle-icon",
          width: 18,
          height: 18,
        },
        children: [" أقوى الإديتورز"],
      },
      " في الوطن العربي ",
      { kind: "break" },
      " وابدأ طريقك نحو أول عميل حقيقي خلال ",
      { kind: "span", className: "highlight-red", children: ["7 أيام فقط"] },
    ],
    description:
      " سيستم عملي يعلمك تفكير الإديتور + جذب عملاء + تسعير ذكي خطوة بخطوة + الحصول على أول عميل خلال 7 أيام. ",
    video: introVideo,
    action,
    microcopy,
  },
  clients: workSamplesContent,
  transformation: {
    section: sections.transformation,
    heading: {
      eyebrow: " التحول الحقيقي",
      title: [
        {
          kind: "span",
          className: "trans-from",
          children: ["من مونتير يعرف الأدوات فقط"],
        },
        {
          kind: "span",
          className: "trans-arrow",
          decorative: true,
          children: ["←"],
        },
        {
          kind: "span",
          className: "trans-to",
          children: [
            "إلى ",
            {
              kind: "span",
              className: "highlight-red",
              children: ["إيديتور محترف"],
            },
            " يفكر، ينفذ، ويجلب شغل",
          ],
        },
      ],
      description: [
        " معظم المونتيرين يتعلمون أزرار البرامج فقط، ثم يتجمدون أمام المشاريع أو يفشلون في إيجاد عملاء يدفعون. في ورشة التغيير نغطي الحلقات الثلاث المفقودة: ",
      ],
    },
    stages: [
      {
        number: "01",
        title: "تفكير الإديتور",
        description:
          " تعلم كيف تفكر في بناء القصة وسيكولوجية المشاهد بدلاً من مجرد تنفيذ أوامر التقطيع العمياء. ",
      },
      {
        number: "02",
        title: "تنفيذ احترافي",
        description:
          " إتقان عملي لأدوات Premiere و After Effects مع فهم دقيق لسبب وتوقيت استخدام كل أداة. ",
      },
      {
        number: "03",
        title: "العمل مع العملاء",
        description:
          " بناء بورتفوليو مقنع، إتقان التفاوض والتسعير، واستهداف أماكن تواجد صناع المحتوى الحقيقيين. ",
      },
    ],
  },
  roadmap: {
    section: sections.roadmap,
    heading: {
      eyebrow: " خريطة ورشة التغيير",
      title: [" خريطة الطريق للوصول إلى أول عميل "],
      description: [
        " مش “دروس نظرية”… دي رحلة مدتها 7 أيام بمحاضرات لايف وتطبيق عملي بتطلعك من مونتير عادي لـ Editor محترف بيقفل شغل. كل يوم معمول بشكل عملي بنسبة ",
        { kind: "span", className: "numeral", children: ["100%"] },
        ". ",
      ],
    },
    formula: {
      title: "المعادلة العملية للورشة",
      inputs: ["تفكير الإديتور", "جذب العملاء", "تسعير ذكي خطوة بخطوة"],
      result: "أول عميل خلال 7 أيام",
    },
    days: roadmapDays,
    action,
  },
  testimonials: testimonialsContent,
  instructor: {
    section: sections.instructor,
    action: { href: projectRoutes.portfolio, label: "شاهد ملفي وأعمالي" },
    eyebrow: " مدرب الورشة — محمد خطاب",
    name: "محمد خطاب",
    tagline: "إيديتور بأكتر من 3 سنين خبرة مع أكبر صناع المحتوى",
    manifesto: [
      " أنا مش هنا عشان أقولك حياتك هتتغير في يوم وليلة، أنا هنا أديك ",
      { kind: "strong", children: ["سيستم"] },
      " لو طبقته هيخليك من أقوى الإيديتورز في الوطن العربي وتحقق أول عميل ليك خلال 7 أيام. ",
    ],
    image: {
      src: "/assets/images/instructor.png",
      alt: "محمد خطاب - Senior Video Editor",
      width: 1086,
      height: 1448,
    },
    badge: "Senior Video Editor",
    experience: "03+ YEARS EXPERIENCE",
    stats: [
      {
        value: "03+",
        label: "سنوات خبرة في الميدان",
        target: 3,
        prefix: "0",
        suffix: "+",
      },
      {
        value: "07",
        label: "أيام للوصول لأول عميل",
        target: 7,
        prefix: "0",
        suffix: "",
      },
      {
        value: "100%",
        label: "تطبيق ومتابعة عملية",
        target: 100,
        prefix: "",
        suffix: "%",
      },
    ],
  },
  guarantee: {
    section: sections.guarantee,
    heading: {
      eyebrow: " ضمان استرجاع 100%",
      title: ["ضمان استرجاع أموالك"],
      description: [
        " في حالة لم نستطيع توفير لك أول عميل بعد 7 أيام يمكنك استرداد أموالك بالكامل. ",
      ],
    },
  },
  faq: {
    section: sections.faq,
    heading: {
      eyebrow: " الأسئلة الشائعة",
      title: ["إجابات واضحة لكل تساؤلاتك"],
    },
    items: faqItems,
  },
  finalCta: {
    section: sections.finalCta,
    heading: {
      eyebrow: " فرصتك للبدء الآن",
      title: [" جاهز تبدأ طريقك لأول عميل؟ "],
      description: [
        " 7 أيام من التطبيق، المتابعة، وبناء الأساس اللي تحتاجه عشان تبدأ تشتغل كـVideo Editor بشكل احترافي. ",
      ],
    },
    action,
    microcopy,
  },
  signup: {
    options: {
      names: referenceSignupNames,
      initialName: "يوسف القحطاني",
      delayMs: referenceUi.signupDelayMs,
      visibleMs: referenceUi.signupVisibleMs,
      intervalMs: referenceUi.signupIntervalMs,
    },
    content: { status: "انضم حديثًا للورشة", closeLabel: "إغلاق" },
  },
} as const satisfies MarketingPageContent;
