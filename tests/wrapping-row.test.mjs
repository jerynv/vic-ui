import assert from "node:assert/strict";
import test from "node:test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { chromium } from "playwright";
import { startFixture } from "./wrapping-row.server.mjs";
const screenshots = process.env.WRAPPING_ROW_SCREENSHOTS;
const settle = page => page.evaluate(async () => { await document.fonts.ready; await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); await Promise.all(document.getAnimations().map(a => a.finished.catch(() => {}))); });
const focused = async locator => assert.ok(await locator.evaluate(el => el === document.activeElement));

async function geometry(page) {
  return page.evaluate(() => {
    const props = ['display', 'gap', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'borderRadius', 'borderTopWidth', 'borderTopColor', 'fontSize', 'fontWeight', 'lineHeight', 'color', 'backgroundColor', 'boxShadow', 'flexWrap', 'alignItems', 'flexBasis', 'transitionDuration', 'outlineWidth', 'outlineOffset'];
    return [...document.querySelectorAll('[data-showcase] .hit-row, [data-showcase] .hit-row *, [data-showcase] ul, [data-patterns] ul, [data-patterns] .hit-row, [data-patterns] .hit-row *')].map(el => {
      const style = getComputedStyle(el), rect = el.getBoundingClientRect(), after = getComputedStyle(el, '::after');
      return { tag: el.tagName, id: el.id, className: el.className.replace('ui-wrapping-row ', ''), rect: { width: rect.width, height: rect.height, x: rect.x, y: rect.y }, style: Object.fromEntries(props.map(p => [p, style[p]])), after: { content: after.content, width: after.width, height: after.height, maskImage: after.maskImage, color: after.backgroundColor } };
    });
  });
}

test("WrappingRow retains the exact supplied polymorphic implementation and SVG", async () => {
  const provenance = JSON.parse(await readFile(new URL('./wrapping-row.provenance.json', import.meta.url), 'utf8'));
  for (const file of provenance.exactCopies) {
    const bytes = await readFile(new URL(`../${file.target}`, import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), file.sha256);
  }
  assert.equal(provenance.consumerSites.length, 17);
  assert.equal(new Set(provenance.consumerSites.map(s => s.sourcePath)).size, 9);
});

test("WrappingRow keeps native props, refs, keyboard behavior and independent actions", { timeout: 30000 }, async () => {
  const server = await startFixture(), browser = await chromium.launch();
  try {
    const page = await browser.newPage(); page.setDefaultTimeout(5000);
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto(server.resolvedUrls.local[0], { waitUntil: 'networkidle' });
    const plain = page.locator('#plain');
    assert.equal(await plain.getAttribute('title'), 'Forwarded title');
    assert.equal(await plain.getAttribute('data-native'), 'kept');
    assert.equal(await plain.getAttribute('role'), null);
    assert.equal(await plain.getAttribute('tabindex'), null);
    assert.equal(await plain.locator(':scope > span').count(), 1, 'no extra words wrapper');
    const refs = await page.evaluate(() => Object.fromEntries(Object.entries(window.rowProof.refs).map(([key, el]) => [key, el?.tagName])));
    assert.deepEqual(refs, { div: 'DIV', a: 'A', button: 'BUTTON', li: 'LI', link: 'A', removed: 'BUTTON' });
    assert.equal(await page.locator('#button').getAttribute('name'), 'record');
    assert.equal(await page.locator('#button').getAttribute('value'), 'synthetic');
    assert.equal(await page.locator('#native-submit').getAttribute('type'), null, 'native type stays caller-owned');
    await page.locator('#native-submit').click();
    await page.locator('#anchor').focus(); await focused(page.locator('#anchor'));
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab'); await focused(page.locator('#button'));
    assert.equal(await page.locator('#button').evaluate(el => getComputedStyle(el).outlineWidth), '2px');
    await page.keyboard.press('Enter'); await page.keyboard.press('Space');
    await page.keyboard.press('Tab'); await focused(page.locator('#download'));
    await page.keyboard.press('Enter'); await page.keyboard.press('Tab'); await focused(page.locator('#cancel')); await page.keyboard.press('Enter');
    const before = await page.locator('output').textContent();
    await page.locator('#passive .fixture-words').click();
    assert.equal(await page.locator('output').textContent(), before);
    assert.equal(await page.locator('#passive').getAttribute('role'), null);
    await page.locator('#cancel').focus(); await page.keyboard.press('Tab'); await focused(page.locator('#host-link'));
    assert.equal(await page.locator('#disabled').isDisabled(), true);
    await page.locator('#disabled').click({ force: true });
    await page.locator('#host-link').focus(); await page.keyboard.press('Enter');
    assert.deepEqual(await page.evaluate(() => window.rowProof.navigation), { to: '#host-link', replace: true, state: { from: 'fixture' } });
    assert.equal(await page.locator('#host-link').getAttribute('href'), '#host-link');
    assert.equal(await page.locator('#busy').getAttribute('aria-busy'), 'true');
    assert.equal(await page.locator('#busy').getAttribute('tabindex'), null);
    assert.equal(await page.locator('#empty').textContent(), '');
    await page.locator('#remove').click();
    assert.equal(await page.evaluate(() => window.rowProof.refs.removed), null);
    const events = await page.evaluate(() => window.rowProof.events);
    assert.deepEqual(events.filter(e => e !== 'focus'), ['submit', 'anchor', 'button', 'button', 'download', 'cancel', 'link']);
    assert.deepEqual(errors, []);
  } finally { await browser.close(); await server.close(); }
});

