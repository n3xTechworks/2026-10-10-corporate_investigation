'use strict';
/* Static checks across every root-level *.html page. No dependencies.
   Pages listed in EXPECTED_PAGES that do not exist yet are reported as SKIPPED (not failed);
   anything that exists is held to every rule. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const EXPECTED_PAGES = ['index.html', 'home-2.html', 'about.html', 'services.html', 'blog.html', 'blog-post.html', 'contact.html', '404.html'];

const pages = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html')).sort();
const missing = EXPECTED_PAGES.filter((p) => !pages.includes(p));
const unexpected = pages.filter((p) => !EXPECTED_PAGES.includes(p));

/* ---------------------------------------------------------------- helpers */
function read(file) { return fs.readFileSync(path.join(ROOT, file), 'utf8'); }

// Remove comments; blank out inline script bodies (keep the tags so src is still visible)
function clean(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/(<script\b[^>]*>)[\s\S]*?(<\/script>)/gi, '$1$2');
}

function parseAttrs(s) {
  const attrs = {};
  const re = /([^\s"'<>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let m;
  while ((m = re.exec(s))) {
    attrs[m[1].toLowerCase()] = m[2] !== undefined ? m[2] : m[3] !== undefined ? m[3] : m[4] !== undefined ? m[4] : '';
  }
  return attrs;
}

function tags(html, name) {
  const out = [];
  const re = new RegExp('<' + name + '\\b([^>]*)>', 'gi');
  let m;
  while ((m = re.exec(html))) out.push({ raw: m[0], attrs: parseAttrs(m[1]), index: m.index });
  return out;
}

function ids(html) {
  const set = new Set();
  const re = /\sid\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;
  let m;
  while ((m = re.exec(html))) set.add(m[1] || m[2] || m[3]);
  return set;
}

function between(html, openRe, closeTag) {
  const m = openRe.exec(html);
  if (!m) return null;
  const end = html.indexOf(closeTag, m.index);
  return end === -1 ? null : html.slice(m.index, end + closeTag.length);
}

function normalise(fragment) {
  return fragment
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\saria-current\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/>\s+</g, '><')
    .replace(/\s+/g, ' ')
    .trim();
}

const getHeader = (html) => between(html, /<header\b[^>]*class\s*=\s*"[^"]*\bsite-header\b[^"]*"[^>]*>/i, '</header>');
const getFooter = (html) => between(html, /<footer\b[^>]*class\s*=\s*"[^"]*\bsite-footer\b[^"]*"[^>]*>/i, '</footer>');

function isExternal(u) { return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(u); }

const cache = {};
function load(file) {
  if (!cache[file]) { const raw = read(file); cache[file] = { raw, html: clean(raw) }; }
  return cache[file];
}

/* ------------------------------------------------------------ suite-level */
test('site: at least one page exists', () => {
  assert.ok(pages.length > 0, 'no root-level *.html pages found');
});

test('site: all expected pages exist', { skip: missing.length ? 'SKIPPED - not built yet: ' + missing.join(', ') : false }, () => {
  assert.deepEqual(missing, []);
});

test('site: no unexpected root pages', () => {
  assert.deepEqual(unexpected, [], 'unexpected pages: ' + unexpected.join(', '));
});

/* -------------------------------------------------------------- per page */
for (const file of pages) {
  test('page ' + file, async (t) => {
    const { html } = load(file);

    await t.test('has a doctype, lang, and a non-empty <title>', () => {
      assert.match(html, /^\s*<!DOCTYPE html>/i);
      assert.match(html, /<html\b[^>]*\blang="[a-z-]+"/i);
      assert.match(html, /<title>[^<]{3,}<\/title>/i);
    });

    await t.test('has exactly one <h1>', () => {
      const n = (html.match(/<h1\b/gi) || []).length;
      assert.equal(n, 1, file + ' has ' + n + ' <h1>');
    });

    await t.test('has favicon link(s)', () => {
      const icons = tags(html, 'link').filter((l) => /\bicon\b/i.test(l.attrs.rel || ''));
      assert.ok(icons.length >= 1, 'no <link rel="icon">');
      for (const l of icons) assert.ok(l.attrs.href, 'icon link without href');
    });

    await t.test('has no style="" attributes and no <style> blocks', () => {
      assert.doesNotMatch(html, /\sstyle\s*=/i, 'inline style attribute found');
      assert.doesNotMatch(html, /<style\b/i, '<style> element found');
    });

    await t.test('every <img> has alt, width and height', () => {
      const imgs = tags(html, 'img');
      for (const img of imgs) {
        const label = img.attrs.src || img.raw;
        assert.ok('alt' in img.attrs, 'missing alt: ' + label);
        assert.ok(/^\d+$/.test(img.attrs.width || ''), 'missing/invalid width: ' + label);
        assert.ok(/^\d+$/.test(img.attrs.height || ''), 'missing/invalid height: ' + label);
      }
    });

    await t.test('no image is used twice on the page', () => {
      const seen = new Map();
      for (const img of tags(html, 'img')) {
        const src = img.attrs.src || '';
        if (!src.startsWith('assets/img/')) continue;
        seen.set(src, (seen.get(src) || 0) + 1);
      }
      const dup = [...seen].filter(([, n]) => n > 1).map(([s]) => s);
      assert.deepEqual(dup, [], 'duplicated on page: ' + dup.join(', '));
    });

    await t.test('every local href/src resolves to an existing file (and #fragment exists)', () => {
      const refs = [];
      for (const [name, attr] of [['a', 'href'], ['link', 'href'], ['script', 'src'], ['img', 'src'], ['source', 'src'], ['source', 'srcset'], ['iframe', 'src']]) {
        for (const el of tags(html, name)) if (el.attrs[attr]) refs.push({ name, attr, value: el.attrs[attr].trim() });
      }
      const problems = [];
      for (const r of refs) {
        let v = r.value;
        if (!v || v === '#' || isExternal(v) || v.startsWith('data:')) continue;
        if (r.attr === 'srcset') v = v.split(',')[0].trim().split(/\s+/)[0];
        const hashAt = v.indexOf('#');
        const frag = hashAt === -1 ? '' : decodeURIComponent(v.slice(hashAt + 1));
        const filePart = (hashAt === -1 ? v : v.slice(0, hashAt)).split('?')[0];
        const target = filePart === '' ? file : decodeURI(filePart);
        if (missing.includes(target)) continue;                      // page not built yet: tolerated, see skipped note above
        const abs = path.join(ROOT, target);
        if (!abs.startsWith(ROOT) || !fs.existsSync(abs) || fs.statSync(abs).isDirectory()) {
          problems.push('missing file: ' + r.value);
          continue;
        }
        if (frag && target.endsWith('.html') && !ids(load(target).html).has(frag)) {
          problems.push('missing #' + frag + ' in ' + target + ' (from ' + r.value + ')');
        }
      }
      assert.deepEqual(problems, []);
    });

    await t.test('header: logo links to index.html; Home dropdown has index.html + home-2.html; primary CTA is "Request Consultation" -> contact.html', () => {
      const header = getHeader(html);
      assert.ok(header, 'no <header class="site-header">');
      const brand = tags(header, 'a').find((a) => /\bbrand\b/.test(a.attrs.class || ''));
      assert.ok(brand, 'no .brand link in header');
      assert.equal(brand.attrs.href, 'index.html', 'header logo must link to index.html');

      const dd = between(header, /<ul\b[^>]*class\s*=\s*"[^"]*\bdropdown\b[^"]*"[^>]*>/i, '</ul>');
      assert.ok(dd, 'no Home dropdown');
      const hrefs = tags(dd, 'a').map((a) => a.attrs.href);
      assert.ok(hrefs.includes('index.html'), 'dropdown lacks index.html');
      assert.ok(hrefs.includes('home-2.html'), 'dropdown lacks home-2.html');

      const navLinks = tags(header, 'a').map((a) => a.attrs.href);
      for (const want of ['about.html', 'services.html', 'blog.html', 'contact.html']) assert.ok(navLinks.includes(want), 'nav lacks ' + want);

      const m = /<a\b[^>]*class\s*=\s*"[^"]*\bbtn-primary\b[^"]*\bbtn-cta\b[^"]*"[^>]*>([\s\S]*?)<\/a>/i.exec(header);
      assert.ok(m, 'no .btn-primary.btn-cta in header');
      assert.equal(parseAttrs(m[0].slice(2, m[0].indexOf('>'))).href, 'contact.html');
      assert.match(m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(), /^Request Consultation$/);
    });

    await t.test('footer: logo links to index.html', () => {
      const footer = getFooter(html);
      assert.ok(footer, 'no <footer class="site-footer">');
      const brand = tags(footer, 'a').find((a) => /\bbrand\b/.test(a.attrs.class || ''));
      assert.ok(brand, 'no .brand link in footer');
      assert.equal(brand.attrs.href, 'index.html');
    });

    await t.test('has <main id="main">, skip link and both scripts', () => {
      assert.match(html, /<main\b[^>]*\bid="main"/i);
      assert.match(html, /<a\b[^>]*class="skip-link"[^>]*href="#main"|<a\b[^>]*href="#main"[^>]*class="skip-link"/i);
      assert.match(html, /<script\b[^>]*src="assets\/js\/validation\.js"/i);
      assert.match(html, /<script\b[^>]*src="assets\/js\/main\.js"/i);
      assert.match(html, /<link\b[^>]*href="assets\/css\/style\.css"/i);
    });

    await t.test('mentions no forbidden word ("classified")', () => {
      assert.doesNotMatch(html.replace(/<[^>]+>/g, ' '), /\bclassified\b/i);
    });
  });
}

