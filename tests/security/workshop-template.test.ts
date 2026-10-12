import test from "node:test";
import assert from "node:assert/strict";
import { defaultWorkshopTemplate } from "../../modules/features/marketing/templates/default-template";
import { liveWorkshopCourse } from "../../modules/data/workshop-course";
import { validateWorkshopTemplate } from "../../modules/features/marketing/templates/helpers/validate-document";
import { resolveTemplateMedia,templateMediaUrl } from "../../modules/features/marketing/templates/helpers/template-media";
import { moveTemplateItem } from "../../modules/features/marketing/templates/helpers/move-items";
const sample=defaultWorkshopTemplate(liveWorkshopCourse);
test('complete default featured template validates',()=>assert.ok(validateWorkshopTemplate(sample,sample)));
test('template edits preserve rich highlights and accept safe links',()=>{const v=structuredClone(sample);v.content.hero.title=['New ',{kind:'span',className:'highlight-red',children:['workshop']}];v.content.hero.action.href='/checkout/7days-freelance';assert.ok(validateWorkshopTemplate(v,sample));});
test('template rejects active links, layout injection and oversized content',()=>{
 for(const mutation of [(v:typeof sample)=>v.content.hero.action.href='javascript:alert(1)',(v:typeof sample)=>v.content.hero.section.id='other',(v:typeof sample)=>v.content.hero.description='x'.repeat(6001),(v:typeof sample)=>v.content.offer.tickMs=0,(v:typeof sample)=>v.order.push('hero')]){const v=structuredClone(sample);mutation(v);assert.equal(validateWorkshopTemplate(v,sample),false);}
});
test('Drive media resolves only stored clip identifiers',()=>{const v=structuredClone(sample);v.content.hero.video={...sample.content.hero.video,url:undefined,source:{kind:'file',url:'https://drive.google.com/file/d/1pVLFPEqSMCXJAjAR3VRl69hg_3zVQctu/view'}};assert.match(resolveTemplateMedia(v,'7days-freelance').content.hero.video.source!.url,/template-media\?clip=hero/);assert.equal(templateMediaUrl(v,'../../secret'),undefined);});
test('list ordering does not mutate input and ignores out-of-range moves',()=>{const items=['one','two'];assert.deepEqual(moveTemplateItem(items,0,1),['two','one']);assert.deepEqual(items,['one','two']);assert.deepEqual(moveTemplateItem(items,0,-1),items);});
