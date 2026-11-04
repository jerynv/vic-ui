import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup as render } from 'react-dom/server';
import { NativeSelect, Disclosure, Skeleton, Radio, Input, TextareaControl } from '../dist/index.js';

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
  assert.match(html, /<summary[\s\S]*<\/svg>Details<\/summary>/);
  assert.match(html, /Evidence/);
});
test('skeleton is decorative even if a caller sets aria-hidden false', () => {
  assert.match(render(h(Skeleton, { 'aria-hidden': false, className: 'wide' })), /aria-hidden="true"/);
});

test('radio preserves native grouping, checked state and event target attributes', () => {
  const html = render(h(Radio, { name: 'answer', value: 'b', defaultChecked: true, 'aria-label': 'B' }));
  assert.match(html, /type="radio"/);
  assert.match(html, /name="answer"/);
  assert.match(html, /checked=""/);
});

test('native field leaves preserve external descriptions and validation', () => {
  for (const Component of [Input, TextareaControl]) {
    const html = render(h(Component, { id: 'answer', required: true, 'aria-describedby': 'hint error', 'aria-invalid': true, defaultValue: 'Draft' }));
    assert.match(html, /aria-describedby="hint error"/);
    assert.match(html, /aria-invalid="true"/);
    assert.match(html, /required=""/);
    assert.match(html, /Draft/);
  }
});
