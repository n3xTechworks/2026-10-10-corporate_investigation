# Calder Voss — Component Catalogue

Source of truth: `assets/css/style.css`, `assets/js/main.js`, `assets/js/validation.js`.
Worked, copy-ready markup for every item below lives in `docs/template.html` (copy it verbatim; keep
`<head>`, header, footer, back-to-top, scripts untouched). Contract: `docs/DESIGN.md`.

**Hard rules:** no inline `<style>`, no extra CSS/JS libraries, no new font families, no inline `style=""`
(use utilities), no icons for services/values/steps (photos only), logical CSS only (RTL is automatic),
no image reused on a page or across pages, hero/banner ≤ 2 CTAs, never write "classified".

---
## 1. Page shell
```
<html lang="en" dir="ltr">  <head> … </head>
<body>
  <a class="skip-link" href="#main">…</a>
  <header class="site-header"> … </header>         (verbatim)
  <main id="main"> … sections … </main>
  <footer class="site-footer"> … </footer>         (verbatim)
  <button class="icon-btn back-to-top" data-back-to-top …>
  <script src="assets/js/validation.js" defer></script><script src="assets/js/main.js" defer></script>
```
Head contains: favicon links (ico 48, svg, png 32, apple-touch 180), 2 font preloads
(`source-serif-4-latin.woff2`, `ibm-plex-sans-latin.woff2`, `crossorigin`), the one-line no-flash script
(sets `data-theme`, `dir`, `.js` before paint), then `assets/css/style.css`. Home pages also preload the hero image.
Per page change only: `<title>` (`Page | Calder Voss — Investigations & Due Diligence`), meta description, og tags.

### Marking the active nav link (HTML only — JS never sets `aria-current`)
- About/Services/Blog/Contact pages: add `aria-current="page"` to that `<a class="nav-link">`. (`blog-post.html` → Blog link.)
- Home 1 (`index.html`): `aria-current="true"` on the **Home `<button class="nav-link">`** AND `aria-current="page"` on `<a class="dropdown-link" href="index.html">`.
- Home 2 (`home-2.html`): same, on the `home-2.html` dropdown link.
- 404: no `aria-current`.
Active state draws a brass underline (nav) / brass left bar (dropdown) and weight 600.

## 2. Layout
| class | use |
|---|---|
| `.container` (`.container-narrow` 820px) | every section's inner wrapper |
| `.section` / `.section-alt` / `.section-inverse` / `.section-sm` | 112px/72px padding; alt = `--surface-2`; inverse = navy in both themes (tokens remap automatically, incl. cards, forms, eyebrow) |
| `.grid` + `.cols-2` `.cols-3` `.cols-4` | THE grid. gap 32. 4→2 ≤1024, →1 ≤768; cols-2/3 →1 ≤768. Modifiers `.gap-sm` `.gap-lg` `.items-center` `.items-start`; children `.col-span-full` `.col-span-2` |
| `.grid.split` (+`.is-reverse`) | media + body. Children `.split-media` / `.split-body`. Collapses to 1 col ≤1024 (media first). `.is-reverse` puts media on the other side (RTL-safe) |
| `.grid.cols-aside` | article + 340px sidebar (`<article>` + `<aside class="aside-sticky">`), stacks ≤1024 |
| `.cv-auto` | optional `content-visibility:auto` for heavy below-fold sections (not used in template; full-page screenshots may show it blank) |

Every section uses `.container > (section-head) > .grid…`. Don't invent other grids.

## 3. Media (always in a container, photos not icons)
`<div class="media ratio-4-3"><img src alt width height loading="lazy" decoding="async"></div>`
Ratios: `.ratio-4-3 .ratio-16-9 .ratio-1-1 .ratio-4-5 .ratio-5-4 .ratio-9-10 .ratio-20-13 (800×520) .ratio-12-7 (1200×700) .ratio-2-1 .ratio-16-10`.
Images: explicit `width`/`height` from the manifest; `loading="lazy" decoding="async"` except hero (`fetchpriority="high"`, no lazy).
`alt=""` for decorative card photos, descriptive alt for portraits/figures. `.media-caption` for captions.

