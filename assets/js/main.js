/* Calder Voss — main.js (vanilla, deferred, no dependencies)
   Theme + RTL toggles, mobile drawer, Home dropdown, header state, reveal, accordion fallback,
   footer year, back-to-top. aria-current is set in HTML, never here.
   The no-flash <head> snippet (see docs/template.html) sets data-theme / dir / .js before paint. */
(function () {
  'use strict';

  var doc = document.documentElement;
  var KEY_THEME = 'cv-theme';
  var KEY_DIR = 'cv-dir';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function store(key, val) { try { localStorage.setItem(key, val); } catch (e) { /* private mode */ } }
  function read(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  doc.classList.add('js');

  /* ---------- Theme ---------- */
  var mqDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function applyTheme(theme) {
    doc.setAttribute('data-theme', theme);
    var dark = theme === 'dark';
    $$('[data-theme-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
      var label = dark ? 'Switch to light theme' : 'Switch to dark theme';
      btn.setAttribute('aria-label', label);   // icons swap via CSS; markup is never rewritten
      btn.setAttribute('title', label);
      btn.setAttribute('data-state-label', label);
    });
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#0A1424' : '#F6F2E9');
  }
  function currentTheme() {
    return doc.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }
  applyTheme(currentTheme());
  $$('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      store(KEY_THEME, next);
    });
  });
  if (mqDark && mqDark.addEventListener) {
    mqDark.addEventListener('change', function (e) {
      if (!read(KEY_THEME)) applyTheme(e.matches ? 'dark' : 'light');   // follow OS until the user chooses
    });
  }

  /* ---------- Direction (RTL) ---------- */
  function applyDir(dir) {
    doc.setAttribute('dir', dir);
    var rtl = dir === 'rtl';
    $$('[data-rtl-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', rtl ? 'true' : 'false');
      var label = rtl ? 'Switch to left-to-right layout' : 'Switch to right-to-left layout';
      btn.setAttribute('aria-label', label);   // RTL/LTR text swaps via CSS
      btn.setAttribute('title', label);
    });
  }
  applyDir(doc.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr');
  $$('[data-rtl-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = doc.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
      applyDir(next);
      store(KEY_DIR, next);
    });
  });

  /* ---------- Mobile drawer + dropdown ---------- */
  var header = $('.site-header');
  var nav = $('#site-nav');
  var navToggle = $('[data-nav-toggle]');
  var mqDesktop = window.matchMedia('(min-width: 1025px)');
  var mqHover = window.matchMedia('(hover: hover) and (min-width: 1025px)');

  function focusables(root) {
    return $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', root)
      .filter(function (el) { return el.getClientRects().length > 0; });
  }

  function setDrawer(open) {
    if (!nav || !navToggle) return;
    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    doc.classList.toggle('nav-open', open);
    if (!open) closeAllDropdowns();
  }
  function drawerOpen() { return nav && nav.classList.contains('is-open'); }

  if (nav && navToggle) {
    navToggle.addEventListener('click', function () { setDrawer(!drawerOpen()); });
    nav.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[href]') : null;
      if (a && !mqDesktop.matches) setDrawer(false);
    });
    mqDesktop.addEventListener && mqDesktop.addEventListener('change', function (e) { if (e.matches) setDrawer(false); });
    // focus trap-lite: while the drawer is open Tab cycles through the header (brand, links, controls)
    document.addEventListener('keydown', function (e) {
      if (!drawerOpen()) return;
      if (e.key === 'Escape') { setDrawer(false); navToggle.focus(); return; }
      if (e.key !== 'Tab') return;
      var items = focusables(header || nav);
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  var dropdowns = $$('.has-dropdown');
  var hoverTimer = null;
  function setDropdown(item, open) {
    var trigger = $('[data-dropdown-toggle]', item);
    item.classList.toggle('is-open', open);
    if (trigger) trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  function closeAllDropdowns(except) {
    dropdowns.forEach(function (d) { if (d !== except) setDropdown(d, false); });
  }
  dropdowns.forEach(function (item) {
    var trigger = $('[data-dropdown-toggle]', item);
    var menu = $('.dropdown', item);
    if (!trigger || !menu) return;
    var hoverOpened = false;   // a click right after a hover-open keeps the menu open instead of closing it
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      var open = hoverOpened || !item.classList.contains('is-open');
      hoverOpened = false;
      closeAllDropdowns(item);
      setDropdown(item, open);
    });
    item.addEventListener('mouseenter', function () {
      if (!mqHover.matches) return;
      clearTimeout(hoverTimer);
      closeAllDropdowns(item);
      if (!item.classList.contains('is-open')) hoverOpened = true;
      setDropdown(item, true);
    });
    item.addEventListener('mouseleave', function () {
      if (!mqHover.matches) return;
      hoverTimer = setTimeout(function () { hoverOpened = false; setDropdown(item, false); }, 140);
    });
    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault(); setDropdown(item, true);
        var first = $('.dropdown-link', menu);
        if (first) first.focus();
      }
    });
    menu.addEventListener('keydown', function (e) {
      var links = $$('.dropdown-link', menu);
      var i = links.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); links[(i + 1) % links.length].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); links[(i - 1 + links.length) % links.length].focus(); }
      else if (e.key === 'Home') { e.preventDefault(); links[0].focus(); }
      else if (e.key === 'End') { e.preventDefault(); links[links.length - 1].focus(); }
    });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && item.classList.contains('is-open')) {
        e.stopPropagation(); setDropdown(item, false); trigger.focus();
      }
    });
    item.addEventListener('focusout', function (e) {
      if (!e.relatedTarget || !item.contains(e.relatedTarget)) setDropdown(item, false);
    });
  });
  document.addEventListener('click', function (e) {
    dropdowns.forEach(function (d) { if (!d.contains(e.target)) setDropdown(d, false); });
  });

  /* ---------- Header scrolled state (passive + rAF) ---------- */
  var ticking = false;
  var backTop = $('[data-back-to-top]');
  function onScroll() {
    ticking = false;
    var y = window.pageYOffset || doc.scrollTop || 0;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (backTop) backTop.classList.toggle('is-visible', y > 700);
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();
  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      var skip = $('.skip-link'); if (skip) skip.focus({ preventScroll: true });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function done(el) {
    el.classList.add('is-visible');
    var cleanup = function () {            // hand control back to component transitions (cards etc.)
      el.classList.remove('reveal', 'is-visible');
      el.style.removeProperty('--reveal-delay');
    };
    var t = setTimeout(cleanup, 900);
    el.addEventListener('transitionend', function h(ev) {
      if (ev.target !== el || ev.propertyName !== 'opacity') return;
      clearTimeout(t); el.removeEventListener('transitionend', h); cleanup();
    });
  }
  var revealEls = $$('.reveal');
  if (revealEls.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      revealEls.forEach(function (el) {            // light stagger inside grids (max 4 steps)
        var p = el.parentElement;
        if (p && p.classList.contains('grid')) {
          var idx = Array.prototype.indexOf.call(p.children, el) % 4;
          if (idx) el.style.setProperty('--reveal-delay', (idx * 70) + 'ms');
        }
      });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { io.unobserve(en.target); done(en.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- Accordion: exclusive groups for browsers without <details name> ---------- */
  $$('[data-accordion-exclusive] details').forEach(function (d, _i, all) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      all.forEach(function (o) { if (o !== d && o.open) o.open = false; });
    });
  });

  /* ---------- Footer year ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
})();
