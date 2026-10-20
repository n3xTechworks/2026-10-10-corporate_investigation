'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const V = require(path.join(__dirname, '..', 'assets', 'js', 'validation.js'));

function valid(res, label) {
  assert.equal(res.valid, true, (label || '') + ' expected valid, got: ' + res.message);
  assert.equal(res.message, '', (label || '') + ' valid result must have an empty message');
}
function invalid(res, label) {
  assert.equal(res.valid, false, (label || '') + ' expected invalid');
  assert.equal(typeof res.message, 'string');
  assert.ok(res.message.length > 0, (label || '') + ' invalid result must carry a message');
}

test('module exports the public API', () => {
  for (const k of ['validateName', 'validateEmail', 'validatePhone', 'validateMessage', 'validateRequired', 'init', 'bindForm', 'validateField']) {
    assert.equal(typeof V[k], 'function', k);
  }
});

/* ------------------------------------------------------------------ name */
test('validateName: accepts real-world names', () => {
  for (const n of [
    'Mary-Jane O\'Neil', 'John Smith', 'Al', 'Anne-Marie', 'O\'Neil', 'O’Neil', 'St. John',
    'José Álvarez', 'Zoë', 'Müller', 'Łukasz Nowak', 'Søren Kierkegaard', 'Nguyễn Văn An',
    'J R', '李雷', 'Zoë', 'محمد علي', 'Jean-Luc Picard Jr.'
  ]) valid(V.validateName(n), n);
});

test('validateName: trims surrounding whitespace before checking', () => {
  valid(V.validateName('   Ana   '));
  valid(V.validateName('\tJosé Álvarez\n'));
  invalid(V.validateName('   A   '), 'one letter padded');
});

test('validateName: rejects empty / whitespace-only when required (default)', () => {
  invalid(V.validateName(''));
  invalid(V.validateName('    '));
  invalid(V.validateName(null));
  invalid(V.validateName(undefined));
});

test('validateName: optional mode accepts empty but still validates content', () => {
  valid(V.validateName('', { required: false }));
  valid(V.validateName('   ', { required: false }));
  invalid(V.validateName('A', { required: false }));
  invalid(V.validateName('John3', { required: false }));
});

test('validateName: rejects a single character', () => {
  invalid(V.validateName('A'));
  invalid(V.validateName('é'));
  invalid(V.validateName('J.'), 'one letter plus period');
  invalid(V.validateName('李'));
});

test('validateName: rejects digits anywhere', () => {
  for (const n of ['12', 'John3', '3John', 'Jo3hn', 'Mary Jane 2nd', '1']) invalid(V.validateName(n), n);
});

test('validateName: rejects symbols and leading punctuation', () => {
  for (const n of ['John_Smith', 'John@Smith', '<b>Bob</b>', 'Bob!', '-Ann', '\'Ann', '.Ann', 'Ann & Bob', 'Ann/Bob', 'A1B2']) {
    invalid(V.validateName(n), n);
  }
});

test('validateName: enforces an 80 character ceiling', () => {
  valid(V.validateName('A'.repeat(80)));
  invalid(V.validateName('A'.repeat(81)));
});

test('validateName: coerces non-string input', () => {
  invalid(V.validateName(42));
  invalid(V.validateName({}));
});

/* ----------------------------------------------------------------- email */
test('validateEmail: accepts well-formed addresses', () => {
  for (const e of [
    'a@b.co', 'john@example.com', 'first.last@example.com', 'first.last+tag@sub.example.org',
    'o\'brien@example.io', 'user_name@example.co.uk', 'x@y.museum', 'UPPER@EXAMPLE.COM',
    'a-b@c-d.com', '123@456.com', 'inquiries@caldervoss.example'
  ]) valid(V.validateEmail(e), e);
});

test('validateEmail: rejects the spec negatives', () => {
  for (const e of ['a', 'a@', 'a@b', 'a@b.', '@b.com', 'a b@c.com']) invalid(V.validateEmail(e), e);
});

test('validateEmail: rejects malformed structure', () => {
  for (const e of [
    'a@@b.com', 'a@b@c.com', 'a..b@c.com', '.a@c.com', 'a.@c.com', 'a@.com', 'a@b..com',
    'a@-b.com', 'a@b-.com', 'a@b.c', 'a@b.c0m', 'a@b.123', 'a@b.com.', 'a@b_c.com',
    'a(b)@c.com', 'a,b@c.com', 'a@b,com', 'a@b c.com', 'mailto:a@b.com'
  ]) invalid(V.validateEmail(e), e);
});