## 4. Headings
```
<header class="section-head [is-center]">
  <p class="eyebrow">§ 02 — Services</p>   <!-- format: "§ NN — Label"; double brass hairline is automatic -->
  <h2>…</h2>
  <p class="lead">…</p>                      <!-- optional -->
</header>
```
- Default = start-aligned; `.is-center` = centered. Pick ONE per page for consistency (home pages: centered for card grids, start for split sections).
- Number folios increase down the page (`§ 01`, `§ 02` …). `.mb-0` when the head sits inside `.split-body`.
- `.eyebrow` alone (no hairline) = mono label (hero). `.label` same style. Min 13px, uppercase, .12em (set by CSS; never override).
- `.lead` 1.2rem muted; `.muted`, `.small`, `.text-center`.

## 5. Buttons & controls
```
<a class="btn btn-primary" href="contact.html">Request Consultation <svg class="icon icon-arrow" …></svg></a>
<a class="btn btn-secondary" href="…">Our services</a>
```
- `.btn` = 44px tall, 4px radius, 15px/600. `.btn-primary` is IDENTICAL in both themes (fill `#C9A55C`, navy text). `.btn-secondary` = transparent + `currentColor` border (works on dark sections). `.btn-block` full width.
- Primary CTA label is always **"Request Consultation"** + arrow (`.icon-arrow` mirrors in RTL). Wrap groups in `.actions` (`.is-center`).
- `.icon-btn` 44×44 square (theme/RTL/social/back-to-top/hamburger). Icons: inline SVG `class="icon"` (20px, stroke 1.75, `currentColor`, `aria-hidden="true" focusable="false"`); `.icon-fill` for filled glyphs; arrows `.icon-arrow`; backward arrow `.icon-prev`.
- Text link with arrow: `<a class="link-arrow">Label <svg class="icon icon-arrow"…></a>`.
- Toggle buttons: `data-theme-toggle` (`.theme-toggle`, moon + sun SVGs) and `data-rtl-toggle` (`.dir-toggle`, "RTL" + "LTR" spans). Both states are in the markup; CSS shows the next action off `[data-theme]` / `html[dir]`. JS only syncs `aria-label`, `aria-pressed` and `title`.

## 6. Hero / page banner
```
<section class="hero" aria-labelledby="t">
  <div class="hero-media"><img src="assets/img/hero/…" alt="" width height fetchpriority="high" decoding="async"></div>
  <div class="container hero-inner">
    <p class="eyebrow">Privileged &amp; Confidential · Ref. 0417</p>
    <h1 id="t">Know exactly who you are <span class="redact">dealing</span> with.</h1>
    <p class="lead">…</p>
    <div class="actions"><a class="btn btn-primary">…</a><a class="btn btn-secondary">…</a></div>
  </div>
</section>
```
- Centered, navy overlay ≥ .80 baked into `.hero-media::after` (stays dark in both themes, text ivory). **Max 2 CTAs. Exactly ONE `.redact` word per H1** (brass bar wipes off on load; `prefers-reduced-motion` → word just visible).
- `.page-banner`: same anatomy, shorter; add `<nav class="breadcrumb" aria-label="Breadcrumb"><ol><li><a href="index.html">Home</a></li><li><span aria-current="page">About</span></li></ol></nav>` before the eyebrow. No actions.
- Banner images are 1920×720, hero 1920×1080.

## 7. Cards (4px radius, flat, 1px border, brass 3px top rule on hover; whole card is clickable via the title link)
Base: `<article class="card [card-service|card-blog|card-team] reveal"> <div class="media card-media ratio-…"> … <div class="card-body"> … </div></article>`
- Body parts: `.card-index` (mono "01"), `.card-title` (`<h3 class="card-title"><a href>…</a></h3>` — stretched link), `.card-text`, `.card-meta`, `.card-link` (decorative `<span class="card-link link-arrow" aria-hidden="true">Learn more <svg…></span>`).
- **Service card**: `.card-service` — photo (ratio-4-3) + `.card-index` + title link + text + `.card-link`. Use in `.grid.cols-4` (home) or `.cols-3` (services page).
- **Blog card**: `.card-blog` — photo `.ratio-20-13`; `.card-meta` = `<span class="tag">Topic</span><time datetime>…</time><span>6 min read</span>`; title link; excerpt; `.card-link`.
- **Team card**: `.card-team` — photo `.ratio-1-1`; `<h3 class="card-title">Name</h3><p class="role">Title</p><p class="card-text">…</p>` (no link).
- **Testimonial**: `<figure class="card card-testimonial reveal"><blockquote><p>…</p></blockquote><figcaption class="person"><img class="avatar" width="56" height="56" alt=""><span><span class="person-name">…</span><span class="person-role">…</span></span></figcaption></figure>`. `.avatar` is ALWAYS a 56px circle (also in `.author-box`). Quote glyph is automatic.
- Cards in `.grid` auto-stretch to equal height. No shadows, no gradients.