test("WrappingRow matches the supplied cascade and portable console shapes", { timeout: 120000 }, async t => {
  const server = await startFixture(), browser = await chromium.launch();
  const comparison = [];
  try {
    if (screenshots) await mkdir(screenshots, { recursive: true });
    for (const sheet of ['native', 'ui']) for (const theme of ['light', 'dark']) await t.test(`${sheet}/${theme}`, async () => {
      const page = await browser.newPage({ viewport: { width: 1200, height: 1000 }, reducedMotion: 'reduce' });
      const reference = await browser.newPage({ viewport: { width: 1200, height: 1000 }, reducedMotion: 'reduce' });
      const errors = []; page.on('pageerror', e => errors.push(e.message));
      const url = `${server.resolvedUrls.local[0]}?sheet=${sheet}&theme=${theme}`;
      await Promise.all([page.goto(url, { waitUntil: 'networkidle' }), reference.goto(`${url}&reference`, { waitUntil: 'networkidle' })]);
      // A rebuilt public stylesheet may contain the port now. Remove just those rules
      // from the reference page's base sheet so its source comparison stays independent.
      const removedBaseRules = await reference.evaluate(() => {
        let removed = 0;
        const strip = sheet => {
          for (let index = sheet.cssRules.length - 1; index >= 0; index--) {
            const rule = sheet.cssRules[index];
            if (rule.selectorText && /\.(?:ui-wrapping-row|hit-row)(?![\w-])/.test(rule.selectorText)) { sheet.deleteRule(index); removed++; }
            else if (rule.cssRules) strip(rule);
          }
        };
        for (const sheet of document.styleSheets) if (sheet.href?.includes('/dist/')) strip(sheet);
        return removed;
      });
      await settle(page); await settle(reference);
      assert.equal(await page.locator('[data-pattern]').count(), 17);
      const invariant = await page.evaluate(() => {
        const css = id => getComputedStyle(document.getElementById(id));
        return { padded: [css('padded').paddingTop, css('padded').paddingBottom, css('padded').paddingLeft], unlayered: css('unlayered').paddingLeft, defaultWrap: css('plain').flexWrap, gap: css('plain').gap, font: css('plain').fontSize, radius: css('plain').borderRadius, panelRadius: css('panel-mixed').borderRadius, panelPadding: css('anchor').paddingLeft, innerRadius: css('anchor').borderRadius, nextBorder: getComputedStyle(document.querySelector('#panel-mixed > li + li')).borderTopWidth, plainPanel: css('plain-list').boxShadow, reduced: css('plain').transitionDuration, icon: getComputedStyle(document.getElementById('anchor'), '::after').maskImage };
      });
      assert.deepEqual(invariant.padded, ['10px', '10px', '28px']);
      assert.equal(invariant.unlayered, '32px'); assert.equal(invariant.defaultWrap, 'nowrap');
      assert.equal(invariant.gap, '14px'); assert.equal(invariant.font, '13px'); assert.equal(invariant.radius, '8px');
      assert.equal(invariant.panelRadius, '20px'); assert.equal(invariant.panelPadding, '16px'); assert.equal(invariant.innerRadius, '0px');
      assert.equal(invariant.nextBorder, '1px'); assert.equal(invariant.plainPanel, 'none'); assert.equal(invariant.reduced, sheet === 'ui' ? '1e-05s' : '0s');
      assert.match(invariant.icon, /^url\(/);
      assert.ok(decodeURIComponent(invariant.icon).includes('M9 6L15 12L9 18'), 'Vite inlines the exact source chevron path');
      const iconResponse = await page.request.get(new URL('/src/styles/assets/wrapping-row-chevron-right.svg', url).href);
      assert.equal(iconResponse.status(), 200);
      for (const width of [1200, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 }); await reference.setViewportSize({ width, height: 1000 });
        await page.waitForFunction(padding => getComputedStyle(document.querySelector('main')).paddingLeft === padding, width <= 600 ? '16px' : '32px');
        await reference.waitForFunction(padding => getComputedStyle(document.querySelector('main')).paddingLeft === padding, width <= 600 ? '16px' : '32px');
        await page.evaluate(() => scrollTo(0, 0)); await reference.evaluate(() => scrollTo(0, 0));
        const actual = await geometry(page), expected = await geometry(reference);
        assert.deepEqual(actual, expected, `${sheet}/${theme}/${width}: source-selected CSS and original hit-row DOM`);
        comparison.push({ sheet, theme, width, elements: actual.length, removedBaseRules, equal: true });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        const wraps = await page.locator('#passive').evaluate(el => {
          const words = el.querySelector('.fixture-words').getBoundingClientRect(), action = el.querySelector('a').getBoundingClientRect(); return action.y >= words.bottom;
        });
        assert.equal(wraps, width < 640, 'host responsive words class controls wrapping');
        if (screenshots && width !== 320) await page.screenshot({ path: `${screenshots}/${sheet}-${theme}-${width === 1200 ? 'desktop' : 'mobile'}.png`, fullPage: true });
      }
      await page.setViewportSize({ width: 1200, height: 1000 }); await reference.setViewportSize({ width: 1200, height: 1000 });
      for (const id of ['plain', 'anchor', 'passive', 'legacy-alias']) {
        await page.locator(`#${id}`).hover(); await reference.locator(`#${id}`).hover();
        await settle(page); await settle(reference);
        const result = await page.locator(`#${id}`).evaluate(el => ({ bg: getComputedStyle(el).backgroundColor, subtle: getComputedStyle(el.querySelector('.fixture-subtle')).color }));
        const expected = await reference.locator(`#${id}`).evaluate(el => ({ bg: getComputedStyle(el).backgroundColor, subtle: getComputedStyle(el.querySelector('.fixture-subtle')).color }));
        assert.deepEqual(result, expected, `${id} hover and inherited filled text`);
        if (id === 'passive') assert.equal(result.bg, 'rgba(0, 0, 0, 0)');
        else assert.notEqual(result.bg, 'rgba(0, 0, 0, 0)');
      }
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      assert.equal(await page.locator('#plain').evaluate(el => getComputedStyle(el).transitionDuration), '0.2s');
      assert.deepEqual(errors, []); await page.close(); await reference.close();
    });
    if (screenshots) await writeFile(`${screenshots}/source-comparison.json`, JSON.stringify(comparison, null, 2));
  } finally { await browser.close(); await server.close(); }
});
