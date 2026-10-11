/* eslint-disable @typescript-eslint/no-require-imports -- Isolated course price API and browser acceptance. */
const assert=require('node:assert/strict'),{randomUUID}=require('node:crypto'),{chromium,expect}=require('@playwright/test');
module.exports=async({admin,provision,verify,url})=>{
 const manager=await provision('Price Manager');assert.ok(!(await admin.from('admin_users').insert({user_id:manager.id})).error);
 const slug='price-'+randomUUID(),created=slug+'-browser',base='/api/admin/courses/'+slug;
 const input={slug,title:'Price test course',description:'Integer price test',amount:500,category:'editing',delivery:'recorded'};
 const edit=amount=>({title:input.title,description:input.description,amount,category:input.category,thumbnailUrl:'',introVideoUrl:'',published:false});
 let browser;
 try{
  verify((await manager.api('/api/admin/courses',input)).status===201,'Create integer-priced draft');
  for(const amount of [-1,0.5,1200.99,1000001,'500',null]){
   verify((await manager.api('/api/admin/courses',{...input,slug:slug+'-invalid',amount})).status===400,'Creation rejects invalid amount');
   verify((await manager.api(base,edit(amount))).status===400,'Editing rejects invalid amount');
  }
  verify((await manager.api(base,edit(1))).status===200,'Smallest positive integer accepted');
  verify((await manager.api(base,edit(0))).status===200,'Canonical free price accepted');
  verify((await manager.api(base,edit(500))).status===200,'Free course may become paid');
  browser=await chromium.launch();const page=await browser.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(url+'/login');await page.getByLabel('البريد الإلكتروني',{exact:true}).fill(manager.email);await page.getByLabel('كلمة المرور',{exact:true}).fill(manager.password);await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await expect(page).toHaveURL(url+'/admin/dashboard');
  await page.goto(url+'/admin/dashboard/courses/'+slug);let price=page.getByLabel('السعر (ج.م)',{exact:true});const free=page.getByRole('checkbox',{name:'مجاني',exact:true});
  await expect(price).toHaveAttribute('type','text');await expect(price).toHaveAttribute('inputmode','numeric');verify(true,'Price is a normal text field with numeric mobile keyboard');
  for(const value of ['0','-10','1.5','1e3','abc','1000001']){await price.fill('');await price.fill(value);await expect(price).toHaveValue('');verify(true,'Invalid text cannot become a paid amount');}
  await price.fill('١٢٥٠');await expect(price).toHaveValue('1250');await page.getByRole('button',{name:'حفظ التغييرات',exact:true}).click();await expect(page.locator('.lms-admin-form').getByRole('status')).toBeVisible();verify((await admin.from('courses').select('amount').eq('slug',slug).single()).data.amount===1250,'Arabic-digit integer persists');
  await free.check();await expect(price).toBeDisabled();await expect(page.locator('input[type=hidden][name=amount]')).toHaveValue('0');await page.getByRole('button',{name:'حفظ التغييرات',exact:true}).click();await expect(page.locator('.lms-admin-form').getByRole('status')).toBeVisible();await page.reload();await expect(free).toBeChecked();verify((await admin.from('courses').select('amount').eq('slug',slug).single()).data.amount===0,'Free toggle persists through refresh');
  await free.uncheck();await expect(price).toBeEnabled();await expect(price).toHaveValue('');let requests=0;page.on('request',request=>{if(request.url().endsWith(base)&&request.method()==='POST')requests++;});await page.getByRole('button',{name:'حفظ التغييرات',exact:true}).click();verify(requests===0&&await price.evaluate(input=>input.validity.valueMissing),'Paid empty value is required and cannot silently save as free');
  for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:1000});verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Price field and free choice fit ${width}px`);}
  await page.goto(url+'/admin/dashboard/courses/new');price=page.getByLabel('السعر (ج.م)',{exact:true});await expect(price).toHaveAttribute('type','text');await expect(price).toBeEnabled();await expect(page.getByRole('checkbox',{name:'مجاني',exact:true})).not.toBeChecked();verify(true,'Creation reuses paid text/free choice with explicit selection');
  await page.getByLabel('اسم الدورة',{exact:true}).fill('Free browser course');await page.getByLabel('رابط الدورة',{exact:true}).fill(created);await page.getByLabel('الوصف',{exact:true}).fill('Free creation test');await page.getByRole('checkbox',{name:'مجاني',exact:true}).check();await page.getByRole('button',{name:'إنشاء دورة',exact:true}).click();await expect(page).toHaveURL(url+'/admin/dashboard/courses/'+created);await expect(page.getByRole('checkbox',{name:'مجاني',exact:true})).toBeChecked();verify((await admin.from('courses').select('amount').eq('slug',created).single()).data.amount===0,'Free creation persists to database');verify(errors.length===0,'No price-editor runtime errors');
 }finally{await browser?.close();await admin.from('courses').delete().in('slug',[slug,created,slug+'-invalid']);}
};