/* ----------------------------------------------------------- cross-page */
test('shared header and footer markup is identical on every page (aria-current aside)', async (t) => {
  const tpl = fs.existsSync(path.join(ROOT, 'docs', 'template.html')) ? clean(read('docs/template.html')) : null;
  const refHeader = tpl ? normalise(getHeader(tpl)) : null;
  const refFooter = tpl ? normalise(getFooter(tpl)) : null;
  let baseH = refHeader, baseF = refFooter, baseName = tpl ? 'docs/template.html' : null;

  for (const file of pages) {
    const { html } = load(file);
    const h = getHeader(html), f = getFooter(html);
    assert.ok(h && f, file + ': header/footer missing');
    const nh = normalise(h), nf = normalise(f);
    if (baseH === null) { baseH = nh; baseF = nf; baseName = file; continue; }
    await t.test(file + ' header matches ' + baseName, () => assert.equal(nh, baseH));
    await t.test(file + ' footer matches ' + baseName, () => assert.equal(nf, baseF));
  }
});

test('each page marks its own nav link with aria-current (HTML only)', () => {
  const expected = { 'about.html': 'about.html', 'services.html': 'services.html', 'blog.html': 'blog.html', 'blog-post.html': 'blog.html', 'contact.html': 'contact.html' };
  const problems = [];
  for (const file of pages) {
    if (!(file in expected)) continue;
    const header = getHeader(load(file).html);
    const current = tags(header, 'a').filter((a) => 'aria-current' in a.attrs && /\bnav-link\b/.test(a.attrs.class || ''));
    if (current.length !== 1 || current[0].attrs.href !== expected[file]) {
      problems.push(file + ': expected aria-current on ' + expected[file] + ', found ' + (current.map((c) => c.attrs.href).join(', ') || 'none'));
    }
  }
  assert.deepEqual(problems, []);
});

