export type EditRhythm = "calm" | "energetic";
export type ClipStage = "raw" | "cut" | "color" | "finished";

export const firstEdit = {
  poster: "/assets/video/first-edit-poster.webp",
  raw: "/assets/video/first-edit-raw.mp4",
  source: "https://mixkit.co/free-stock-video/coffee-is-served-in-a-cup-3573/",
  title: "لحظة قبل الزحمة",
} as const;

export const editRhythms = {
  calm: {
    label: "هادية",
    title: "خد لحظة لنفسك.",
    description:
      "لقطة متصلة، مساحة تتنفس، وعنوان بسيط. ست ثواني من غير استعجال.",
    source: "/assets/video/first-edit-calm.mp4",
    duration: "0:06",
    cuts: 1,
  },
  energetic: {
    label: "سريعة",
    title: "قهوتك. وبداية جديدة.",
    description:
      "ثلاث لحظات مختارة، قطعات أسرع، وعنوان مباشر. نفس اللقطة في أربع ثواني.",
    source: "/assets/video/first-edit-energetic.mp4",
    duration: "0:04",
    cuts: 3,
  },
} as const;

export const lessonOutcomes = [
  {
    day: "01",
    title: "أول قصّة نظيفة",
    text: "نختار بداية ونهاية، ونشيل الوقت اللي مش بيضيف للفكرة.",
    stage: "cut",
  },
  {
    day: "02",
    title: "عنوان يشد العين",
    text: "نضيف عنوان واضح وحركة بسيطة تخدم المعنى.",
    stage: "finished",
  },
  {
    day: "03",
    title: "لون له إحساس",
    text: "نوازن الصورة ونديها دفء يناسب لقطة القهوة.",
    stage: "color",
  },
  {
    day: "04",
    title: "عين تراجع",
    text: "نرجع للقطة الأصلية ونسأل: كل قرار عملناه له لازمة؟",
    stage: "raw",
  },
  {
    day: "05",
    title: "فيديو من أوله لآخره",
    text: "نجمع التقطيع واللون والعنوان في نسخة كاملة.",
    stage: "finished",
  },
  {
    day: "06",
    title: "اختيارات أذكى",
    text: "نقارن الإيقاع الهادي والسريع ونفهم إمتى نستخدم كل واحد.",
    stage: "cut",
  },
  {
    day: "07",
    title: "شغل نقدر نعرضه",
    text: "نجهّز النتيجة للعرض ونشرح القرارات اللي وراها.",
    stage: "finished",
  },
] as const satisfies readonly {
  day: string;
  title: string;
  text: string;
  stage: ClipStage;
}[];
