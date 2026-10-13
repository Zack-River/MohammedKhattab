/* eslint-disable @typescript-eslint/no-require-imports -- Real admin playback with local media; no external provider request. */
const {expect}=require('@playwright/test');
module.exports=async({page,url,slug,verify})=>{
 const field=page.getByLabel('رابط الفيديو التعريفي',{exact:true});
 await field.fill('/assets/video/workshop-intro.mp4');
 const player=page.getByRole('region',{name:'معاينة الفيديو'});
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:900});
  await expect(player).toBeVisible();
  verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Admin video preview fits '+width);
 }
 await player.getByRole('button',{name:'تشغيل المعاينة',exact:true}).click();
 await expect.poll(()=>player.locator('video').evaluate(video=>video.readyState)).toBeGreaterThan(0);
 verify(true,'Admin preview loads real local video metadata after activation');
 await field.fill('https://drive.google.com/file/d/1pVLFPEqSMCXJAjAR3VRl69hg_3zVQctu/view');
 await expect(player.locator('video')).toHaveCount(0);
 await page.route('**/api/admin/courses/'+slug+'/media/stream?*',route=>route.fulfill({status:302,headers:{location:url+'/assets/video/workshop-intro.mp4'}}));
 const request=page.waitForRequest(r=>r.url().includes('/api/admin/courses/'+slug+'/media/stream?'));
 await player.getByRole('button',{name:'تشغيل المعاينة',exact:true}).click();await request;
 await expect.poll(()=>player.locator('video').evaluate(video=>video.readyState)).toBeGreaterThan(0);
 verify(true,'Draft Drive preview uses admin stream and replaces the previous player');
 await field.fill('javascript:alert(1)');await expect(player).toHaveCount(0);
 verify(true,'Unsafe draft media cannot instantiate a player');
 await field.fill('');
};
