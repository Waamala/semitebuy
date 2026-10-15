import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const SHOTS = '/home/z/my-project/download';

async function shot(name) {
  await page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: true });
  console.log('  shot:', name);
}

console.log('1. Open login page (user is now confirmed)');
await page.goto('http://127.0.0.1:3001/users/sign_in', { waitUntil: 'networkidle' });
await page.fill('input[name="user[email]"]', 'ivan.test@example.com');
await page.fill('input[name="user[password]"]', 'password123');
await shot('flow_07_login_after_confirm');

console.log('2. Submit');
await page.click('input[type="submit"]');
await page.waitForLoadState('networkidle');
await shot('flow_08_after_login');
console.log('  URL after login:', page.url());

console.log('3. Try to open dashboard (authenticated)');
await page.goto('http://127.0.0.1:3001/dashboard', { waitUntil: 'networkidle' });
await shot('flow_09_dashboard');
console.log('  URL:', page.url());

console.log('4. Open user menu (dropdown)');
// Try to click the user menu button (the one with initials)
const menuBtn = page.locator('button:has-text("Иван")').first();
if (await menuBtn.count() > 0) {
  await menuBtn.click();
  await page.waitForTimeout(500);
  await shot('flow_10_user_menu');
}

await browser.close();
console.log('OK');
