/* eslint-disable @typescript-eslint/no-require-imports -- Session-aware navigation with isolated accounts. */
const {chromium,expect}=require('@playwright/test');
module.exports=async function navigation({url,manager,student,verify}) {
 const browser=await chromium.launch();
 try {
  for(const identity of [null,student,{...manager,admin:true}]) {
   const context=await browser.newContext(),page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('console',message=>{if(message.type()==='error' && /hydrat|server rendered|didn't match/i.test(message.text())) errors.push(message.text());});
   if(identity) {
    await page.goto(url+'/login');await page.getByLabel('البريد الإلكتروني',{exact:true}).fill(identity.email);
    await page.getByLabel('كلمة المرور',{exact:true}).fill(identity.password);
    await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();
    await expect(page).toHaveURL(url+(identity.admin?'/admin/dashboard':'/dashboard'));
   }
   const role=identity?(identity.admin?'admin':'student'):'guest';
   for(const path of ['/','/courses','/login']) {
    await page.goto(url+path);const header=page.locator('header.lms-site-header');
    await expect(header.getByRole('link',{name:'ورشة التغيير',exact:true})).toHaveCount(0);
    verify(true,role+' '+path+': workshop removed from navbar');
    if(identity) {
     await expect(header.getByRole('link',{name:'ابدأ التعلّم',exact:true})).toHaveCount(0);
     const label=identity.admin?'لوحة الإدارة':'لوحة التعلّم',href=identity.admin?'/admin/dashboard':'/dashboard';
     await expect(header.getByRole('link',{name:label,exact:true})).toHaveAttribute('href',href);
     verify(true,role+' '+path+': only role-appropriate dashboard action shown');
    } else {
     await expect(header.getByRole('link',{name:'لوحة التعلّم',exact:true})).toHaveCount(0);
     await expect(header.getByRole('link',{name:'لوحة الإدارة',exact:true})).toHaveCount(0);
     await expect(header.getByRole('link',{name:'ابدأ التعلّم',exact:true})).toHaveAttribute('href','/login');
     verify(true,'guest '+path+': learning action visible without dashboard action');
    }
    await page.setViewportSize({width:320,height:844});
    verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),role+' '+path+': navbar fits 320px');
    await page.setViewportSize({width:1440,height:900});
   }
   await page.goto(url+'/founder');await expect(page.locator('header').getByRole('link',{name:'ورشة التغيير',exact:true})).toHaveCount(0);
   verify(true,role+': founder navbar has no workshop link');
   verify(errors.length===0,role+': no navigation runtime or hydration errors');await context.close();
  }
 } finally {await browser.close();}
};
