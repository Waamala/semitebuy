import { chromium } from 'playwright';

const pages = [
  { url: 'http://127.0.0.1:3001/',           name: 'home' },
  { url: 'http://127.0.0.1:3001/ui_kit',     name: 'ui_kit' },
  { url: 'http://127.0.0.1:3001/users/sign_in', name: 'sign_in' },
  { url: 'http://127.0.0.1:3001/users/sign_up', name: 'sign_up' }
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

for (const p of pages) {
  console.log('Opening:', p.url);
  try {
    await page.goto(p.url, { waitUntil: 'networkidle', timeout: 15000 });
    await page.screenshot({
      path: `/home/z/my-project/download/${p.name}.png`,
      fullPage: true
    });
    console.log('  saved', p.name);
  } catch (e) {
    console.error('  failed', p.url, e.message);
  }
}

await browser.close();
console.log('OK');