test('no image (assets/img/*) is used on more than one page', () => {
  const owners = new Map();
  for (const file of pages) {
    const { html } = load(file);
    for (const img of tags(html, 'img')) {
      const src = img.attrs.src || '';
      if (!src.startsWith('assets/img/')) continue;
      if (!owners.has(src)) owners.set(src, new Set());
      owners.get(src).add(file);
    }
  }
  const dup = [...owners].filter(([, s]) => s.size > 1).map(([src, s]) => src + ' -> ' + [...s].join(', '));
  assert.deepEqual(dup, [], 'images reused across pages:\n' + dup.join('\n'));
});

test('every referenced assets/img file exists on disk and is .webp', () => {
  const problems = [];
  for (const file of pages) {
    for (const img of tags(load(file).html, 'img')) {
      const src = img.attrs.src || '';
      if (!src.startsWith('assets/img/')) continue;
      if (!src.endsWith('.webp')) problems.push(file + ': not webp: ' + src);
      if (!fs.existsSync(path.join(ROOT, src))) problems.push(file + ': missing ' + src);
    }
  }
  assert.deepEqual(problems, []);
});

test('document ids are unique within each page', () => {
  const problems = [];
  for (const file of pages) {
    const seen = new Set();
    const re = /\sid\s*=\s*"([^"]*)"/gi;
    let m;
    const html = load(file).html;
    while ((m = re.exec(html))) {
      if (seen.has(m[1])) problems.push(file + ': duplicate id "' + m[1] + '"');
      seen.add(m[1]);
    }
  }
  assert.deepEqual(problems, []);
});
