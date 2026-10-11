import { accountCopy } from "./account";
import { backendCopy } from "./backend-copy";
import { authPolicy } from "@platform/config/auth";
import { endpoints, routes } from "@platform/config/navigation";
import type { AuthCopy, AuthMode, AuthPageModel } from "@platform/types/auth";
export const authCopy: AuthCopy = {
  fields: {
    name: { label: "اسمك", placeholder: "اكتب اسمك" },
    email: { label: "البريد الإلكتروني", placeholder: "student@example.com" },
    password: { label: "كلمة المرور", placeholder: "اكتب كلمة المرور", hint: `${authPolicy.passwordMin} أحرف على الأقل` },
    confirmPassword: { label: "تأكيد كلمة المرور", placeholder: "اكتب كلمة المرور مرة أخرى" },
  },
  errors: {
    nameRequired: "اكتب اسمك.", nameLength: `الاسم يجب أن يكون بين ${authPolicy.nameMin} و${authPolicy.nameMax} حرفًا.`,
    emailRequired: "اكتب بريدك الإلكتروني.", emailInvalid: "اكتب بريدًا إلكترونيًا صحيحًا.",
    passwordRequired: "اكتب كلمة المرور.", passwordLength: `كلمة المرور يجب أن تكون بين ${authPolicy.passwordMin} و${authPolicy.passwordMax} حرفًا.`,
    confirmationRequired: "أكّد كلمة المرور.", confirmationMismatch: "كلمتا المرور غير متطابقتين.",
  },
  show: "إظهار", hide: "إخفاء", requestError: "تعذّر إكمال الطلب. حاول مرة أخرى.", invalidRequest: "راجع البيانات وحاول مرة أخرى.",
};
const shared = {
  highlight: "خطوتك الجاية تبدأ هنا.", support: "مونتاج، تصميم جرافيك وموشن جرافيك. تعلّم بالتطبيق، وابدأ في بناء أعمال تعبّر عن مهارتك.",
  steps: ["تعلّم مهارة", "طبّقها بنفسك", "ابنِ أعمالك"], demoLabel: "حساب تعلّم",
  demoNote: "بيانات حسابك خاصة بك. أكّد بريدك الإلكتروني لتبدأ التعلّم.",
  confirmationMessage: backendCopy.EMAIL_CONFIRMATION,
  pending: "جارٍ المتابعة…", redirectTo: routes.dashboard, copy: authCopy,
};
export const authPages: Record<AuthMode, AuthPageModel> = {
  login: { ...shared, recovery: { label: accountCopy.forgot, href: routes.forgotPassword }, mode: "login", heading: "كمّل رحلتك مع تعلّم.", title: "تسجيل الدخول", description: "أدخل بياناتك للمتابعة إلى حسابك.", submit: "تسجيل الدخول", endpoint: endpoints.auth.login,
    alternate: { prompt: "أول مرة هنا؟", label: "أنشئ حسابًا", href: routes.signup } },
  signup: { ...shared, confirmationLink: { label: accountCopy.resendEmail, href: routes.confirmEmail }, mode: "signup", heading: "ابدأ تعلّم مهارة جديدة.", title: "إنشاء حساب", description: "خطوة بسيطة، وتبدأ بعدها رحلتك في التعلّم والتطبيق.", submit: "إنشاء حساب", endpoint: endpoints.auth.signup,
    alternate: { prompt: "عندك حساب بالفعل؟", label: "سجّل الدخول", href: routes.login } },
};