## 8. Facts / stats strip
`<div class="grid cols-4 stats"><div class="stat reveal"><p class="stat-value">40+</p><p class="stat-label">…</p></div>…</div>` (2×2 on mobile). Works on `.section-alt` and `.section-inverse`. Modest, true-sounding numbers only; never success rates.

## 9. Process steps
`<ol class="grid cols-4 process"><li class="step"><span class="step-num">01</span><h3>…</h3><p>…</p></li>…</ol>`
Photo variant: add `.has-photos` and put `<div class="media ratio-4-3">…</div>` first in each `.step` (use `.cols-3`).

## 10. Feature split
`<div class="grid cols-2 split [is-reverse]"><div class="split-media"><div class="media ratio-9-10|ratio-5-4|ratio-4-5">…</div></div><div class="split-body"> head + text + `.checklist` + `.btn`</div></div>` — keep DOM order media → body; `.is-reverse` handles the visual flip.
`.checklist` = list with brass square bullets.

## 11. Credentials / logo strip (text only, no logos)
`<ul class="grid cols-4 credentials"><li class="credential"><span class="credential-mark">CFE</span><span class="credential-name">…</span></li>…</ul>`

## 12. CTA band
`<section class="cta-band"><div class="container cta-band-inner"><div class="cta-band-copy"><p class="eyebrow">§ NN — …</p><h2>…</h2><p>…</p></div><div class="actions">…≤2 buttons…</div></div></section>` — add `.is-center` to the section for a stacked/centered layout. Always the last block before the footer.

## 13. Accordion / FAQ (native `<details>`, no JS required)
`<div class="accordion" data-accordion-exclusive><details class="accordion-item" name="faq" open><summary>Question</summary><div class="accordion-panel"><p>Answer</p></div></details>…</div>`
Same `name` = exclusive group (JS adds fallback). Open the first item only.

## 14. Breadcrumb, tag, pagination
- `.breadcrumb` (see banner); `.breadcrumb.is-start` left-aligns for in-content use.
- `.tag` pill (mono) — `<span class="tag">` or `<a class="tag" aria-current="page">` for the active filter; wrap in `.tag-list`.
- `<nav class="pagination" aria-label="Pagination"><ul><li><a class="page-link" aria-current="page">1</a></li>…</ul></nav>`; prev/next use `.icon-prev` / `.icon-arrow`; disabled = `aria-disabled="true" tabindex="-1"`.

## 15. Article typography
`<div class="prose">` (max 68ch): `h2 h3 p ul ol blockquote(+cite) figure(+figcaption) a code hr`, first paragraph `<p class="lead">`.
`.article-meta` (tag + date + read time), `.author-box` (avatar + `.author-name` + bio). Inline figures: `<figure><div class="media ratio-12-7"><img …></div><figcaption>…</figcaption></figure>`.
Related posts on article page are text-only (`.widget-list`).

## 16. Sidebar widgets & contact
- `<aside class="aside-sticky"><div class="widget"><h2 class="widget-title">Related reading</h2><ul class="widget-list"><li><a href>Title<small>date</small></a></li></ul></div></aside>`
- `.contact-list`: `<li><span class="contact-label">Office</span><span class="contact-value">…</span></li>`; wrap phone/email in `<bdi>` so they stay LTR in RTL.
- `.map-embed` (16:10; 4:3 mobile) wrapping an `<iframe title="…" loading="lazy">`.

