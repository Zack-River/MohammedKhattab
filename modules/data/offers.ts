import type { CourseOffer } from "@platform/types/lms";

// Illustrative prices only. Demo registration never charges the learner.
const mockOffer = (amount: number): CourseOffer => ({
  amount,
  currencyLabel: "ج.م",
  caption: "سعر توضيحي · بدون دفع فعلي",
  actionLabel: "اشترك الآن",
});
export const courseOffers = {
  "editing-foundations": mockOffer(499),
  "motion-essentials": mockOffer(899),
  "visual-design": mockOffer(649),
  "first-client": mockOffer(349),
  "editing-workflow": mockOffer(449),
  "sound-design": mockOffer(299),
};
export const offerCopy = {
  price: "سعر الدورة",
};
