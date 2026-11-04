import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup as render } from 'react-dom/server';
import { NativeSelect, Disclosure, Skeleton } from '../dist/index.js';

test('native select keeps form value, validation and its accessible name', () => {
  const html = render(h(NativeSelect, { name: 'course', required: true, defaultValue: 'math', 'aria-label': 'Course' }, h('option', { value: 'math' }, 'Math')));
  assert.match(html, /name="course"/);
  assert.match(html, /required=""/);
  assert.match(html, /aria-label="Course"/);
  assert.match(html, /value="math" selected=""/);
});
test('disclosure keeps native open state and summary', () => {
  const html = render(h(Disclosure, { open: true, summary: 'Details', id: 'detail' }, 'Evidence'));
  assert.match(html, /<details[^>]*open=""/);
  assert.match(html, /<summary[^>]*>Details<\/summary>/);
  assert.match(html, /Evidence/);
});
test('skeleton is decorative even if a caller sets aria-hidden false', () => {
  assert.match(render(h(Skeleton, { 'aria-hidden': false, className: 'wide' })), /aria-hidden="true"/);
});