## 17. Forms (assets/js/validation.js auto-binds `form[data-validate]`)
Exact markup for ONE field (copy per field; ids must be unique; error id = `<field id>-error`):
```html
<div class="field">
  <label for="cf-email">Email <span class="req" aria-hidden="true">*</span></label>
  <input id="cf-email" name="email" type="email" autocomplete="email" required aria-required="true"
         data-rule="email" placeholder="you@company.com" aria-describedby="cf-email-error">
  <p class="field-error" id="cf-email-error" aria-live="polite"></p>
</div>
```
- `data-rule` = `name | email | phone | message | required`. Fields with the `required` attribute are mandatory; a rule field **without** `required` is optional (empty = valid). `required` rule works on `<select>` (first option `value=""`) and checkbox (must be checked). Optional `data-msg="…"` overrides the "empty/unchecked" message.
- Phone: `type="tel" inputmode="numeric"`; non-digits are stripped as typed/pasted and an error is shown. Digits only, 7–15.
- Name ≥2 unicode letters (space - ' . allowed, no digits); email `local@domain.tld`; message ≥10 chars.
- Behaviour: validate on blur, then live on input; `aria-invalid` + `.is-invalid` on `.field`; first invalid is focused on submit; `preventDefault`; on success form is reset and `.form-success` (inside the form or inside the `[data-form-wrap]` parent) is revealed and focused.
- Success panel (required in every form): `<div class="form-success" role="status" hidden><h3>…</h3><p>…</p></div>` (optional `<button type="button" data-form-reset>` to show the form again).
- Consent checkbox: `<div class="field field-check"><label class="check" for="id"><input id type="checkbox" required data-rule="required" data-msg="…" aria-describedby="id-error"><span>text</span></label><p class="field-error" id="id-error" aria-live="polite"></p></div>`.
- Pairing fields: `<div class="grid cols-2">` inside `<form class="form">`; full-width field = `.col-span-full`. Submit = `.btn.btn-primary.btn-block`. `.form-note` for the privilege line; `.field-hint` for helper text (include its id in `aria-describedby`).
- Newsletter/inline: `<form class="form-inline" data-validate novalidate>` with one `.field` (sr-only label) + `.btn` + `.form-success`.
- Never submit anywhere (no backend). Always include `novalidate` (binder also adds it).

## 18. Reveal animation
Add `reveal` to blocks/cards/stat items (not to the hero). JS adds `.is-visible` via IntersectionObserver (stagger within `.grid`), then removes the classes. No-JS and reduced-motion → always visible. Don't put `reveal` on elements that are `position:sticky`.

## 19. Utilities
`.sr-only`, `.text-center`, `.muted`, `.small`, `.nowrap`, `.mt-0…6` / `.mb-0,2,3,4` (8-px multiples), `.stack` (+`.stack-sm`/`.stack-lg`, vertical rhythm), `.divider`, `.double-rule`, `.section-foot` (centered button row under a grid), `.error-code` (404 numeral), `.is-inverse` (force dark token set on any wrapper).

## 20. Theme, direction, tokens
- `html[data-theme="light|dark"]` (key `cv-theme`), `html[dir="ltr|rtl"]` (key `cv-dir`) — set pre-paint by the head snippet, toggled by `main.js`.
- Use tokens (`var(--bg --surface --surface-2 --text --muted --border --accent --accent-text --error --success --focus --field-border`) — never raw hex in page CSS. Brass as text only via `--accent-text`.
- RTL: swaps to IBM Plex Sans Arabic (headings + body), letter-spacing 0 on mono/uppercase, arrows mirror via `--flip`. Brand wordmark stays serif. Phone/email in `<bdi>`.
- Verified contrast (AA both themes, incl. inverse surfaces); only decorative brass rules (`--accent` on light bg, 2.8:1) are below 3:1 by design.

## 21. JS hooks (data attributes)
`data-theme-toggle`, `data-rtl-toggle`, `data-nav-toggle` (+ `#site-nav`), `data-dropdown-toggle` (inside `.has-dropdown`), `data-back-to-top`, `data-year` (footer year), `data-accordion-exclusive`, `data-validate`, `data-form-wrap`, `data-form-reset`.
