import { creatorIdentity, learningIdentity } from "../identity";
export const emailBrand = {
  name: learningIdentity.name, englishName: learningIdentity.englishName, supportEmail: creatorIdentity.email,
  supportUrl: `https://wa.me/${creatorIdentity.phoneE164.slice(1)}`,
  context: "حسابك على تعلّم", recipient: "البريد المرتبط بالطلب", help: "محتاج مساعدة؟", support: "تواصل مع الدعم",
  footer: "تعلّم المونتاج والجرافيك ديزاين والموشن جرافيك، خطوة بخطوة.",
  fallback: "لو الزر مش بيشتغل، انسخ الرابط التالي وافتحه في المتصفح:",
};
export const authEmails = [
  { id: "confirmation", label: "Confirm sign up", subject: "أهلاً بيك في تعلّم — أكّد بريدك الإلكتروني", title: "خطوتك الأولى تبدأ هنا", message: "أهلاً بيك في تعلّم. أكّد بريدك الإلكتروني عشان تكمّل إعداد حسابك وتبدأ رحلة التعلّم.", action: "تأكيد البريد الإلكتروني", notice: "لو ما أنشأتش حساب على تعلّم، تجاهل الرسالة دي." },
  { id: "recovery", label: "Reset password", subject: "تعلّم — إعادة تعيين كلمة المرور", title: "نرجّعك لحسابك", message: "وصلنا طلب لإعادة تعيين كلمة مرور حسابك. اضغط على الزر واختر كلمة مرور جديدة.", action: "تعيين كلمة مرور جديدة", notice: "لو ما طلبتش تغيير كلمة المرور، تجاهل الرسالة دي. كلمة مرورك الحالية هتفضل زي ما هي." },
  { id: "email_change", label: "Change email address", subject: "تعلّم — تأكيد تغيير البريد الإلكتروني", title: "أكّد بريدك الجديد", message: "وصلنا طلب لتغيير البريد الإلكتروني المرتبط بحسابك. أكّد التغيير من الزر التالي. قد تحتاج تأكيده من البريدين حسب إعدادات الأمان.", action: "تأكيد تغيير البريد", detail: "{{ .NewEmail }}", notice: "لو ما طلبتش التغيير، ما تضغطش على الرابط وتواصل مع الدعم." },
  { id: "invite", label: "Invite user", subject: "دعوتك للانضمام إلى تعلّم", title: "مكانك معانا جاهز", message: "تمت دعوتك للانضمام إلى تعلّم. اقبل الدعوة لإعداد حسابك والبدء في التعلّم.", action: "قبول الدعوة", notice: "لو ما كنتش متوقع الدعوة، تقدر تتجاهل الرسالة دي." },
  { id: "magic_link", label: "Magic link or OTP", subject: "تعلّم — رابط تسجيل الدخول", title: "ادخل لحسابك بسهولة", message: "استخدم الرابط التالي لتسجيل الدخول إلى حسابك على تعلّم. الرابط للاستخدام مرة واحدة؛ ما تشاركهش مع أي شخص.", action: "تسجيل الدخول", notice: "لو ما طلبتش تسجيل الدخول، تجاهل الرسالة دي." },
  { id: "reauthentication", label: "Reauthentication", subject: "تعلّم — رمز تأكيد هويتك", title: "نتأكد إن ده أنت", message: "استخدم رمز التأكيد التالي لإتمام الإجراء على حسابك. الرمز مؤقت؛ ما تشاركهش مع أي شخص، حتى الدعم.", code: "{{ .Token }}", notice: "لو ما طلبتش الرمز، تجاهل الرسالة دي." },
] as const;
export const securityEmails = [
  { id: "phone_changed_notification", label: "Phone number changed", subject: "تعلّم — تم تغيير رقم الهاتف", title: "رقم هاتفك اتغيّر", message: "تم تغيير رقم الهاتف المرتبط بحسابك على تعلّم.", detail: "{{ .OldPhone }} → {{ .Phone }}", notice: "لو مش أنت اللي غيّرته، تواصل مع الدعم فوراً." },
  { id: "password_changed_notification", label: "Password changed", subject: "تعلّم — تم تغيير كلمة المرور", title: "كلمة مرورك اتغيّرت", message: "تم تغيير كلمة المرور لحسابك على تعلّم.", notice: "لو مش أنت اللي غيّرتها، أعد تعيين كلمة المرور فوراً وتواصل مع الدعم.", action: "استعادة الحساب", actionUrl: "{{ .SiteURL }}/forgot-password" },
  { id: "email_changed_notification", label: "Email address changed", subject: "تعلّم — تم تغيير البريد الإلكتروني", title: "بريد حسابك اتغيّر", message: "تم تغيير البريد الإلكتروني المرتبط بحسابك على تعلّم.", detail: "{{ .OldEmail }} → {{ .Email }}", notice: "لو مش أنت اللي غيّرته، تواصل مع الدعم فوراً." },
] as const;
