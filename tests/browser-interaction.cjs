// Browser interaction test for the Calder Voss site (real Chrome via playwright-core).
// Named *.cjs without ".test" so `npm test` (node --test) does not pick it up; it needs playwright-core.
// Run from this folder:
//   NODE_PATH=C:/Users/ELCOT/Downloads/qa-tools/node_modules node tests/browser-interaction.cjs
// Optional: set TEMP/TMP to a scratch folder (Chrome profile goes there). Exit code 1 on any failure.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const ROOT = path.resolve(__dirname, '..');
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PAGES = ['index.html', 'home-2.html', 'about.html', 'services.html', 'blog.html', 'blog-post.html', 'contact.html', '404.html'];
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.webp': 'image/webp', '.woff2': 'font/woff2' };

const server = http.createServer((req, res) => {
  const p = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
  const file = path.join(ROOT, p === '/' ? 'index.html' : p);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end('404'); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

const results = [];
async function test(name, fn) {
  try { await fn(); results.push({ name, ok: true }); console.log(`  PASS ${name}`); }
  catch (e) { results.push({ name, ok: false, err: e.message }); console.log(`  FAIL ${name}\n       ${e.message.split('\n')[0]}`); }
}
function assert(cond, msg) { if (!cond) throw new Error(msg); }

(async () => {
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const BASE = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const problems = [];
  const external = new Set();

  async function newPage(width = 1440, opts = {}) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce', colorScheme: 'light', hasTouch: !!opts.touch });
    const page = await ctx.newPage();
    page.on('console', (m) => { if (m.type() === 'error') problems.push(`${page.url()}: console: ${m.text()}`); });
    page.on('pageerror', (e) => problems.push(`${page.url()}: pageerror: ${e.message}`));
    page.on('requestfailed', (r) => { if (r.url().startsWith(BASE)) problems.push(`failed request ${r.url()}`); });
    page.on('request', (r) => { if (!r.url().startsWith(BASE) && !r.url().startsWith('data:')) external.add(new URL(r.url()).host); });
    return { ctx, page };
  }
  const go = (page, p) => page.goto(BASE + p, { waitUntil: 'load' });

  try {
    console.log('Calder Voss (10) browser interaction test');

    await test('every page loads with no console errors, page errors or failed local requests', async () => {
      const { ctx, page } = await newPage();
      for (const p of PAGES) { await go(page, p); await page.waitForTimeout(150); }
      await ctx.close();
      assert(!problems.length, problems.join('\n'));
    });

    await test('no login, sign-up or dashboard pages or links (client brief: no dashboard)', async () => {
      for (const f of ['login.html', 'signup.html', 'dashboard.html']) assert(!fs.existsSync(path.join(ROOT, f)), `${f} exists`);
      const { ctx, page } = await newPage();
      for (const p of PAGES) {
        await go(page, p);
        const bad = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')).filter((h) => /login|sign-?up|dashboard/i.test(h)));
        assert(!bad.length, `${p}: ${bad}`);
      }
      await ctx.close();
    });

    await test('Home dropdown: click, outside click, hover, keyboard and Escape', async () => {
      const { ctx, page } = await newPage(1440);
      await go(page, 'about.html');
      const item = page.locator('.site-header .has-dropdown');
      const btn = item.locator('[data-dropdown-toggle]');
      const menu = page.locator('#nav-home-menu');
      await btn.click();
      assert(await menu.isVisible(), 'click did not open the menu');
      assert(await btn.getAttribute('aria-expanded') === 'true', 'aria-expanded not true');
      await page.mouse.move(700, 600);
      await page.mouse.click(700, 600);
      await page.waitForTimeout(300);
      assert(!(await menu.isVisible()), 'outside click did not close the menu');
      await btn.hover();
      await page.waitForTimeout(250);
      assert(await menu.isVisible(), 'hover did not open the menu');
      await page.mouse.move(700, 700);
      await page.waitForTimeout(450);
      assert(!(await menu.isVisible()), 'mouse leave did not close the menu');
      await btn.focus();
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(250);
      assert(await page.evaluate(() => document.activeElement.classList.contains('dropdown-link')), 'ArrowDown did not focus the first link');
      await page.keyboard.press('ArrowDown');
      assert(await page.evaluate(() => document.activeElement.getAttribute('href')) === 'home-2.html', 'ArrowDown did not move to Home 2');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      assert(!(await menu.isVisible()), 'Escape did not close the menu');
      assert(await page.evaluate(() => document.activeElement.hasAttribute('data-dropdown-toggle')), 'focus did not return to the toggle');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(250);
      assert(await menu.isVisible(), 'Enter did not open the menu');
      const links = await menu.locator('a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
      assert(links.join() === 'index.html,home-2.html', `dropdown links: ${links}`);
      await ctx.close();
    });

    await test('mobile menu opens, closes (button, Escape, link) with no overflow at 360px', async () => {
      const { ctx, page } = await newPage(360, { touch: true });
      await go(page, 'index.html');
      const t = page.locator('[data-nav-toggle]');
      const nav = page.locator('#site-nav');
      await t.click();
      await page.waitForTimeout(350);
      assert(await t.getAttribute('aria-expanded') === 'true' && await nav.evaluate((n) => n.classList.contains('is-open')), 'drawer did not open');
      assert(await nav.locator('a[href="services.html"]').isVisible(), 'drawer links not visible');
      await t.click();
      await page.waitForTimeout(350);
      assert(await t.getAttribute('aria-expanded') === 'false', 'drawer did not close');
      await t.click();
      await page.keyboard.press('Escape');
      assert(await t.getAttribute('aria-expanded') === 'false', 'Escape did not close the drawer');
      await t.click();
      await page.waitForTimeout(350);
      await nav.locator('.has-dropdown [data-dropdown-toggle]').click();
      await nav.locator('a[href="home-2.html"]').click();
      await page.waitForURL('**/home-2.html');
      for (const p of PAGES) {
        await go(page, p);
        const sw = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        assert(sw <= 0, `${p}: horizontal scroll of ${sw}px at 360px`);
      }
      await ctx.close();
    });

    await test('theme and RTL toggles work and persist across pages', async () => {
      const { ctx, page } = await newPage(1440);
      await go(page, 'index.html');
      await page.evaluate(() => localStorage.clear());
      await go(page, 'index.html');
      const theme = () => page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      const dir = () => page.evaluate(() => document.documentElement.getAttribute('dir'));
      await page.locator('.site-header [data-theme-toggle]').click();
      assert(await theme() === 'dark', 'theme toggle did not switch to dark');
      await page.locator('.site-header [data-rtl-toggle]').click();
      assert(await dir() === 'rtl', 'RTL toggle did not set dir=rtl');
      for (const p of ['services.html', 'blog-post.html', 'contact.html', '404.html']) {
        await go(page, p);
        assert(await theme() === 'dark', `${p}: dark theme not persisted`);
        assert(await dir() === 'rtl', `${p}: RTL not persisted`);
        const sw = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        assert(sw <= 0, `${p}: overflow ${sw}px in RTL`);
      }
      await page.locator('.site-header [data-theme-toggle]').click();
      await page.locator('.site-header [data-rtl-toggle]').click();
      await go(page, 'about.html');
      assert(await theme() !== 'dark' && await dir() !== 'rtl', 'switching back did not persist');
      const sizes = await page.evaluate(() => ['[data-theme-toggle]', '[data-rtl-toggle]', '.btn-cta'].map((s) => {
        const el = document.querySelector('.site-header ' + s); const cs = getComputedStyle(el);
        return `${el.getBoundingClientRect().height}/${cs.borderTopLeftRadius}`;
      }));
      assert(new Set(sizes).size === 1, `toggle/CTA height or radius differ: ${sizes}`);
      await ctx.close();
    });

    await test('every header and footer link resolves; logo is the same and links home', async () => {
      const { ctx, page } = await newPage(1440);
      let ref = null;
      for (const p of PAGES) {
        await go(page, p);
        const hrefs = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')));
        for (const h of hrefs) {
          if (/^(https?:|mailto:|tel:|#)/.test(h)) continue;
          assert(fs.existsSync(path.join(ROOT, h.split('#')[0].split('?')[0])), `${p}: broken link ${h}`);
        }
        const logo = await page.evaluate(() => { const a = document.querySelector('.site-header a.brand'); const r = a.querySelector('img').getBoundingClientRect(); return `${a.getAttribute('href')}:${r.width}x${r.height}`; });
        ref ??= logo;
        assert(logo === ref && logo.startsWith('index.html:'), `${p}: logo ${logo} vs ${ref}`);
        const social = await page.locator('.site-footer ul.social a').count();
        assert(social >= 3, `${p}: only ${social} social links`);
      }
      await go(page, 'index.html');
      for (const h of ['about.html', 'services.html', 'blog.html', 'contact.html']) {
        await page.locator(`#site-nav a.nav-link[href="${h}"]`).click();
        await page.waitForURL('**/' + h);
      }
      await page.locator('.site-header .btn-cta').click();
      await page.waitForURL('**/contact.html');
      const tel = await page.evaluate(() => [...document.querySelectorAll('a[href^="tel:"], a[href^="mailto:"]')].map((a) => a.getAttribute('href')));
      assert(tel.length && tel.every((h) => /^tel:\+\d{8,15}$/.test(h) || /^mailto:[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(h)), `bad tel/mailto: ${tel}`);
      await ctx.close();
    });

    await test('confidential contact form rejects bad input, keeps it, and shows a demo-only success', async () => {
      const { ctx, page } = await newPage(1440);
      await go(page, 'contact.html');
      const err = (id) => page.evaluate((id) => {
        const el = document.getElementById(id);
        const box = document.getElementById(id + '-error');
        return { invalid: el.getAttribute('aria-invalid'), msg: box.textContent, live: box.getAttribute('aria-live'), described: (el.getAttribute('aria-describedby') || '').includes(id + '-error') };
      }, id);
      const submit = () => page.locator('#contact-form button[type="submit"]').click();
      const cases = [['cf-name', 'J0hn'], ['cf-name', 'A'], ['cf-name', '   '], ['cf-email', 'user.example.com'], ['cf-email', 'user@domain'], ['cf-email', '   '], ['cf-message', '          ']];
      for (const [id, val] of cases) {
        await page.fill('#' + id, val);
        await submit();
        const e = await err(id);
        assert(e.invalid === 'true' && e.msg && e.live === 'polite' && e.described, `${id}="${val}" not rejected accessibly (${JSON.stringify(e)})`);
        assert((await page.inputValue('#' + id)).trim() === val.trim(), `${id} input not kept after invalid submit`);
      }
      await page.fill('#cf-phone', '');
      await page.type('#cf-phone', '212abc555');
      assert(await page.inputValue('#cf-phone') === '212555', `typed letters not stripped: ${await page.inputValue('#cf-phone')}`);
      assert((await err('cf-phone')).msg.length > 0, 'no message for typed letters');
      await page.evaluate(() => { const i = document.getElementById('cf-phone'); i.value = '+1 (212) 555-0148'; i.dispatchEvent(new Event('input', { bubbles: true })); });
      assert(await page.inputValue('#cf-phone') === '12125550148', 'pasted symbols not stripped');
      const requests = [];
      page.on('request', (r) => requests.push(r.url()));
      await page.fill('#cf-name', 'Dr. Jane Whitfield');
      await page.fill('#cf-email', 'jane@company.com');
      await page.fill('#cf-phone', '12125550148');
      await page.selectOption('#cf-topic', { index: 2 });
      await page.fill('#cf-message', 'We need a background check on a prospective board member.');
      await page.locator('#cf-consent').check();
      await submit();
      const success = page.locator('#contact-form .form-success');
      await success.waitFor({ state: 'visible' });
      const text = await success.innerText();
      assert(/nothing has been sent/i.test(text) && !/received/i.test(text), `success text: ${text}`);
      assert(!requests.filter((u) => u.startsWith('http') && !/\.(woff2?|css|js|webp|svg|png)(\?|$)/.test(u)).length, `valid submit made requests: ${requests}`);
      await page.locator('[data-form-reset]').click();
      assert(await page.locator('#cf-name').isVisible(), '"Send another" did not bring the form back');
      await ctx.close();
    });

    await test('newsletter forms validate and show a demo-only success', async () => {
      const { ctx, page } = await newPage(1440);
      await go(page, 'blog.html');
      for (const id of ['bn-email', 'nl-email']) {
        const form = page.locator(`form:has(#${id})`);
        await page.fill('#' + id, 'nope@');
        await form.locator('button[type="submit"]').click();
        assert(await page.locator('#' + id).getAttribute('aria-invalid') === 'true', `${id}: "nope@" accepted`);
        await page.fill('#' + id, 'reader@company.com');
        await form.locator('button[type="submit"]').click();
        const t = await form.locator('.form-success').innerText();
        assert(/nothing has been sent/i.test(t), `${id} success: ${t}`);
      }
      await ctx.close();
    });

    await test('FAQ accordion toggles (click + keyboard, one open at a time); map embed is valid', async () => {
      const { ctx, page } = await newPage(1440);
      await go(page, 'contact.html');
      const items = page.locator('#faq details');
      assert(await items.count() >= 4, 'fewer than 4 FAQ items');
      await items.nth(1).locator('summary').click();
      assert(await items.nth(1).evaluate((d) => d.open), 'click did not open item 2');
      assert(!(await items.nth(0).evaluate((d) => d.open)), 'item 1 stayed open (should be exclusive)');
      await items.nth(2).locator('summary').focus();
      await page.keyboard.press('Enter');
      assert(await items.nth(2).evaluate((d) => d.open), 'keyboard did not open item 3');
      const src = await page.locator('.map-embed iframe').getAttribute('src');
      assert(/^https:\/\/www\.openstreetmap\.org\/export\/embed\.html\?bbox=[-\d.%C,]+&layer=mapnik&marker=[-\d.%C,]+$/.test(src), `map src: ${src}`);
      const box = await page.locator('.map-embed iframe').boundingBox();
      assert(box.width > 200 && box.height > 200, 'map iframe too small');
      await ctx.close();
    });

    await test('no console errors across the whole run', async () => {
      assert(!problems.length, problems.join('\n'));
    });
  } finally {
    await browser.close();
    server.close();
  }
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed. External hosts contacted: ${[...external].join(', ') || 'none'}`);
  process.exit(failed.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
