import { creatorIdentity, learningIdentity } from "../../config/identity";
import { liveSessionCopy } from "./live-sessions";
import { routes, sectionIds } from "@platform/config/navigation";
import type {
  InstructorContent,
  FaqContent,
  TransformationContent,
} from "@khatab/design/types/marketing";
export const site = {
  name: learningIdentity.name,
  englishName: learningIdentity.englishName,
  description:
    "خطوة صغيرة اليوم، مهارة تفتح لك طريقًا جديدًا. دورات في المونتاج والجرافيك ديزاين والموشن جرافيك، مع تدريب على العمل الحر وكوتشينج.",
  demoLabel: "منصة تعلّم",
  email: creatorIdentity.email,
};
export const marketingNavigation = [
  { href: routes.section("courses"), label: "الدورات" },
  { href: routes.section("steps"), label: "كيف تتعلّم؟" },
  { href: routes.section("instructor"), label: "تعرّف على مؤسس تعلّم" },
  { href: routes.section("coaching"), label: "الكوتشينج" },
  { href: routes.section("faq"), label: "الأسئلة الشائعة" },
];
export const dashboardNavigation = [
  { href: routes.liveSessions, label: liveSessionCopy.tab, symbol: "clock" },
  { href: routes.dashboard, label: "نظرة عامة", symbol: "grid" },
  { href: routes.library, label: "دوراتي", symbol: "book" },
  { href: routes.purchases, label: "طلباتي ومدفوعاتي", symbol: "book" },
  { href: routes.resources, label: "مكتبة الأدوات", symbol: "folder" },
  { href: routes.certificates, label: "شهاداتي", symbol: "award" },
  { href: routes.profile, label: "حسابي", symbol: "user" },
] as const;
export const instructor: InstructorContent = {
  section: {
    id: sectionIds.instructor,
    className: "instructor-section section-alt",
  },
  name: creatorIdentity.name,
  tagline: "مونتير ومصمم جرافيك وموشن جرافيك — مؤسس تعلّم",
  manifesto: [
    "أنا مش هنا عشان أقولك حياتك هتتغير في يوم وليلة. أنا هنا أديك ",
    { kind: "strong", children: ["خطوات عملية"] },
    " تفهمها وتطبقها، وتبني مهارتك مشروع بعد مشروع.",
  ],
  image: {
    src: "/assets/images/instructor.webp",
    alt: "محمد خطاب، مدرّب المونتاج والجرافيك ديزاين والموشن جرافيك",
    width: 1086,
    height: 1448,
  },
  badge: "Editor & Graphic Designer",
  experience: "LEARN. CREATE. GROW.",
  action: { href: routes.portfolio, label: "اعرف أكتر عن محمد خطاب" },
  stats: [
    { value: "1", label: "خطوة في كل مرة" },
    { value: "100%", label: "تعلّم بالتطبيق" },
    { value: "∞", label: "مساحة للتجربة والتطور" },
  ],
};
export const howItWorks: TransformationContent = {
  section: { id: sectionIds.steps, className: "transformation-section" },
  heading: {
    title: [
      "من ",
      { kind: "span", className: "highlight-red", children: ["نفسي أتعلّم"] },
      " إلى مشروع تفتخر بيه",
    ],
    description: [
      "مش محتاج تعرف كل حاجة قبل ما تبدأ. اختار مسارك، اتعلّم خطوة بخطوة، وطبّق اللي فهمته على شغلك.",
    ],
  },
  stages: [
    {
      number: "01",
      title: "اختار تخصصك",
      description:
        "ابدأ بالمونتاج أو الجرافيك ديزاين أو الموشن جرافيك، حسب مستواك وهدفك.",
    },
    {
      number: "02",
      title: "اتعلّم وجرّب",
      description: "دروس قصيرة وخطوات عملية، مع ملاحظاتك وأدوات تساعدك.",
    },
    {
      number: "03",
      title: "جهّز نفسك للعمل",
      description:
        "ابنِ بورتفوليوك، واتعلّم أساسيات الفريلانس. ولو محتاج توجيه شخصي، الكوتشينج يساعدك تحدد خطوتك الجاية.",
    },
  ],
};
export const faq: FaqContent = {
  section: { id: sectionIds.faq, className: "faq-section section-alt" },
  heading: { title: ["إجابات بسيطة لأسئلتك"] },
  items: [
    {
      question: "هل أحتاج خبرة قبل ما أبدأ؟",
      answer: "لا. اختار دورة مناسبة للمبتدئين، وامشِ مع الدروس خطوة بخطوة.",
    },
    {
      question: "هل أقدر أتعلّم من الموبايل؟",
      answer:
        "تقدر تشاهد الدروس وتتابع تقدّمك من الموبايل. التطبيق على برامج المونتاج والتصميم يحتاج كمبيوتر مناسبًا للبرنامج.",
    },
    {
      question: "إيه الفرق بين الدورات والكوتشينج؟",
      answer:
        "الدورات بتعلّمك المونتاج والجرافيك ديزاين والموشن جرافيك والعمل الحر بمنهج وتطبيقات. الكوتشينج توجيه شخصي لمراجعة أعمالك وتحديد خطوات تطويرك.",
    },
    {
      question: "كيف أعرف محتوى الدورة قبل الاشتراك؟",
      answer:
        "تجد الفصول والأقسام والدروس في صفحة الدورة. يمكنك مشاهدة الدروس المتاحة للمعاينة قبل الاشتراك.",
    },
    {
      question: "كيف يتم الدفع وتفعيل الاشتراك؟",
      answer:
        "أنشئ حسابك وأكّد البريد الإلكتروني ورقم الهاتف، ثم انتقل للدفع الآمن. يتفعّل اشتراكك بعد تأكيد الدفع، وتجد دوراتك داخل حسابك.",
    },
  ],
};
export const copy = {
  coursesTitle: "اختار أول خطوة ليك",
  coursesDescription:
    "مونتاج وجرافيك ديزاين وموشن جرافيك، مع دورات في العمل الحر.",
  search: "ابحث عن مهارة أو دورة",
  searchButton: "ابحث",
  reset: "عرض كل الدورات",
  noResults: "لم نجد دورة بهذا البحث",
  noResultsBody: "جرّب اسم المهارة أو اختار تصنيفًا آخر.",
  viewCourse: "اكتشف الدورة",
  start: "ابدأ التعلّم",
  continue: "كمّل تعلّمك",
  courseContent: "محتوى الدورة",
  preview: "معاينة مجانية",
  lessons: "دروس",
  demoVideo: "شاهد الدرس وطبّق الخطوات بنفسك.",
  complete: "أتممت هذا الدرس",
  completed: "تم إتمام الدرس",
  next: "الدرس التالي",
  previous: "الدرس السابق",
  saving: "جارٍ الحفظ…",
  error: "تعذّر الحفظ. جرّب مرة أخرى.",
  notes: "ملاحظاتك",
  notesHint: "اكتب فكرة، سؤالًا، أو خطوة تحب ترجع لها…",
  notesSaved: "ملاحظاتك محفوظة في هذا المتصفح",
  resources: "أدوات تساعدك تطبّق",
  download: "تحميل الأداة",
  username: "اسم المستخدم",
  usernameHint: "يمكنك تغيير الاسم الافتراضي. استخدم حروفًا إنجليزية أو أرقامًا أو الشرطة والشرطة السفلية؛ من ٣ إلى ٤٨ حرفًا.",
  profileSaved: "تم حفظ بياناتك",
  save: "حفظ التغييرات",
  name: "اسمك",
  email: "البريد الإلكتروني",
  back: "ارجع للدورة",
  browse: "استكشف الدورات",
  enrollLabel: "اشترك الآن",
  enrolledLabel: "الدورة في مكتبتك",
  outcome: "بعد الدورة هتقدر",
  free: "تجربة مجانية",
  curriculumIntro: "خطوات صغيرة تبني مهارة حقيقية.",
  dashboardTitle: "كل خطوة بتفرق.",
  dashboardDescription:
    "كمّل من آخر نقطة وصلت لها، وخلي التعلّم جزءًا من يومك.",
  myCourses: "رحلتك لحد دلوقتي",
  recommendations: "خطوتك الجاية",
  lessonDetails: "في هذا الدرس",
  certificateTitle: "إنجازك يستحق يتشاف",
  certificateDescription:
    "أكمل كل دروس الدورة، ثم اطلب إصدار شهادة الإتمام التدريبية وحمّلها من هنا.",
  emptyCertificates: "شهادتك الأولى مستنياك",
  emptyCertificatesBody:
    "ابدأ بدورة واحدة وكمّل دروسها. كل درس بيقرّبك من الإنجاز.",
  profileTitle: "خلّينا نتعرّف عليك",
  profileDescription: "بيانات بسيطة تجعل تجربة التعلّم أقرب ليك.",
  enterDemo: "ادخل وابدأ التجربة",
  demoAccount: "حساب تجريبي",
  loginTitle: "خطوتك الأولى تبدأ هنا",
  loginDescription:
    "اكتب اسمك وجرّب رحلتك داخل تعلّم. لا تحتاج كلمة مرور للنسخة التجريبية.",
  completedCourses: "دورات مكتملة",
  completedLessons: "دروس أنجزتها",
  enrolledCourses: "دورات في مكتبتك",
  emptyCourses: "ابدأ رحلتك بدورة واحدة",
  footer:
    "تعلّم — مونتاج، جرافيك ديزاين، موشن جرافيك، فريلانس وكوتشينج. بإشراف محمد خطاب.",
  copyright: "© تعلّم. كل خطوة بداية جديدة.",
  allCourses: "كل الدورات",
  menu: "فتح قائمة التنقل",
  close: "إغلاق القائمة",
  progress: "تقدّمك في الدورة",
  emailPlaceholder: "you@example.com",
  artworkLessonLabel: "LESSONS",
  pending: "لم يُنجز بعد",
  print: "تحميل الشهادة",
  notesUnavailable: "تعذّر حفظ الملاحظات في المتصفح.",
};

export const skillStripItems = [
  "Premiere Pro",
  "After Effects",
  "Photoshop",
  "Freelancing",
  "Coaching",
] as const;
