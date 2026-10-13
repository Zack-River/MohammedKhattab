import {certificateLines,certificateText as text,escapeXml} from "./xml";
export interface CertificateModel {
 brandName:string;brandEnglishName:string;learnerName:string;courseTitle:string;title:string;disclaimer:string;
 introduction?:string;completion?:string;issuer?:string;issuerRole?:string;dateLabel?:string;serialLabel?:string;lessonLabel?:string;
 serial?:string;issuedDate?:string;lessonCount?:string;watermark?:string;
}
export interface CertificatePresentation {colors:{primary:string;background:string;text:string};fontBase64:string}
export function renderCertificate(model:CertificateModel,presentation:CertificatePresentation) {
 const {primary,background,text:ink}=presentation.colors,lines=certificateLines(model.courseTitle,46),size=Math.min(34,Math.floor(88/Math.max(lines.length,1))),step=Math.min(size+14,90/Math.max(lines.length-1,1));
 const names=certificateLines(model.learnerName,24),nameSize=names.length>1?Math.floor(82/names.length):Math.min(56,960/Math.max(Array.from(model.learnerName).length,1));
 const learner=names.map((line,index)=>text(line,600,(names.length>1?390:382)-(names.length-1-index)*(nameSize+6),nameSize)).join("");
 const course=lines.map((line,index)=>text(line,600,486+index*step,size)).join("");
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="850" viewBox="0 0 1200 850" role="img" aria-labelledby="title description">
 <title id="title">${escapeXml(model.title)}</title><desc id="description">${escapeXml(model.learnerName+" — "+model.courseTitle)}</desc>
 <rect width="1200" height="850" fill="${background}"/>
 <path d="M950 50 1160 360H740Z" fill="${primary}" opacity=".045"/>
 <rect x="28" y="28" width="1144" height="794" rx="12" fill="none" stroke="${ink}" stroke-opacity=".18"/>
 <path d="M28 178V28h150M1022 822h150V672" fill="none" stroke="${primary}" stroke-width="5"/>
 <path d="m1090 82 20 34h-40Z" fill="${primary}"/>
 <style>@font-face{font-family:CertificateArabic;src:url(data:font/ttf;base64,${presentation.fontBase64}) format('truetype');font-weight:700;}text{font-family:CertificateArabic;font-weight:700;}</style>
 <g fill="${ink}">${text(model.brandName,1048,111,40,"start")}
 <path d="M70 155h1060" stroke="${ink}" stroke-opacity=".15"/>
 ${text(model.title,600,244,50,"middle",`fill="${primary}"`)}
 ${text(model.introduction??"",600,names.length>2?285:302,23,"middle",'opacity=".7"')}
 ${learner}
 <path d="M440 407h320" stroke="${primary}" stroke-width="2"/>
 ${text(model.completion??"",600,445,23,"middle",'opacity=".7"')}${course}
 ${text(model.lessonCount?`${model.lessonLabel}: ${model.lessonCount}`:"",600,615,19,"middle",'opacity=".7"')}
 <path d="M70 655h1060" stroke="${ink}" stroke-opacity=".15"/>
 ${text(model.issuer??"",1100,706,28,"start")}${text(model.issuerRole??"",1100,740,18,"start",'opacity=".7"')}
 ${text(model.issuedDate?`${model.dateLabel}: ${model.issuedDate}`:"",370,704,19)}
 ${text(model.serialLabel??"",370,738,15,"middle",'opacity=".7"')}
 <text x="370" y="763" font-size="14" text-anchor="middle" direction="ltr">${escapeXml(model.serial??"")}</text>
 ${text(model.disclaimer,600,799,16,"middle",'opacity=".7"')}
 ${model.watermark?text(model.watermark,600,578,50,"middle",`fill="${primary}" opacity=".8"`):""}</g></svg>`;
}
