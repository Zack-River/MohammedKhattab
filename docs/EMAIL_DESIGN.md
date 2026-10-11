# Ta3allam authentication email design

Nine templates share `packages/design-system/email/render.ts`, small action/text helpers, centrally supplied copy in `config/email/content.ts`, and email roles in `packages/design-system/styles/theme.css`. `npm run email:generate` regenerates the HTML, hosted Management API payload, and local authentication template configuration. Builds regenerate the exports automatically. Edit these sources, rather than generated HTML.

The design uses the approved `#101317` background, dark cards, `#fc3522` action/accent, white headings, secondary body text, Arabic RTL layout, text branding that survives blocked images, a single clear action, and WhatsApp support. It has inline CSS, presentation tables, a 600px desktop maximum, fluid mobile width, an Outlook conditional wrapper, and no JavaScript or animation. Email clients that ignore dark-mode metadata may adjust colors. IBM Plex Sans Arabic is declared first, with Tahoma/Arial fallbacks: Gmail and other clients cannot reliably load the website’s custom font.

| Supabase template | Subject | Generated file |
| --- | --- | --- |
| Confirm sign up | أهلاً بيك في تعلّم — أكّد بريدك الإلكتروني | `supabase/templates/confirmation.html` |
| Reset password | تعلّم — إعادة تعيين كلمة المرور | `supabase/templates/recovery.html` |
| Change email address | تعلّم — تأكيد تغيير البريد الإلكتروني | `supabase/templates/email_change.html` |
| Invite user | دعوتك للانضمام إلى تعلّم | `supabase/templates/invite.html` |
| Magic link or OTP | تعلّم — رابط تسجيل الدخول | `supabase/templates/magic_link.html` |
| Reauthentication | تعلّم — رمز تأكيد هويتك | `supabase/templates/reauthentication.html` |
| Phone number changed | تعلّم — تم تغيير رقم الهاتف | `supabase/templates/phone_changed_notification.html` |
| Password changed | تعلّم — تم تغيير كلمة المرور | `supabase/templates/password_changed_notification.html` |
| Email address changed | تعلّم — تم تغيير البريد الإلكتروني | `supabase/templates/email_changed_notification.html` |

## Hosted installation

Gmail SMTP is already working: the live recovery request returned HTTP 200, and the user confirmed Inbox delivery. Custom template installation is a separate Supabase configuration step; pushing Next.js code does not update hosted Auth templates.

Automatic: add `SUPABASE_ACCESS_TOKEN` to ignored `.env.local` using a personal access token from Supabase Account → Access Tokens. Run `npm run email:publish`. The script backs up the previous template fields under `/tmp`, updates only the nine subjects/HTML bodies, and verifies each saved field. It preserves SMTP credentials, redirects, confirmation requirements and notification-enable switches. The application never imports this script or token.

Manual: Supabase → Authentication → Email → Templates. For each template above, paste its subject and the **complete** corresponding HTML into the editor and save. Leave `{{ .ConfirmationURL }}`, `{{ .SiteURL }}`, `{{ .Token }}`, `{{ .Email }}`, `{{ .NewEmail }}` and `{{ .OldEmail }}` intact. Security notifications only send when their Supabase switches are enabled; supplying their design does not enable a new behavior. Phone verification is still administered manually and these templates do not add SMS or profile-phone notification delivery.

These exports keep the existing Auth link/callback behavior. No new token/session implementation or password handling is introduced. Never substitute a static URL for the confirmation URL in production. No exact expiry duration is claimed because Supabase settings determine it.

## Verification

`LD_LIBRARY_PATH=/tmp/khatab-browser-libs/root/usr/lib/x86_64-linux-gnu node tests/backend/email-design.cjs` checks all nine templates at 320, 390 and 768px, no overflow, RTL metadata, canonical colors, correct Supabase placeholders, white CTA text with no underline, and output/payload consistency. Recovery/signup screenshots are in `docs/evidence/email-design/`. Browser rendering validates geometry; actual email-client rendering remains a separate Inbox check after publishing the templates.

Sources: [Supabase email templates](https://supabase.com/docs/guides/auth/auth-email-templates), [local template configuration](https://supabase.com/docs/guides/local-development/customizing-email-templates).
