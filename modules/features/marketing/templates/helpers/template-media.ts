import type { VideoContent } from "@khatab/design/types/ui";
import { driveFileId } from "@platform/helpers/media/drive-file-id";
import { endpoints } from "@platform/config/navigation";
import type { WorkshopTemplate } from "@platform/types/workshop-template";
export function templateMediaUrl(document:WorkshopTemplate,clip:string):string | undefined {
 if(clip==='hero') return document.content.hero.video.source?.url ?? document.content.hero.video.url;
 if(!/^reel-\d{1,2}$/.test(clip)) return;
 return document.content.clients.reels[Number(clip.slice(5))]?.video?.source.url;
}
export function resolveTemplateMedia(document:WorkshopTemplate,slug:string):WorkshopTemplate {
 const resolve=(url:string,clip:string)=>driveFileId(url) ? endpoints.templateMedia(slug,clip) : url;
 const hero=document.content.hero,video=hero.video;
 const resolvedVideo:VideoContent=video.source ? {...video,source:{...video.source,url:resolve(video.source.url,'hero')}} : {...video,url:resolve(video.url,'hero')};
 return {...document,content:{...document.content,hero:{...hero,video:resolvedVideo},clients:{...document.content.clients,reels:document.content.clients.reels.map((reel,index)=>({...reel,...(reel.video ? {video:{...reel.video,source:{...reel.video.source,url:resolve(reel.video.source.url,`reel-${index}`)}}} : {})}))}}};
}
