/* Calder Voss — validation.js
   UMD: exposes window.CVValidate (browser) and module.exports (node tests).
   Pure validators return { valid: boolean, message: string }.
   DOM binder auto-initialises every <form data-validate> (see docs/COMPONENTS.md "Forms"). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory(); }
  else { root.CVValidate = factory(); }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function ok() { return { valid: true, message: '' }; }
  function bad(message) { return { valid: false, message: message }; }
  function str(v) { return v == null ? '' : String(v); }

  /* ---------- Pure validators ---------- */

  // Name: >= 2 letters; unicode letters, spaces, hyphen, apostrophe, period only. No digits.
  function validateName(value, opts) {
    var v = str(value).trim();
    var required = !opts || opts.required !== false;
    if (!v) return required ? bad('Please enter your name.') : ok();
    if (/\d/.test(v)) return bad('Names cannot contain numbers.');
    if (!/^[\p{L}\p{M}][\p{L}\p{M}\s.'’-]*$/u.test(v)) {
      return bad('Use letters, spaces, hyphens, apostrophes or periods only.');
    }
    var letters = v.match(/\p{L}/gu);
    if (!letters || letters.length < 2) return bad('Please enter at least 2 letters.');
    if (v.length > 80) return bad('Please keep your name under 80 characters.');
    return ok();
  }

  // Email: strict local@domain.tld, tld >= 2 letters, no spaces.
  var EMAIL_RE = /^[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;
  function validateEmail(value, opts) {
    var v = str(value);
    var required = !opts || opts.required !== false;
    if (!v.trim()) return required ? bad('Please enter your email address.') : ok();
    if (/\s/.test(v)) return bad('Email addresses cannot contain spaces.');
    var at = v.indexOf('@');
    if (at === -1) return bad('Email must include an @ (for example name@company.com).');
    if (at === 0) return bad('Add the part before the @ (for example name@company.com).');
    if (at !== v.lastIndexOf('@')) return bad('Email can contain only one @.');
    var domain = v.slice(at + 1);
    if (!domain) return bad('Add a domain after the @ (for example company.com).');
    if (domain.indexOf('.') === -1) return bad('The domain needs an extension, such as .com.');
    if (!EMAIL_RE.test(v)) return bad('Please enter a valid email address.');
    return ok();
  }

  // Phone: digits only, 7-15 digits. Letters and symbols are rejected.
  function validatePhone(value, opts) {
    var v = str(value).trim();
    var required = !opts || opts.required !== false;
    if (!v) return required ? bad('Please enter your phone number.') : ok();
    if (/[^\d]/.test(v)) return bad('Phone numbers can contain digits only (no letters, spaces or symbols).');
    if (v.length < 7) return bad('Phone number is too short (minimum 7 digits).');
    if (v.length > 15) return bad('Phone number is too long (maximum 15 digits).');
    return ok();
  }

  // Message: >= 10 characters (trimmed).
  function validateMessage(value, opts) {
    var v = str(value).trim();
    var required = !opts || opts.required !== false;
    if (!v) return required ? bad('Please enter a message.') : ok();
    if (v.length < 10) return bad('Please write at least 10 characters.');
    if (v.length > 5000) return bad('Please keep your message under 5,000 characters.');
    return ok();
  }

  // Required: non-empty string, selected option, or checked box (pass boolean).
  function validateRequired(value, message) {
    var filled = typeof value === 'boolean' ? value : str(value).trim() !== '';
    return filled ? ok() : bad(message || 'This field is required.');
  }

  var VALIDATORS = {
    name: validateName,
    email: validateEmail,
    phone: validatePhone,
    message: validateMessage
  };

  /* ---------- DOM binder ---------- */

  function isCheck(el) { return el.type === 'checkbox' || el.type === 'radio'; }

  function runRule(el) {
    var rule = (el.getAttribute('data-rule') || '').toLowerCase();
    var required = el.required || el.hasAttribute('data-required') || el.getAttribute('aria-required') === 'true' || rule === 'required';
    var custom = el.getAttribute('data-msg');
    var res;
    if (isCheck(el)) {
      res = validateRequired(el.checked, custom || 'Please tick this box to continue.');
    } else if (rule === 'required') {
      res = validateRequired(el.value, custom || (el.tagName === 'SELECT' ? 'Please choose an option.' : 'This field is required.'));
    } else if (VALIDATORS[rule]) {
      res = VALIDATORS[rule](el.value, { required: !!required });
      if (!res.valid && custom && !el.value.trim()) res = bad(custom);
    } else {
      res = ok();
    }
    return res;
  }

  function fieldWrap(el) { return el.closest('.field') || el.parentElement; }

  function errorBox(el) {
    var wrap = fieldWrap(el);
    var box = wrap && wrap.querySelector('.field-error');
    if (!box) {
      box = document.createElement('p');
      box.className = 'field-error';
      box.setAttribute('aria-live', 'polite');
      wrap.appendChild(box);
    }
    if (!box.id) box.id = (el.id || el.name || 'field') + '-error';
    if (!box.hasAttribute('aria-live')) box.setAttribute('aria-live', 'polite');
    var ids = (el.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
    if (ids.indexOf(box.id) === -1) { ids.push(box.id); el.setAttribute('aria-describedby', ids.join(' ')); }
    return box;
  }

  function showError(el, message) {
    var box = errorBox(el);
    box.textContent = message;
    el.setAttribute('aria-invalid', 'true');
    fieldWrap(el).classList.add('is-invalid');
  }
  function clearError(el) {
    var box = errorBox(el);
    box.textContent = '';
    el.removeAttribute('aria-invalid');
    fieldWrap(el).classList.remove('is-invalid');
  }

  function validateField(el) {
    var res = runRule(el);
    if (res.valid) clearError(el); else showError(el, res.message);
    return res.valid;
  }

  function bindForm(form) {
    if (form.__cvBound) return;
    form.__cvBound = true;
    form.setAttribute('novalidate', '');
    var fields = Array.prototype.slice.call(form.querySelectorAll('[data-rule]'));
    var touched = new WeakSet();

    fields.forEach(function (el) {
      errorBox(el);                                    // wires id + aria-describedby up front
      var rule = (el.getAttribute('data-rule') || '').toLowerCase();

      el.addEventListener('blur', function () { touched.add(el); validateField(el); });

      if (rule === 'phone') {
        el.setAttribute('inputmode', 'numeric');
        if (!el.hasAttribute('autocomplete')) el.setAttribute('autocomplete', 'tel-national');
        el.addEventListener('input', function () {
          var raw = el.value;
          var cleaned = raw.replace(/\D+/g, '');
          if (cleaned !== raw) {                       // typed letters/symbols or pasted text: strip, still tell the user
            el.value = cleaned;
            touched.add(el);
            showError(el, 'Digits only, please: letters, spaces and symbols were removed.');
            return;
          }
          if (touched.has(el) || el.getAttribute('aria-invalid') === 'true') validateField(el);
        });
      } else if (isCheck(el) || el.tagName === 'SELECT') {
        el.addEventListener('change', function () { touched.add(el); validateField(el); });
      } else {
        el.addEventListener('input', function () {
          if (touched.has(el) || el.getAttribute('aria-invalid') === 'true') validateField(el);
        });
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      fields.forEach(function (el) {
        touched.add(el);
        if (!validateField(el) && !firstBad) firstBad = el;
      });
      if (firstBad) { firstBad.focus(); return; }
      showSuccess(form, fields);
    });

    form.addEventListener('reset', function () {
      fields.forEach(clearError);
    });

    // "Send another" buttons inside the success panel
    var panel = findSuccess(form);
    if (panel) {
      Array.prototype.forEach.call(panel.querySelectorAll('[data-form-reset]'), function (btn) {
        btn.addEventListener('click', function () {
          panel.hidden = true;
          form.hidden = false;
          form.removeAttribute('data-state');
          var first = fields[0]; if (first) first.focus();
        });
      });
    }
  }

  function findSuccess(form) {
    var panel = form.querySelector('.form-success');
    if (panel) return panel;
    var scope = form.closest('[data-form-wrap]') || form.parentElement;
    return scope ? scope.querySelector('.form-success') : null;
  }

  function showSuccess(form, fields) {
    form.reset();
    fields.forEach(clearError);
    var panel = findSuccess(form);
    if (!panel) return;
    panel.setAttribute('role', 'status');
    panel.setAttribute('tabindex', '-1');
    if (form.contains(panel)) {
      form.setAttribute('data-state', 'success');     // CSS hides every sibling of the panel
    } else {
      form.hidden = true;
    }
    panel.hidden = false;
    panel.focus();
  }

  function init(ctx) {
    Array.prototype.forEach.call((ctx || document).querySelectorAll('form[data-validate]'), bindForm);
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); });
    else init();
  }

  return {
    validateName: validateName,
    validateEmail: validateEmail,
    validatePhone: validatePhone,
    validateMessage: validateMessage,
    validateRequired: validateRequired,
    init: init,
    bindForm: bindForm,
    validateField: validateField
  };
}));
