# Calder Voss — Design Contract ("Privileged & Confidential")

Result of a 3-way design debate (Heritage Counsel × Classified Dossier × Quiet Modern Advisory).
Winning synthesis: **warm paper + deep navy + one brass accent**, sturdy serif headlines, IBM Plex
for everything else, § folio numbering, double hairlines, and a brass **redaction bar** that wipes
off one hero word. Discretion is shown by restraint — NOT by fake "CLASSIFIED/spy" language.
Use only the legally accurate phrase **"Privileged & Confidential"**.

## Brand
- Name: **Calder Voss** — descriptor "Investigations & Due Diligence".
- Logo: `assets/logo.svg` (monogram: navy rounded-square 4px, serif "C", a brass horizontal bar cutting
  through = redaction) + wordmark text "CALDER VOSS" and tiny descriptor. Must be the SAME size on every
  page (height 40px mark, header wordmark 1 line). Logo + brand name ALWAYS link to `index.html`.
- Favicon: `assets/favicon/` (svg + png 32/180/512 + ico), linked on every page.
- Sample copy only: invent plausible but modest facts (e.g. "Founded 2009", "40+ jurisdictions",
  "Former regulators, forensic accountants, ex-prosecutors"). Never claim success rates or guarantees.
  Never say "classified". No dashboard, no login/signup pages (Dashboard: No).

## Tokens (CSS custom properties on `:root` and `[data-theme="dark"]`)
| token | light | dark |
|---|---|---|
| --bg | #F6F2E9 | #0A1424 |
| --surface | #FFFDF8 | #101E36 |
| --surface-2 | #EDE6D6 | #152844 |
| --text | #0B1B33 | #F1EBDD |
| --muted | #4B5568 | #A9B2C3 |
| --border | #D9CFB8 | #26354F |
| --accent-text (brass as text) | #7A5C1A | #D4B26A |
| --accent (brass fill/rules) | #B08D3E | #C9A55C |
| --inverse-bg (hero/footer/CTA band) | #0B1B33 | #060E1B |
| --inverse-text | #F1EBDD | #F1EBDD |
| --inverse-muted | #B9C0CE | #B9C0CE |
| --error | #B3261E | #FF8A80 |
| --success | #1E6B3A | #7FD39B |

**Primary CTA (identical in BOTH themes, every page):** fill `#C9A55C`, text `#0B1B33`, hover fill
`#D9B86F`, 1px border `#0B1B33` in light / `#C9A55C` in dark, radius **4px**, height **44px**,
font IBM Plex Sans 600 15px, arrow glyph that mirrors in RTL. Secondary: transparent, 1px
border `currentColor`, same height/radius. Max TWO CTAs in any hero.
Navbar controls (theme toggle, RTL toggle, CTA) = **same 44px height, same 4px radius, same border weight**.
Cards: 4px radius, flat, 1px `--border`, no shadow; hover → top border brass. No gradients except hero overlays.
All text/background pairs must hit WCAG AA (4.5:1 body, 3:1 large) in light AND dark. Brass-as-text only via `--accent-text`.

## Type (self-hosted woff2 in `assets/fonts/`, `font-display: swap`)
- Headings: **Source Serif 4** 600 (variable). Body/UI: **IBM Plex Sans** 400/500/600.
  Labels/eyebrows/folio: **IBM Plex Mono** 500, uppercase, tracking .12em, **min 12.5px**.
- RTL (`html[dir=rtl]`): **IBM Plex Sans Arabic** for headings + body (single family; no serif mismatch).
- Scale: body 17/1.7; H1 `clamp(2.25rem,5.2vw,4.25rem)`/1.08; H2 `clamp(1.75rem,3.4vw,2.75rem)`; H3 1.5rem; lead 1.2rem.
- Same fonts everywhere — never introduce another family.

## Layout & motifs
- Container max 1200px, side padding 20px (≤768) / 32px. Section padding 112px desktop / 72px mobile.
- ONE grid system: `.grid` with `.cols-2/.cols-3/.cols-4` (gap 32px; collapses 4→2→1 at 1024/768). Every section uses it.
- Section heading block (`.section-head`): centered or start-aligned per variant, always: mono eyebrow
  `§ 02 — Services`, H2, optional lead, double hairline (1px, 3px gap) beneath eyebrow. Same alignment rules sitewide.
- Hero (`.hero`): **center-aligned**, full-bleed photo, navy overlay ≥ .78 (stays dark in both themes, text ivory),
  mono eyebrow "PRIVILEGED & CONFIDENTIAL · REF. 0417", H1 where ONE word is wrapped in `<span class="redact">`
  (brass bar wipes away on load; `prefers-reduced-motion` → no animation, word simply visible), lead, ≤2 CTAs.
  Inner pages use compact `.page-banner` (same anatomy, shorter, image bg, breadcrumb).
- Images always in containers (`.media` with fixed aspect-ratio, `object-fit:cover`, 4px radius) — **photos, not icons**,
  for services/values/steps. SVG icons only for: theme toggle, RTL toggle, social icons, arrows, form UI, chevrons.
- Testimonials: every card has a circular profile photo (56px) — same treatment on every card on every page.
- Sticky header (blur-free solid bg for perf), mobile drawer ≤1024px, dropdown "Home ▾" → Home 1 / Home 2.
- Motion: ≤400ms, transform/opacity only, IntersectionObserver reveal, honor `prefers-reduced-motion`. Images `loading="lazy"`
  + `decoding="async"` + explicit width/height (hero image: eager + `fetchpriority="high"`).

