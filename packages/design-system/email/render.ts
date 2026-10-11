import type { EmailBrand, EmailContent, EmailTheme } from "./types";
import { emailAction, escapeEmailText as esc } from "./fragments";
export function renderEmail(content: EmailContent, brand: EmailBrand, t: EmailTheme) {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark"><title>${esc(content.subject)}</title></head>
<body bgcolor="${t.background}" style="margin:0;padding:0;background-color:${t.background};color:${t.text};font-family:${esc(t.font)};font-size:${t.bodySize};line-height:1.8;-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all">${esc(content.message)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${t.background}"><tr><td align="center" style="padding:${t.padding} ${t.gap}">
<!--[if mso]><table role="presentation" width="${parseInt(t.width)}" align="center"><tr><td><![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:${t.width};text-align:right" dir="rtl">
<tr><td style="padding:0 0 ${t.padding}"><a href="{{ .SiteURL }}" style="color:${t.text};text-decoration:none;font-size:${t.headingSize};font-weight:700">${esc(brand.name)} <span style="color:${t.primary}">▲</span></a><br><span dir="ltr" style="font-size:${t.smallSize};color:${t.secondary}">${esc(brand.englishName)}</span></td></tr>
<tr><td bgcolor="${t.surface}" style="background-color:${t.surface};padding:${t.padding};border:1px solid ${t.border};border-top:3px solid ${t.primary};border-radius:${t.radius}">
<p style="margin:0 0 ${t.gap};color:${t.secondary};font-size:${t.smallSize}">${esc(brand.context)}</p>
<h1 style="margin:0 0 ${t.gap};font-size:${t.headingSize};line-height:1.5;color:${t.text}">${esc(content.title)}</h1>
<p style="margin:0 0 ${t.gap};color:${t.secondary}">${esc(content.message)}</p>
${content.detail ? `<p dir="ltr" style="overflow-wrap:anywhere;word-break:break-all;color:${t.text}">${esc(content.detail)}</p>` : ""}
${emailAction(content, t, brand)}
<p style="margin:${t.padding} 0 0;padding-top:${t.gap};border-top:1px solid ${t.border};font-size:${t.smallSize};color:${t.secondary}">${esc(content.notice)}</p>
<p style="margin:${t.gap} 0 0;color:${t.secondary};font-size:${t.smallSize}">${esc(brand.recipient)}<br><span dir="ltr" style="display:inline-block;overflow-wrap:anywhere;word-break:break-all">{{ .Email }}</span></p>
</td></tr><tr><td style="padding:${t.padding} 0;color:${t.secondary};font-size:${t.smallSize}">
<p style="margin:0 0 ${t.gap}">${esc(brand.help)} <a href="${brand.supportUrl}" style="color:${t.text};text-decoration:underline">${esc(brand.support)}</a></p>
<p style="margin:0 0 ${t.gap}">${esc(brand.footer)}</p><a href="mailto:${brand.supportEmail}" style="color:${t.secondary}" dir="ltr">${brand.supportEmail}</a>
</td></tr></table><!--[if mso]></td></tr></table><![endif]-->
</td></tr></table></body></html>\n`;
}
