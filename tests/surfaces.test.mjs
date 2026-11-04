import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup as render } from 'react-dom/server';
import { DialogSurface, DialogHeading, DialogActions, MenuSurface, PopoverSurface, TooltipSurface, ScrollArea } from '../dist/index.js';

test('surfaces preserve controller identity, semantics and custom classes without another DOM wrapper', () => {
  for (const [Component, kind] of [[DialogSurface,'dialog'],[MenuSurface,'menu'],[PopoverSurface,'popover'],[TooltipSurface,'tooltip']]) {
    const html = render(h(Component, {asChild:true}, h('section', {id:'controller', role:'dialog', 'aria-labelledby':'title', 'data-state':'open', className:'positioned'}, 'Body')));
    assert.match(html, /^<section/);
    assert.match(html, /id="controller"/);
    assert.match(html, /aria-labelledby="title"/);
    assert.match(html, /data-state="open"/);
    assert.match(html, new RegExp(`data-vic-surface="${kind}"`));
    assert.match(html, /positioned/);
    assert.equal((html.match(/<section/g) ?? []).length, 1);
  }
});
test('dialog headings and actions use the native dialog layout', () => {
  assert.match(render(h(DialogHeading, null, 'Title')), /class="ui-dialog-head"/);
  assert.match(render(h(DialogActions, null, 'Save')), /class="ui-dialog-foot"/);
});
test('scroll area keeps one native viewport and its accessible label', () => {
  const html = render(h(ScrollArea, {'aria-label':'Spaces', className:'fill'}, 'School'));
  assert.match(html, /aria-label="Spaces"/);
  assert.match(html, /class="ui-scroll-area fill"/);
  assert.match(html, /data-slot="scroll-area-viewport"/);
  assert.match(html, /School/);
});
