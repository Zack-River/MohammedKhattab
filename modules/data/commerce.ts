import { adminCopy } from "./admin";
import type { CommerceLabels } from "@platform/types/commerce";
export const commerceCopy: CommerceLabels = {
 featuredLayout:adminCopy.featuredLayout,featuredLayoutHint:adminCopy.featuredLayoutHint,
 title:"العروض والباقات",bundles:"باقات الدورات",offers:"التخفيضات والعروض",coupons:"كوبونات الخصم",create:"إضافة جديد",edit:"تعديل",remove:"حذف",
 name:"الاسم",key:"الرابط أو كود الكوبون",description:"الوصف",amount:"سعر الباقة (ج.م)",courses:"الدورات المشمولة",course:"الدورة",bundle:"الباقة",
 discountType:"نوع الخصم",percent:"نسبة مئوية",fixed:"مبلغ ثابت (ج.م)",discountValue:"قيمة الخصم",startsAt:"بداية العرض",endsAt:"نهاية العرض",
 enabled:"مفعّل",stackable:"يمكن الجمع مع عرض آخر",minimum:"الحد الأدنى للطلب (ج.م)",maximumUses:"عدد الاستخدامات الكلي",perUserLimit:"عدد الاستخدامات لكل طالب",unlimited:"اتركه فارغًا لعدد غير محدود",
 search:"بحث بالاسم أو الكود",status:"الحالة",all:"الكل",active:"مفعّل",inactive:"غير مفعّل",apply:"تطبيق",clear:"مسح",save:"حفظ",saving:"جارٍ الحفظ…",saved:"تم الحفظ",error:"تعذّر الحفظ. راجع البيانات وحاول مجددًا.",empty:"لا توجد نتائج",previous:"السابق",next:"التالي",
 deleteConfirm:"هل تريد حذف هذا العنصر؟ العناصر المرتبطة بمدفوعات محفوظة يجب تعطيلها بدل حذفها.",currency:"ج.م",revision:"آخر تحديث",targetHint:"اختر دورة أو باقة واحدة. ترك الاثنين فارغين يجعل الكوبون عامًا.",datesHint:"الأوقات بتوقيت جهازك. اترك التاريخ فارغًا لعرض مفتوح.",bundleHint:"اختر دورتين إلى عشرين دورة. تُمنح كل دورات الباقة بعد تأكيد الدفع.",
 coupon:"كود الخصم",applyCoupon:"تطبيق الكوبون",removeCoupon:"إزالة الكوبون",subtotal:"السعر الأصلي",offerDiscount:"خصم العرض",couponDiscount:"خصم الكوبون",total:"الإجمالي",buyBundle:"اشترك في الباقة",bundlesHeading:"تعلّم أكثر مع باقات الدورات",includes:"الدورات داخل الباقة",free:"مجاني",checkout:"تأكيد الاشتراك المجاني",freeCheckoutHint:"سيُؤكَّد اشتراكك مباشرة دون الانتقال إلى بوابة الدفع.",
};