## Navigation (identical markup on every page; only `aria-current="page"` changes)
`Home ▾ (Home 1 → index.html, Home 2 → home-2.html)` · `About → about.html` · `Services → services.html` ·
`Blog → blog.html` · `Contact → contact.html` · right side: theme toggle, RTL toggle, **CTA "Request Consultation" → contact.html**.
Footer: logo (→ index.html) + blurb, Quick Links (Home 1, Home 2, About, Services, Blog, Contact), Services list (links to services.html#anchors),
Contact info, social icons (LinkedIn, X, Facebook, Instagram, YouTube — inline SVG, `aria-label`), newsletter mini-form (validated),
bottom bar (© 2026 Calder Voss · Privacy · Terms · "Confidential inquiries only"). Footer column headings + logo share the same top line.

## Pages (all root-level .html)
`index.html` (Home 1) · `home-2.html` (Home 2 — different hero copy, different section structure & content) · `about.html` ·
`services.html` (background checks, M&A due diligence, + 4 more) · `blog.html` · `blog-post.html` (single article) ·
`contact.html` (confidential form, FAQ accordion, embedded map, details) · `404.html`.

## Forms (assets/js/validation.js; auto-binds any `<form data-validate>`)
- Name: ≥2 chars, letters only (unicode letters, space, hyphen, apostrophe, period); reject single char & digits.
- Email: must have local@domain.tld (tld ≥2 letters); reject missing @ / missing domain / spaces.
- Phone: digits ONLY, 7–15 digits; alphabets rejected (also strip non-digits as typed, still show error on paste).
- Message ≥10 chars, required selects, required consent checkbox. Inline `aria-live` errors, `aria-invalid`, focus first error,
  success panel on valid submit (no backend; `preventDefault`). Newsletter + contact + any other form all use it.

## Files
```
index.html home-2.html about.html services.html blog.html blog-post.html contact.html 404.html
assets/css/style.css          (design system + all components; pages may add assets/css/<page>.css only if truly page-specific)
assets/js/main.js             (theme, RTL, nav, dropdown, drawer, reveal, accordion, header state)
assets/js/validation.js       (UMD: window.CVValidate + node exports for tests)
assets/fonts/  assets/favicon/  assets/logo.svg  assets/img/{hero,home1,home2,about,services,blog,contact,people}/
docs/DESIGN.md docs/COMPONENTS.md docs/template.html     tests/  package.json
```
Images are **webp**. NO image may be used on more than one page (or twice on one page). Related-posts on the article page are text-only.

## Image manifest (exact filenames; folder `assets/img/`; webp; q≈72; hero ≤ 220KB, others ≤ 90KB)
Tone for ALL photos: sober, high-end, slightly desaturated, cool navy/amber light, no logos or legible brand text, no hooded
"hacker"s, no handcuffs/guns/spy cliché, no obvious stock-smile clichés. Must look relevant and different from each other.

| file | size | subject |
|---|---|---|
| hero/home1-hero.webp | 1920×1080 | glass skyscraper facade / financial district at dusk looking up |
| hero/home2-hero.webp | 1920×1080 | dim, lamp-lit private study or boardroom table with documents (no readable text) |
| hero/about-banner.webp | 1920×720 | quiet professional office corridor / library hall |
| hero/services-banner.webp | 1920×720 | desk with case files, magnifier-free, analyst work in low light |
| hero/blog-banner.webp | 1920×720 | typewriter/notes/ pen on papers or newsroom-like desk |
| hero/contact-banner.webp | 1920×720 | elegant reception/lobby or city street at blue hour |
| home1/about.webp | 900×1000 | two professionals in discreet conversation / consultation (faces not required) |
| home1/svc-1..4.webp | 800×600 | background screening (documents & ID check), M&A boardroom handshake/table, asset tracing (city/ports/finance), litigation support (law library/courthouse columns) |
| home1/blog-1..3.webp | 800×520 | corporate governance, risk, finance-themed visuals |
| home2/case-1..3.webp | 800×600 | industry contexts: private equity/finance, healthcare/lab, logistics/shipping port |
| home2/split.webp | 1000×800 | analysts at screens reviewing data (low-key) |
| about/story.webp | 1000×800 | old-world detail: brass lamp, leather folio, archive boxes |
| about/office.webp | 1000×800 | modern meeting room, glass walls |
| services/svc-1..6.webp | 800×600 | pre-employment & executive background checks; M&A due diligence; forensic accounting; asset tracing & recovery; compliance & integrity (anti-bribery) reviews; litigation & dispute support. Visuals must differ from home1/svc-* |
| blog/post-1..6.webp | 800×520 | six distinct editorial visuals (regulation, cross-border deals, fraud, vetting, ESG, cyber/data) — distinct from home1/blog-* |
| blog/article-hero.webp | 1600×800 | wide editorial banner image |
| blog/article-1.webp, article-2.webp | 1200×700 | inline article figures |
| contact/side.webp | 900×1000 | calm professional reception / handshake at door / discreet meeting |
| people/team-1..4.webp | 400×400 | professional headshots (varied, 2 women 2 men), neutral backdrop |
| people/t1-1..3.webp, people/t2-1..3.webp | 400×400 | six more distinct headshots for testimonials (clients: GC, PE partner, CFO...) |
| people/author-1.webp | 400×400 | author headshot for the blog article |
