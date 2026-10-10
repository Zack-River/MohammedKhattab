import type { ClientsContent, TestimonialsContent } from "@khatab/design/types/marketing";
import { creators, clientReels } from "./workshop-clients";
import { studentReviews } from "./student-reviews";

export const workSamplesContent = {
    section: { id: "clients", className: "clients-section section-alt" },
    heading: {
      eyebrow: " ثقة كبار صناع المحتوى",
      title: [
        { kind: "span", children: ["ثقة العملاء وكبار صناع المحتوى"] },
        " ",
        { kind: "span", children: ["في الوطن العربي"] },
      ],
      description: [
        " أنا مش بس بعلمك مونتاج، أنا بنقلك الخبرة العملية اللي خلتني أشتغل مع أكبر صناع المحتوى والشركات في الوطن العربي. ",
      ],
    },
    creators,
    reels: clientReels,
    marqueeLabel: "شريط صناع المحتوى",
  } as const satisfies ClientsContent;

export const testimonialsContent = {
    section: { id: "testimonials", className: "testimonials-section" },
    heading: {
      eyebrow: " آراء وتقييمات الطلاب",
      title: ["آراء الطلاب"],
      description: [
        " تجارب حقيقية لطلاب شاركوا في الورش وطبقوا المنهج خطوة بخطوة. ",
      ],
    },
    featured: {
      text: " «بصراحة يا محمد الكورس فاجئني جدًا، خصوصًا إن الشرح بسيط ومش معقد، وكل درس فيه تطبيق عملي خلاني أفهم المعلومة بدل ما أحفظها وخلاص. 🔥» ",
      name: "أحمد محمد",
      country: "مصر",
      image: {
        src: "/assets/flags/eg.png",
        alt: "علم مصر",
        width: 46,
        height: 46,
      },
      badge: "تجربة مميزة",
      quoteMark: "“",
    },
    reviews: studentReviews,
    expansion: { initialCount: 3, showMoreLabel: "عرض المزيد" },
  } as const satisfies TestimonialsContent;
