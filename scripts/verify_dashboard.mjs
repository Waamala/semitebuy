import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

console.log('1. Open login page');
await page.goto('http://127.0.0.1:3001/users/sign_in', { waitUntil: 'networkidle' });

console.log('2. Fill and submit');
await page.fill('input[name="user[email]"]', 'ivan.test@example.com');
await page.fill('input[name="user[password]"]', 'password123');
await page.click('input[type="submit"]');
await page.waitForLoadState('networkidle');
console.log('  URL after login:', page.url());

console.log('3. Go to dashboard');
await page.goto('http://127.0.0.1:3001/dashboard', { waitUntil: 'networkidle' });
console.log('  URL:', page.url());
await page.screenshot({ path: '/home/z/my-project/download/dashboard_loggedin.png', fullPage: true });

console.log('4. Extract page content for verification');
const bodyText = await page.locator('body').innerText();
const has_greeting = bodyText.includes('Привет');
const has_role = bodyText.includes('организатор');
const has_stats = bodyText.includes('Активные закупки');
console.log('  has_greeting:', has_greeting);
console.log('  has_role_organizer:', has_role);
console.log('  has_stats:', has_stats);

console.log('5. Open user menu');
await page.locator('button:has-text("Иван")').click();
await page.waitForTimeout(500);
await page.screenshot({ path: '/home/z/my-project/download/dashboard_user_menu.png', fullPage: true });
const menuText = await page.locator('body').innerText();
console.log('  has_logout:', menuText.includes('Выйти'));
console.log('  has_profile_link:', menuText.includes('Настройки профиля'));

await browser.close();
console.log('OK');
