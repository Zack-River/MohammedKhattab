import {creatorIdentity,learningIdentity} from "@/config/identity";
export const certificateCopy = {
 title:"الشهادات",search:"البحث باسم الطالب أو الدورة",filter:"حالة الشهادة",all:"الكل",apply:"تطبيق",previous:"السابق",next:"التالي",
 issued:"سارية",revoked:"ملغاة",learner:"اسم الطالب",course:"الدورة",date:"تاريخ الإصدار",serial:"رقم الشهادة",actions:"الإجراءات",empty:"لا توجد شهادات مطابقة.",
 issue:"إصدار شهادة",username:"اسم المستخدم",issueHint:"تُصدر الشهادة بعد إتمام جميع دروس دورة منشورة باشتراك فعّال. تُحفظ بياناتها كما كانت وقت الإصدار.",
 revoke:"إلغاء الشهادة",restore:"استعادة الشهادة",reason:"سبب الإجراء",cancel:"إلغاء",save:"تأكيد",saving:"جارٍ الحفظ…",saved:"تم الحفظ",error:"تعذّر حفظ الشهادة. راجع البيانات وحاول مرة أخرى.",
 preview:"معاينة التصميم",download:"تحميل الشهادة",request:"إصدار شهادتي",locked:"هذه الشهادة ملغاة. تواصل مع الدعم للاستفسار.",accessLocked:"تحميل الشهادة متاح عند تفعيل الاشتراك ونشر الدورة.",actor:"المنفّذ",unknown:"حساب غير متاح",history:"آخر إجراءات الشهادة",support:"تواصل مع الدعم",
 print:"طباعة / حفظ PDF",previewHint:"معاينة للتصميم فقط؛ ليست شهادة صادرة لطالب.",
};
export const certificateDocument = {
 brandName:learningIdentity.name,brandEnglishName:learningIdentity.englishName,title:"شهادة إتمام تدريبية",
 introduction:"تشهد منصة تعلّم بأن",completion:"قد أتمّ جميع دروس الدورة التدريبية",issuer:creatorIdentity.name,issuerRole:"مؤسس منصة تعلّم",
 disclaimer:"شهادة إتمام تدريبية من تعلّم، لا تمثّل اعتمادًا أكاديميًا أو مهنيًا.",
 dateLabel:"تاريخ الإصدار",serialLabel:"رقم الشهادة",lessonLabel:"عدد الدروس المكتملة",preview:"معاينة التصميم",revoked:"شهادة ملغاة",
};
export const certificatePreview = {learnerName:"اسم الطالب",courseTitle:"المونتاج والجرافيك ديزاين والموشن جرافيك",serial:"TA3-PREVIEW",issuedAt:"2026-01-01T00:00:00Z",lessonCount:24};
