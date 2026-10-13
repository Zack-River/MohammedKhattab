import { liveWorkshopCourse } from "./workshop-course";
import { categories, sampleLessonVideoUrl } from "@platform/config/catalog";
import {
  courseSeconds,
  formatCourseDuration,
  parseLessonTime,
} from "@platform/features/catalog/helpers";
import { lessonResources } from "./catalog-settings";
import { courseOffers } from "./offers";
import type { Course, Lesson } from "@platform/types/lms";
const lesson = (
  id: string,
  title: string,
  duration: string,
  description: string,
  preview = false,
): Lesson => ({
  id,
  title,
  duration,
  durationSeconds: parseLessonTime(duration),
  resourceIds: [],
  description,
  preview,
  videoUrl: sampleLessonVideoUrl,
  takeaway: [
    "طبّق الفكرة على مشروعك الخاص.",
    "راجع النتيجة قبل الانتقال للدرس التالي.",
    "اكتب ملاحظاتك واحتفظ بها أثناء التعلّم.",
  ],
});
const records: Omit<Course, "categoryLabel" | "duration">[] = [
  {
    slug: "editing-foundations",
    title: "أساسيات المونتاج باستخدام Premiere Pro",
    subtitle: "أساسيات المونتاج الاحترافي",
    description:
      "ابدأ من الصفر وافهم كيف تفكّر كإديتور، ترتّب مشروعك، وتحوّل اللقطات إلى فيديو متماسك. كل خطوة معها تطبيق بسيط.",
    category: "editing",
    tool: "Premiere Pro",
    level: "مناسب للمبتدئين",
    offer: courseOffers["editing-foundations"],
    artwork: "timeline",
    featured: true,
    outcomes: [
      "ترتيب ملفاتك وبناء مشروع واضح",
      "اختيار اللقطات وصناعة إيقاع بصري",
      "استخدام الصوت واللون لخدمة القصة",
      "تصدير أول مشروع يصلح للبورتفوليو",
    ],
    modules: [
      {
        title: "قبل ما تبدأ التايم لاين",
        lessons: [
          lesson(
            "editor-mindset",
            "فكّر كإديتور، مش مجرد مستخدم برنامج",
            "12:40",
            "افهم الهدف من الفيديو ومن يشاهده، قبل أن تبدأ في قص اللقطات.",
            true,
          ),
          lesson(
            "your-workspace",
            "مساحة عمل مرتّبة من أول يوم",
            "15:20",
            "رتّب الملفات والأدوات حتى تركّز على الحكاية.",
          ),
        ],
      },
      {
        title: "ابنِ الحكاية لقطة بلقطة",
        lessons: [
          lesson(
            "first-cut",
            "أول كات: الاختيار أهم من الأدوات",
            "24:10",
            "اختَر اللقطات التي تخدم فكرتك وضعها في تسلسل واضح.",
          ),
          lesson(
            "rhythm",
            "إيقاع الفيديو وانتقالات لها معنى",
            "21:35",
            "تعلّم متى تقص ومتى تترك اللقطة تتنفس.",
          ),
        ],
      },
      {
        title: "اللمسة الأخيرة",
        lessons: [
          lesson(
            "sound-color",
            "الصوت واللون يكمّلان الحكاية",
            "28:15",
            "وازن الصوت وجرّب تصحيح اللون على مشروعك.",
          ),
          lesson(
            "export-project",
            "صدّر مشروعك الأول بثقة",
            "18:00",
            "جهّز نسخة نهائية مناسبة للعرض والمشاركة.",
          ),
        ],
      },
    ],
  },
  {
    slug: "motion-essentials",
    title: "أساسيات الموشن جرافيك باستخدام After Effects",
    subtitle: "بداية عملية في الموشن جرافيك",
    description:
      "حوّل الأشكال والنصوص إلى حركة مفهومة. تعلّم مفاتيح الحركة والتوقيت، وابدأ بمشاريع قصيرة بدل التعقيد.",
    category: "motion",
    tool: "After Effects",
    level: "مناسب للمبتدئين",
    offer: courseOffers["motion-essentials"],
    artwork: "motion",
    outcomes: [
      "فهم التوقيت ومفاتيح الحركة",
      "تحريك النصوص والأشكال",
      "تنفيذ مشهد قصير متكامل",
    ],
    modules: [
      {
        title: "الحركة خطوة بخطوة",
        lessons: [
          lesson(
            "motion-workspace",
            "تعرّف على مساحة العمل",
            "18:00",
            "ابدأ بمشهد بسيط وأدوات واضحة.",
            true,
          ),
          lesson(
            "keyframes",
            "مفاتيح الحركة والتوقيت",
            "26:00",
            "تحكّم في حركة العناصر وسرعتها.",
          ),
          lesson(
            "type-motion",
            "نصوص تتحرّك وتوصل المعنى",
            "30:00",
            "ابنِ عنوانًا متحركًا لفيديوك.",
          ),
          lesson(
            "motion-project",
            "مشروعك الأول في الحركة",
            "31:00",
            "اجمع ما تعلّمته في مشهد قصير.",
          ),
        ],
      },
    ],
  },
  {
    slug: "visual-design",
    title: "أساسيات الجرافيك ديزاين باستخدام Photoshop",
    subtitle: "أساسيات الجرافيك ديزاين",
    description:
      "تعلّم اللون والتكوين والخط، ونفّذ تصميمات جرافيك واضحة ومتسقة. ابدأ بالأساسيات وطبّقها على مشروع عملي.",
    category: "design",
    tool: "Photoshop",
    level: "مناسب للمبتدئين",
    offer: courseOffers["visual-design"],
    artwork: "design",
    outcomes: [
      "فهم التكوين والتسلسل البصري",
      "اختيار الألوان والخطوط",
      "تصميم بوستر متكامل",
    ],
    modules: [
      {
        title: "من الفكرة إلى التصميم",
        lessons: [
          lesson(
            "design-basics",
            "التكوين والتسلسل البصري",
            "20:00",
            "وجّه عين المشاهد إلى الفكرة الأساسية.",
            true,
          ),
          lesson(
            "color-type",
            "اختيار اللون والخط",
            "25:00",
            "ابنِ هوية متسقة وواضحة.",
          ),
          lesson(
            "poster-project",
            "بوستر متكامل بمشروع عملي",
            "45:00",
            "نفّذ تصميمًا تستطيع إضافته إلى أعمالك.",
          ),
        ],
      },
    ],
  },
  {
    slug: "first-client",
    title: "أساسيات العمل الحر والتسعير للمصممين",
    subtitle: "بورتفوليو وتواصل وتسعير",
    description:
      "رتّب أعمالك، اكتب رسالة واضحة، وافهم كيف تعرض خدمتك. خطوات بسيطة تساعدك على الانتقال من التدريب إلى العمل.",
    category: "business",
    tool: "Freelancing",
    level: "لكل المستويات",
    offer: courseOffers["first-client"],
    artwork: "business",
    outcomes: [
      "تجهيز بورتفوليو واضح",
      "كتابة عرض خدمة عملي",
      "فهم أساسيات التواصل والتسعير",
    ],
    modules: [
      {
        title: "الخطوة الأولى للعمل",
        lessons: [
          lesson(
            "portfolio",
            "بورتفوليو يحكي عن مهارتك",
            "25:00",
            "اختر أعمالًا توضّح ما تستطيع تقديمه.",
            true,
          ),
          lesson(
            "client-message",
            "رسالة أولى واضحة ومحترمة",
            "20:00",
            "اكتب رسالة قصيرة تركّز على احتياج العميل.",
          ),
          lesson(
            "pricing",
            "أساسيات الاتفاق والتسعير",
            "35:00",
            "حدّد نطاق الخدمة وما يشمله الاتفاق.",
          ),
        ],
      },
    ],
  },
  {
    slug: "editing-workflow",
    title: "تطوير سير العمل في Premiere Pro",
    subtitle: "تطوير سير العمل في المونتاج",
    description:
      "طوّر طريقة شغلك في Premiere Pro: رتّب اللقطات، استخدم الاختصارات، وراجع مشروعك قبل التسليم.",
    category: "editing",
    tool: "Premiere Pro",
    level: "المستوى التالي",
    offer: courseOffers["editing-workflow"],
    artwork: "timeline",
    outcomes: [
      "تنظيم اللقطات وتسريع الوصول إليها",
      "استخدام الاختصارات لتحسين سير العمل",
      "مراجعة المشروع وتجهيزه للتسليم",
    ],
    modules: [
      {
        title: "سير عمل واضح من البداية للتسليم",
        lessons: [
          lesson(
            "organize-footage",
            "تنظيم اللقطات والملفات",
            "20:00",
            "جهّز ملفاتك ورتّب اللقطات قبل البدء في المونتاج.",
            true,
          ),
          lesson(
            "editing-shortcuts",
            "اختصارات تسرّع شغلك",
            "25:00",
            "استخدم الاختصارات والأدوات المناسبة لتقلل الخطوات المتكررة.",
          ),
          lesson(
            "delivery-review",
            "المراجعة وتجهيز التسليم",
            "25:00",
            "راجع المونتاج والصوت واللون وإعدادات التصدير قبل التسليم.",
          ),
        ],
      },
    ],
  },
  {
    slug: "sound-design",
    title: "مونتاج الصوت ومعالجته في Premiere Pro",
    subtitle: "أساسيات الصوت للمونتير",
    description:
      "رتّب الحوار والموسيقى والمؤثرات، واصنع تجربة مشاهدة مريحة. تطبيقات مباشرة داخل مشروع المونتاج.",
    category: "editing",
    tool: "Premiere Pro",
    level: "لكل المستويات",
    offer: courseOffers["sound-design"],
    artwork: "motion",
    outcomes: [
      "ضبط مستوى الحوار",
      "استخدام الموسيقى بدون تشتيت",
      "بناء طبقات صوت بسيطة",
    ],
    modules: [
      {
        title: "اسمع مشروعك بشكل مختلف",
        lessons: [
          lesson(
            "clean-dialogue",
            "حوار واضح بدون تشويش",
            "20:00",
            "راجع التسجيل واضبط مستوى الصوت.",
            true,
          ),
          lesson(
            "music",
            "موسيقى تخدم الإحساس",
            "20:00",
            "اختر الموسيقى المناسبة للفكرة.",
          ),
          lesson(
            "sound-layers",
            "طبقات الصوت والمراجعة الأخيرة",
            "20:00",
            "وازن العناصر قبل تصدير المشروع.",
          ),
        ],
      },
    ],
  },
];
export { categories } from "@platform/config/catalog";

export const courses: Course[] = [...records.map((course) => ({
  ...course,
  duration: formatCourseDuration(courseSeconds(course)),
  categoryLabel: categories.find((category) => category.id === course.category)!
    .label,
  modules: course.modules.map((module) => ({
    ...module,
    lessons: module.lessons.map((lesson) => ({
      ...lesson,
      resourceIds: lessonResources[`${course.slug}/${lesson.id}`] ?? [],
    })),
  })),
})), liveWorkshopCourse];
