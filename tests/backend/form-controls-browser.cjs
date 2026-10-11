/* eslint-disable @typescript-eslint/no-require-imports -- Browser checks with ephemeral isolated accounts. */
const { chromium, expect } = require('@playwright/test');
const fs = require('node:fs');
module.exports = async function controlsBrowser({ manager, student, verify, url }) {
  const browser = await chromium.launch({ headless:true });
  const directory = 'docs/evidence/form-controls'; fs.mkdirSync(directory,{recursive:true});
  try {
    const page = await browser.newPage({ viewport:{ width:390,height:844 } });
    page.setDefaultTimeout(15000);
    const errors=[];page.on('pageerror', error=>errors.push(error.message));
    await page.goto(url+'/login');await page.getByLabel('البريد الإلكتروني',{exact:true}).fill(manager.email);
    await page.getByLabel('كلمة المرور',{exact:true}).fill(manager.password);
    await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await expect(page).toHaveURL(url+'/admin/dashboard');
    await page.getByRole('radio',{name:'الاسم يبدأ بـ',exact:true}).check();
    await page.getByRole('searchbox').fill('Zack');await page.getByRole('button',{name:'تطبيق البحث والفلاتر'}).click();
    await expect(page).toHaveURL(/mode=prefix/);await expect(page.getByRole('radio',{name:'الاسم يبدأ بـ'})).toBeChecked();
    verify(true,'Custom radio persists indexed search mode after navigation');
    await page.getByRole('checkbox',{name:'المنضمون خلال آخر ٧ أيام'}).check();
    await page.getByRole('button',{name:'تطبيق البحث والفلاتر'}).click();await expect(page).toHaveURL(/newcomers=1/);
    verify(true,'Custom checkboxes combine with prefix search');
    await page.screenshot({path:`${directory}/filters-390.png`,fullPage:true});
    await page.goto(url+'/admin/dashboard?q='+encodeURIComponent(student.email));
    const handle = JSON.parse((await student.api('/api/profile')).data).username;
    const view = page.getByRole('link',{name:'عرض المستخدم',exact:true});
    await expect(view).toHaveAttribute('href','/admin/dashboard/users/'+handle);
    await view.click();await expect(page).toHaveURL(url+'/admin/dashboard/users/'+handle);
    verify(true,'User link and browser destination use the username');
    await page.goto(url+'/admin/dashboard/users/'+student.id);
    await expect(page).toHaveURL(url+'/admin/dashboard/users/'+handle);
    verify(true,'Browser follows legacy UUID redirect to canonical username');
    await page.goto(url+'/admin/dashboard?q='+encodeURIComponent(student.email));
    await page.getByRole('button',{name:'إدارة الحساب',exact:true}).click();
    const dialog = page.getByRole('dialog',{name:'إدارة الحساب',exact:true}), combo=dialog.getByRole('combobox');
    for(const viewport of [{width:320,height:568},{width:390,height:844},{width:844,height:390},{width:1440,height:900}]) {
      await page.setViewportSize(viewport);await combo.click();await expect(combo).toHaveAttribute('aria-expanded','true');
      const menu=page.getByRole('listbox');await expect(menu).toBeVisible();
      const rect=await menu.boundingBox();verify(rect.x>=0 && rect.y>=0 && rect.x+rect.width<=viewport.width+1 && rect.y+rect.height<=viewport.height+1,`Top-layer dropdown fits ${viewport.width}×${viewport.height}`);
      await page.getByRole('option',{name:'أسبوع',exact:true}).click();await expect(combo).toContainText('أسبوع');
      await expect(combo).toBeFocused();verify(true,'Dropdown selection works inside modal and restores trigger focus');
      await combo.press('ArrowDown');await combo.press('End');await combo.press('Enter');await expect(combo).toContainText('سنة');
      await combo.click();await page.keyboard.press('Escape');await expect(menu).not.toBeVisible();await expect(dialog).toBeVisible();
      verify(true,'Keyboard selection and Escape close the dropdown while retaining its modal');
      await page.screenshot({path:`${directory}/modal-${viewport.width}.png`});
    }
    await page.keyboard.press('Escape');await page.goto(url+'/admin/dashboard/courses/7days-freelance');
    const category=page.getByRole('combobox');await expect(category).toBeVisible();
    const before=await page.locator('select[name="category"]').inputValue();await category.click();await page.getByRole('option').filter({hasText:'تصميم جرافيك'}).first().click();
    verify(await page.locator('select[name="category"]').inputValue()!==before,'Course custom dropdown updates the native form value');
    await page.getByRole('checkbox').uncheck();verify(!(await page.getByRole('checkbox').isChecked()),'Course published checkbox uses native semantics');
    verify(errors.length===0,'Custom controls produce no browser runtime errors');
    await page.getByRole('button',{name:'قائمة الحساب',exact:true}).click();await page.getByRole('button',{name:'تسجيل الخروج',exact:true}).click();await expect(page).toHaveURL(/login/);
    await page.getByLabel('البريد الإلكتروني',{exact:true}).fill(student.email);await page.getByLabel('كلمة المرور',{exact:true}).fill(student.password);
    await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await expect(page).toHaveURL(url+'/dashboard');
    await page.goto(url+'/dashboard/settings');
    const username=page.getByLabel('اسم المستخدم',{exact:true});await expect(username).toBeVisible();await username.fill('browser-chosen');
    const settingsForm=page.locator('.lms-account-stack form').first();await settingsForm.getByRole('button',{name:'حفظ التغييرات',exact:true}).click();await expect(settingsForm.getByRole('status')).toBeVisible();await page.reload();
    await expect(username).toHaveValue('browser-chosen');await page.setViewportSize({width:390,height:844});await page.screenshot({path:`${directory}/profile-390.png`,fullPage:true});verify(true,'Student can edit username and keep it after refresh');
  } finally { await browser.close(); }
};
