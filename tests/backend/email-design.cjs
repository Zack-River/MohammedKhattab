/* eslint-disable @typescript-eslint/no-require-imports -- Generated email design, placeholders and rendering checks. */
const fs=require('node:fs'), assert=require('node:assert/strict');
const {chromium}=require('@playwright/test');
const allowed=new Set(['ConfirmationURL','Token','TokenHash','SiteURL','Email','Data','RedirectTo']);
const manifest=JSON.parse(fs.readFileSync('supabase/templates/variables.json','utf8'));
const config=JSON.parse(fs.readFileSync('supabase/templates/hosted-config.json','utf8'));
(async()=>{
 const browser=await chromium.launch({headless:true});let checks=0;
 try {
  fs.mkdirSync('docs/evidence/email-design',{recursive:true});
  for(const file of fs.readdirSync('supabase/templates').filter(file=>file.endsWith('.html'))) {
   const id=file.replace('.html',''),html=fs.readFileSync('supabase/templates/'+file,'utf8');
   const variables=[...new Set([...html.matchAll(/{{([\s\S]*?)}}/g)].map(match=>match[0]))];
   assert.deepEqual(manifest[id],variables);
   for(const variable of variables)assert.ok(allowed.has(variable.slice(2,-2).trim().slice(1)),`${id}: unexpected placeholder ${variable}`);
   assert.doesNotMatch(html,/{{ \.(?:NewEmail|OldEmail|Phone|OldPhone) }}/);
   if(id.endsWith('_notification'))assert.doesNotMatch(html,/{{ \.(?:ConfirmationURL|Token|TokenHash|RedirectTo) }}/);
   assert.equal(config[`mailer_templates_${id}_content`],html);assert.match(html,/lang="ar" dir="rtl"/);
   assert.match(html,/#101317/);assert.match(html,/#fc3522/);assert.doesNotMatch(html,/<script|var\(--|localhost|sb_secret_|SMTP_PASSWORD/);
   if(['confirmation','recovery','email_change','invite','magic_link'].includes(id))assert.equal((html.match(/href="{{ \.ConfirmationURL }}"/g)||[]).length,2);
   if(id==='reauthentication'){assert.match(html,/{{ \.Token }}/);assert.doesNotMatch(html,/ConfirmationURL/);}
   const page=await browser.newPage();
   const preview=html.replaceAll('{{ .ConfirmationURL }}','https://ta3allam.vercel.app/api/auth/callback?token_hash='+'x'.repeat(90)).replaceAll('{{ .SiteURL }}','https://ta3allam.vercel.app').replaceAll('{{ .Email }}','student@ta3allam.com').replaceAll('{{ .NewEmail }}','newstudent@ta3allam.com').replaceAll('{{ .OldEmail }}','student@ta3allam.com').replaceAll('{{ .Token }}','12345678').replaceAll('{{ .Phone }}','+201201024880').replaceAll('{{ .OldPhone }}','+201055555555');
   for(const width of [320,390,768]) {
    await page.setViewportSize({width,height:1000});await page.setContent(preview);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${id} overflows ${width}px`);
    assert.ok(await page.locator('h1').isVisible());
    if(['confirmation','recovery','email_change','invite','magic_link'].includes(id)) {
      const style=await page.locator('td[bgcolor="#fc3522"] a').evaluate(el=>({color:getComputedStyle(el).color,decoration:getComputedStyle(el).textDecorationLine}));
      assert.equal(style.color,'rgb(255, 255, 255)');assert.equal(style.decoration,'none');
    }
    if(id==='recovery'||id==='confirmation')await page.screenshot({path:`docs/evidence/email-design/${id}-${width}.png`,fullPage:true});
    checks++;
   }
   await page.close();
  }
  console.log(`Email design: ${checks} responsive renders passed; placeholders, canonical colors and generated payload verified.`);
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