test('validateEmail: messages are specific', () => {
  assert.match(V.validateEmail('abc').message, /@/);
  assert.match(V.validateEmail('a b@c.com').message, /space/i);
  assert.match(V.validateEmail('a@b').message, /extension|domain/i);
  assert.match(V.validateEmail('@b.com').message, /before/i);
  assert.match(V.validateEmail('a@@b.com').message, /one @/i);
});

test('validateEmail: required vs optional', () => {
  invalid(V.validateEmail(''));
  invalid(V.validateEmail('   '));
  invalid(V.validateEmail(null));
  valid(V.validateEmail('', { required: false }));
  invalid(V.validateEmail('nope', { required: false }));
});

/* ----------------------------------------------------------------- phone */
test('validatePhone: accepts 7 to 15 digits', () => {
  for (const p of ['2125550148', '1234567', '12125550148', '123456789012345', '0044201234567']) valid(V.validatePhone(p), p);
});

test('validatePhone: 6 digits is too short, 16 digits is too long', () => {
  invalid(V.validatePhone('123456'));
  assert.match(V.validatePhone('123456').message, /short|7/i);
  valid(V.validatePhone('1234567'));
  valid(V.validatePhone('1'.repeat(15)));
  invalid(V.validatePhone('1'.repeat(16)));
  assert.match(V.validatePhone('1'.repeat(16)).message, /long|15/i);
});

test('validatePhone: any letter is rejected', () => {
  for (const p of ['abc123', 'abcdefghij', '212555014a', 'a2125550148', '1800FLOWERS', '212x555']) invalid(V.validatePhone(p), p);
  assert.match(V.validatePhone('abcdefghij').message, /digit/i);
});

test('validatePhone: digits only, so "+", spaces, dashes, brackets are rejected', () => {
  for (const p of ['+12125550148', '+1 212 555 0148', '212 555 0148', '212-555-0148', '(212)5550148', '212.555.0148', '12125550148#']) {
    invalid(V.validatePhone(p), p);
  }
});

test('validatePhone: trims outer whitespace only', () => {
  valid(V.validatePhone('  2125550148  '));
  invalid(V.validatePhone('212 5550148'));
});

test('validatePhone: required vs optional', () => {
  invalid(V.validatePhone(''));
  invalid(V.validatePhone('   '));
  invalid(V.validatePhone(undefined));
  valid(V.validatePhone('', { required: false }));
  invalid(V.validatePhone('abc', { required: false }));
  invalid(V.validatePhone('123', { required: false }));
});

/* --------------------------------------------------------------- message */
test('validateMessage: minimum 10 characters after trimming', () => {
  invalid(V.validateMessage('too short'));         // 9
  valid(V.validateMessage('1234567890'));          // 10
  valid(V.validateMessage('Please call me about a background check.'));
  invalid(V.validateMessage('short     '), 'padding must not count');
  invalid(V.validateMessage('          x'), 'leading padding must not count');
  valid(V.validateMessage('   exactly 10   '));
});

test('validateMessage: upper bound of 5000 characters', () => {
  valid(V.validateMessage('x'.repeat(5000)));
  invalid(V.validateMessage('x'.repeat(5001)));
});

test('validateMessage: required vs optional', () => {
  invalid(V.validateMessage(''));
  invalid(V.validateMessage('   \n  '));
  valid(V.validateMessage('', { required: false }));
  invalid(V.validateMessage('short', { required: false }));
});

test('validateMessage: counts unicode and newlines as content', () => {
  valid(V.validateMessage('Привет мир, как дела?'));
  valid(V.validateMessage('line one\nline two'));
});

/* -------------------------------------------------------------- required */
test('validateRequired: strings', () => {
  valid(V.validateRequired('x'));
  valid(V.validateRequired('Background check'));
  valid(V.validateRequired(0));
  invalid(V.validateRequired(''));
  invalid(V.validateRequired('   '));
  invalid(V.validateRequired(null));
  invalid(V.validateRequired(undefined));
});

test('validateRequired: booleans model checkboxes', () => {
  valid(V.validateRequired(true));
  invalid(V.validateRequired(false));
});

test('validateRequired: default and custom messages', () => {
  assert.equal(V.validateRequired('').message, 'This field is required.');
  assert.equal(V.validateRequired(false, 'Please confirm before sending.').message, 'Please confirm before sending.');
  assert.equal(V.validateRequired('ok', 'ignored').message, '');
});
