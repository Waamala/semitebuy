import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const SHOTS = '/home/z/my-project/download';

async function shot(name) {
  await page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: true });
  console.log('  shot:', name);
}

console.log('1. Open sign_up page');
await page.goto('http://127.0.0.1:3001/users/sign_up', { waitUntil: 'networkidle' });
await shot('flow_01_sign_up');

console.log('2. Fill registration form');
await page.fill('input[name="user[first_name]"]', 'Иван');
await page.fill('input[name="user[last_name]"]', 'Петров');
await page.fill('input[name="user[email]"]', 'ivan.test@example.com');
await page.fill('input[name="user[phone]"]', '+7 (900) 123-45-67');
await page.fill('input[name="user[city]"]', 'Москва');
await page.fill('input[name="user[password]"]', 'password123');
await page.fill('input[name="user[password_confirmation]"]', 'password123');

// Choose role = organizer (click on the label that wraps the radio)
await page.click('label:has(input[name="user[role_choice]"][value="organizer"])');
await page.check('input[name="agreement"]');
await shot('flow_02_form_filled');

console.log('3. Submit form');
await page.click('input[type="submit"]');
await page.waitForLoadState('networkidle');
await shot('flow_03_after_register');

console.log('4. Try login (skip confirm for demo — auto-confirm user via Rails)');
// We'll just go to login page directly
await page.goto('http://127.0.0.1:3001/users/sign_in', { waitUntil: 'networkidle' });
await shot('flow_04_login');

console.log('5. Fill login form');
await page.fill('input[name="user[email]"]', 'ivan.test@example.com');
await page.fill('input[name="user[password]"]', 'password123');
await shot('flow_05_login_filled');

console.log('6. Submit login');
await page.click('input[type="submit"]');
await page.waitForLoadState('networkidle');
await shot('flow_06_after_login');

console.log('7. Final URL:', page.url());

await browser.close();
console.log('OK');
