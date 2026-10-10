import {expect,test} from "@playwright/test";
for(const width of [320,390,768,1440])test(`T29 FAQ expansion, collapse and rapid keyboard toggles at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto("/ta3allam");
 const button=page.locator(".faq-question-btn").first(),panel=page.locator(".faq-answer-panel").first();
 await button.scrollIntoViewIfNeeded();await expect(panel).toHaveAttribute("inert","");
 expect(await panel.evaluate(element=>element.getBoundingClientRect().height)).toBeLessThanOrEqual(1);
 await button.press("Enter");await expect(panel).toHaveAttribute("aria-hidden","false");
 await expect.poll(()=>panel.evaluate(element=>element.getAnimations().length)).toBeGreaterThan(0);
 const opening=await panel.evaluate(element=>{const animation=element.getAnimations()[0];animation.pause();const duration=Number(animation.effect!.getTiming().duration);animation.currentTime=duration/2;const height=element.getBoundingClientRect().height;animation.play();return {duration,height};});
 expect(opening.duration).toBe(500);expect(opening.height).toBeGreaterThan(1);
 await expect.poll(()=>panel.evaluate(element=>element.getAnimations().length)).toBe(0);
 const full=await panel.evaluate(element=>element.getBoundingClientRect().height);expect(opening.height).toBeLessThan(full);
 await button.press("Space");await expect(panel).toHaveAttribute("aria-hidden","true");
 await expect.poll(()=>panel.evaluate((element,maximum)=>{const height=element.getBoundingClientRect().height;return height>1&&height<maximum;},full)).toBe(true);
 await expect.poll(()=>panel.evaluate(element=>element.getBoundingClientRect().height)).toBeLessThanOrEqual(1);
 await button.press("Enter");await button.press("Enter");await button.press("Enter");
 await expect(button).toHaveAttribute("aria-expanded","true");await expect(panel).toHaveAttribute("aria-hidden","false");
 await button.press("Enter");await expect(panel).toHaveAttribute("inert","");
 await expect.poll(()=>panel.evaluate(element=>element.getBoundingClientRect().height)).toBeLessThanOrEqual(1);
});
test("T24 retained occurrences do not replay; removal, search and history remain usable",async({page})=>{
 await page.goto("/ta3allam/courses?category=motion");const item=page.locator(".lms-card-entrance").first();
 await expect.poll(()=>item.evaluate(element=>element.getAnimations().some(animation=>animation.playState==="running"))).toBe(true);
 await expect.poll(()=>item.evaluate(element=>element.getAnimations().length)).toBe(0);
 const original=await item.elementHandle();
 await page.getByRole("link",{name:"كل الدورات",exact:true}).last().click();
 await expect(page.locator(".lms-course-card")).toHaveCount(6);
 expect(await original!.evaluate(element=>({connected:element.isConnected,count:element.getAnimations().length}))).toEqual({connected:true,count:0});
 await page.getByRole("link",{name:"مونتاج الفيديو",exact:true}).click();await expect(page.locator(".lms-course-card")).toHaveCount(3);
 expect(await original!.evaluate(element=>({connected:element.isConnected,count:element.getAnimations().length}))).toEqual({connected:false,count:0});
 await page.goBack();await expect(page.locator(".lms-course-card")).toHaveCount(6);
 await page.goForward();await expect(page.locator(".lms-course-card")).toHaveCount(3);
 await page.getByRole("searchbox").fill("missing-term");await page.getByRole("button",{name:"ابحث",exact:true}).press("Enter");
 await expect(page.locator(".lms-course-card")).toHaveCount(0);await page.getByRole("link",{name:"عرض كل الدورات",exact:true}).click();await expect(page.locator(".lms-course-card")).toHaveCount(6);
});
test("T30 actual localhost:3040 entrance, surface timing and live hover interpolation",async({page})=>{
 await page.goto("http://localhost:3040/ta3allam");const entrance=page.locator(".lms-card-entrance").first();
 await expect.poll(()=>entrance.evaluate(element=>element.getAnimations().map(animation=>animation.effect?.getTiming().duration))).toContain(500);
 await entrance.evaluate(element=>element.scrollIntoView({behavior:"instant"}));
 await expect.poll(()=>entrance.evaluate(element=>Number(getComputedStyle(element).opacity)>0&&Number(getComputedStyle(element).opacity)<1)).toBe(true);
 await expect.poll(()=>entrance.evaluate(element=>element.getAnimations().length)).toBe(0);
 const card=entrance.locator(".lms-course-card");await card.hover();
 await expect.poll(()=>card.evaluate(element=>{const y=new DOMMatrix(getComputedStyle(element).transform).m42;return y<0&&y>-8;})).toBe(true);
 expect(await card.evaluate(element=>element.getAnimations().map(animation=>animation.effect?.getTiming().duration))).toContain(500);
 await expect.poll(()=>card.evaluate(element=>new DOMMatrix(getComputedStyle(element).transform).m42)).toBe(-8);
 await page.mouse.move(0,0);await expect.poll(()=>card.evaluate(element=>new DOMMatrix(getComputedStyle(element).transform).m42)).toBe(0);
});
test("T09 T30 touch has no sticky hover movement",async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:900},isMobile:true,hasTouch:true,reducedMotion:"reduce"});const page=await context.newPage();
 await page.goto((process.env.TEST_BASE_URL??"http://localhost:3040")+"/ta3allam/courses");await page.emulateMedia({reducedMotion:"no-preference"});
 const card=page.locator(".lms-course-card").first();await card.locator(".lms-card-meta").tap();
 expect(await page.evaluate(()=>matchMedia("(hover:hover) and (pointer:fine)").matches)).toBe(false);
 await expect(card).toHaveCSS("transform","none");await context.close();
});
test("T07 T31 breakpoint boundaries and keyboard focus",async({page})=>{
 await page.emulateMedia({reducedMotion:"reduce"});await page.goto("/ta3allam");
 const toggle=page.locator(".lms-mobile-toggle");
 for(const width of [1023,1024,1025]){await page.setViewportSize({width,height:900});if(width<=1024)await expect(toggle).toBeVisible();else await expect(toggle).toBeHidden();}
 await page.goto("/ta3allam/courses");await page.keyboard.press("Tab");
 expect(await page.evaluate(()=>{const node=document.activeElement!;const css=getComputedStyle(node);return {tag:node.tagName,visible:css.outlineStyle!=="none"&&parseFloat(css.outlineWidth)>0};})).toMatchObject({tag:"A",visible:true});
 const filter=page.getByRole("link",{name:"موشن جرافيك",exact:true});await filter.focus();await page.keyboard.press("Enter");await expect(page.locator(".lms-course-card")).toHaveCount(1);
 const action=page.locator(".lms-card-action");await action.focus();await page.keyboard.press("Enter");await expect(page).toHaveURL(/motion-essentials#course-enrollment/);
});
