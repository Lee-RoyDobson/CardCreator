import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{
const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:5173');await page.locator('h1').waitFor();
await page.locator('[data-field=name]').fill('Test Guardian');assert.match(await page.locator('#preview').innerText(),/Test Guardian/);
await page.reload();assert.equal(await page.locator('[data-field=name]').inputValue(),'Test Guardian');
await page.locator('#duplicate').click();assert.equal(await page.locator('.library-card').count(),4);
await page.locator('[data-field=quantity]').fill('10');
await page.locator('[data-tab=design]').click();await page.locator('[data-layout=minimal]').click();assert.equal(await page.locator('#preview .minimal').count(),1);
await page.locator('[data-tab=content]').click();
await page.locator('#art-upload').setInputFiles({name:'pixel.png',mimeType:'image/png',buffer:await page.screenshot()});
await page.locator('#preview img').waitFor();
const downloadPromise=page.waitForEvent('download');await page.locator('#export').click();const download=await downloadPromise;const path=await download.path();
await page.locator('[data-field=name]').fill('Changed');page.once('dialog',d=>d.accept());await page.locator('#project-import').setInputFiles(path);await page.waitForFunction(()=>document.querySelector('[data-field=name]').value==='Test Guardian');
await page.evaluate(()=>window.print=()=>{});await page.locator('#print').click();assert.equal(await page.locator('.print-page').count(),2);assert.equal(await page.locator('#print-sheets .game-card').count(),13);
await page.emulateMedia({media:'print'});const bounds=await page.locator('#print-sheets .game-card').first().boundingBox();assert.ok(Math.abs(bounds.width-63*96/25.4)<1);assert.ok(Math.abs(bounds.height-88*96/25.4)<1);await page.pdf({path:'/tmp/cardcreator-print.pdf',preferCSSPageSize:true,printBackground:true});
await page.emulateMedia({media:'screen'});await page.evaluate(()=>localStorage.clear());await page.reload();await page.screenshot({path:'/tmp/cardcreator-desktop.png',fullPage:true});
await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:'/tmp/cardcreator-mobile.png',fullPage:true});
assert.deepEqual(errors,[]);console.log('PASS: edit, persistence, duplicate, quantities, layouts, image upload, JSON round-trip, print pagination and dimensions, mobile width, and no browser errors.');
}finally{await browser.close();}
