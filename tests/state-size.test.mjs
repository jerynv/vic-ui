import assert from "node:assert/strict";
import test from "node:test";
import { chromium } from "playwright";
import { createServer } from "vite";

// "State never changes size", as a test. Every interactive root piece in
// `state-size.fixture.mjs` is drawn from the built package and measured at rest, under the
// pointer, with the keyboard's focus, held down by the pointer, in its chosen, checked or open
// state where it has one, and disabled (a twin with the same words), in light and in dark.
// A piece of several parts (tabs, a radio group, pages) is hovered, focused and pressed at
// each part, not only at the chosen one. Any change of width or height fails.
//
// The tolerance is a quarter of a CSS pixel. Chromium lays boxes out in sixty-fourths of a
// pixel and a box whose size does not change measures the same to the last of them, so the
// tolerance only absorbs rounding between two layouts of fractional text; the smallest change
// a person can see, one device pixel on a 2x screen, is twice as large. A piece that fails is
// a bug in the piece: fix it, or name it in KNOWN with the reason, which runs that case as a
// todo. Never widen the tolerance to make a case pass.
const TOLERANCE = 0.25;

/** Cases that fail today and why, by `mode case`. Each is a bug to fix, not an exception. */
const KNOWN = {};

const page_ = `<!doctype html><html data-mode="light"><head><meta charset="utf-8">
<link rel="stylesheet" href="/dist/vic-ui.css">
<style>.cases { display: flex; flex-direction: column; align-items: flex-start; gap: 24px; padding: 24px; } .case { display: flex; align-items: flex-start; }</style>
</head><body><div id="root"></div><script type="module" src="/tests/state-size-client.fixture.mjs"></script></body></html>`;

// Waits for every CSS transition to end and two frames to pass, so a box is measured where it
// comes to rest rather than part way through easing there.
async function settle(page) {
  await page.evaluate(async () => {
    await Promise.all(document.getAnimations().filter((one) => one instanceof CSSTransition).map((one) => one.finished.catch(() => {})));
    await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
  });
}

async function measure(page, id) {
  return page.evaluate((id) => {
    const box = document.querySelector(`[data-case="${CSS.escape(id)}"]`);
    const size = (element) => {
      const rect = element.getBoundingClientRect();
      return { w: rect.width, h: rect.height };
    };
    const parts = box.dataset.parts ? [...box.querySelectorAll(box.dataset.parts)] : [];
    return { root: size(box.firstElementChild), parts: parts.map(size) };
  }, id);
}

// The element a person works: the piece's first control that can take focus.
const CONTROL = ':is(input:not([type="hidden"]), button, a[href], [tabindex]):not(:disabled, [tabindex="-1"])';

async function rest(page) {
  await page.mouse.move(0, 0);
  await page.evaluate(() => document.activeElement?.blur());
  await settle(page);
}

function compare(failures, label, before, after) {
  const pairs = [["root", before.root, after.root], ...before.parts.map((part, at) => [`part ${at}`, part, after.parts[at]])];
  for (const [name, a, b] of pairs) {
    if (!b) { failures.push(`${label}: ${name} is gone`); continue; }
    if (Math.abs(a.w - b.w) > TOLERANCE) failures.push(`${label}: ${name} width ${a.w} became ${b.w}`);
    if (Math.abs(a.h - b.h) > TOLERANCE) failures.push(`${label}: ${name} height ${a.h} became ${b.h}`);
  }
}

// Hover, the keyboard's focus and a press on one thing a person works, `target` (where the
// pointer goes) and `control` (what takes focus: the target, or the control inside it), each
// measured against the piece at rest. The state is looked for on either, since a press on a
// label is the label's and the focus is its input's.
async function states(page, id, label, target, control, before, failures) {
  const reached = async (selector) => (await target.evaluate((element, selector) => element.matches(selector), selector)) || control.evaluate((element, selector) => element.matches(selector), selector);
  // A tall piece (a table's rows) can reach past the viewport, where the pointer cannot go.
  await target.scrollIntoViewIfNeeded();
  const where = await target.boundingBox();
  const centre = { x: where.x + where.width / 2, y: where.y + where.height / 2 };
  await page.mouse.move(centre.x, centre.y);
  await settle(page);
  assert.ok(await reached(":hover"), `${id} ${label}is hovered`);
  compare(failures, `${label}hover`, before, await measure(page, id));

  await rest(page);
  await page.keyboard.press("Shift");
  await control.evaluate((element) => element.focus());
  await settle(page);
  assert.ok(await reached(":focus-visible"), `${id} ${label}has the keyboard's focus`);
  compare(failures, `${label}focus-visible`, before, await measure(page, id));

  await rest(page);
  await page.mouse.move(centre.x, centre.y);
  await page.mouse.down();
  await settle(page);
  assert.ok(await reached(":active"), `${id} ${label}is pressed`);
  compare(failures, `${label}press`, before, await measure(page, id));
  // Let go away from the piece, so the press does not become a click.
  await page.mouse.move(0, 0);
  await page.mouse.up();
  await page.keyboard.press("Escape");
  await rest(page);
}

// A part a person works on its own, as a tab, a radio's label or a page's button is, with any
// tab order: the roving tab index leaves every tab but the chosen one at -1, and each still
// takes focus. A disabled part takes no focus and no press, so it is left out.
const PART = ':is(input:not([type="hidden"]), button, a[href], [tabindex]):not(:disabled)';

async function walk(page, id) {
  const failures = [];
  const box = page.locator(`[data-case="${id}"]`);
  const control = box.locator(CONTROL).first();
  await box.scrollIntoViewIfNeeded();
  await rest(page);
  const before = await measure(page, id);

  // A piece of several parts is worked part by part, as `rows` works a menu's rows, so a part
  // that is not the chosen one is hovered, focused and pressed as well; any other piece is
  // worked at its first control.
  const selector = await box.getAttribute("data-parts");
  const parts = selector ? box.locator(selector) : null;
  const count = parts ? await parts.count() : 0;
  let worked = 0;
  for (let at = 0; at < count; at++) {
    const part = parts.nth(at);
    const own = await part.evaluate((element, PART) => element.matches(PART), PART);
    const inner = part.locator(PART).first();
    if (!own && await inner.count() === 0) continue;
    await states(page, id, `part ${at} `, part, own ? part : inner, before, failures);
    worked++;
  }
  if (parts) assert.ok(worked >= 2, `${id} has parts to work (${worked})`);
  else await states(page, id, "", control, control, before, failures);

  const chosen = await box.getAttribute("data-chosen");
  if (chosen === "click") {
    await control.evaluate((element) => element.click());
    await settle(page);
    compare(failures, "chosen", before, await measure(page, id));
    await control.evaluate((element) => element.click());
  } else if (chosen === "second") {
    const parts = box.locator(await box.getAttribute("data-parts"));
    const pick = Number(await box.getAttribute("data-pick") ?? 1), back = Number(await box.getAttribute("data-back") ?? 0);
    await parts.nth(pick).evaluate((element) => element.click());
    await settle(page);
    compare(failures, "chosen", before, await measure(page, id));
    await parts.nth(back).evaluate((element) => element.click());
  } else if (chosen === "open") {
    await control.click();
    await settle(page);
    assert.equal(await box.locator('[aria-expanded="true"]').count(), 1, `${id} opens`);
    compare(failures, "open", before, await measure(page, id));
    if (id === "menu") failures.push(...await rows(page, box));
    await page.keyboard.press("Escape");
  }
  await rest(page);
  compare(failures, "after", before, await measure(page, id));

  for (const twin of ["disabled", "held"]) {
    if (await page.locator(`[data-case="${id}:${twin}"]`).count() === 0) continue;
    const other = await measure(page, `${id}:${twin}`);
    compare(failures, twin, { root: before.root, parts: [] }, { root: other.root, parts: [] });
  }
  return { failures, before };
}

// A menu's rows, measured while it is open: at rest, each under the pointer, each made active
// by the arrows, and the first held down. A disabled row keeps the height of the others.
async function rows(page, box) {
  const failures = [];
  const menu = page.locator(`[id="${await box.locator('[aria-expanded="true"]').getAttribute("aria-controls")}"]`);
  const row = menu.locator('[role="menuitem"]');
  const all = () => row.evaluateAll((list) => list.map((element) => { const rect = element.getBoundingClientRect(); return { w: rect.width, h: rect.height }; }));
  const before = { root: await menu.evaluate((element) => { const rect = element.getBoundingClientRect(); return { w: rect.width, h: rect.height }; }), parts: await all() };
  const now = async () => ({ root: await menu.evaluate((element) => { const rect = element.getBoundingClientRect(); return { w: rect.width, h: rect.height }; }), parts: await all() });
  assert.ok(before.parts.length >= 4, "the menu has its rows");
  const count = before.parts.length;
  for (let at = 0; at < count; at++) {
    const target = await row.nth(at).boundingBox();
    await page.mouse.move(target.x + target.width / 2, target.y + target.height / 2);
    await settle(page);
    compare(failures, `menu row ${at} hover`, before, await now());
  }
  for (let at = 0; at < count; at++) {
    await page.keyboard.press("ArrowDown");
    await settle(page);
    compare(failures, `menu arrows ${at}`, before, await now());
  }
  const first = await row.nth(0).boundingBox();
  await page.mouse.move(first.x + first.width / 2, first.y + first.height / 2);
  await page.mouse.down();
  await settle(page);
  compare(failures, "menu row press", before, await now());
  await page.mouse.move(first.x + first.width / 2, first.y + first.height * 3.5);
  await page.mouse.up();
  const disabled = await row.evaluateAll((list) => list.findIndex((element) => element.getAttribute("aria-disabled") === "true"));
  assert.ok(disabled > 0, "the menu has a disabled row");
  if (Math.abs(before.parts[disabled].h - before.parts[0].h) > TOLERANCE) failures.push(`menu disabled row height ${before.parts[0].h} became ${before.parts[disabled].h}`);
  return failures;
}

test("no state changes the size of an interactive piece, in light or dark", { timeout: 480000 }, async (t) => {
  const server = await createServer({
    configFile: false,
    logLevel: "error",
    cacheDir: "node_modules/.vite-state-size-test",
    optimizeDeps: { entries: ["tests/state-size-client.fixture.mjs"] },
    server: { host: "127.0.0.1", port: 0 },
    plugins: [{ name: "state-size-fixture", configureServer: (server) => {
      server.middlewares.use((request, response, next) => {
        if (request.url !== "/") return next();
        response.setHeader("Content-Type", "text/html");
        response.end(page_);
      });
    } }],
  });
  let browser;
  try {
    await server.listen();
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1000, height: 800 } });
    page.setDefaultTimeout(10000);
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    await page.goto(server.resolvedUrls.local[0]);
    await page.waitForSelector('[data-case="menu"]');
    await page.evaluate(() => document.fonts.ready);
    const ids = await page.locator("[data-case]").evaluateAll((list) => list.map((element) => element.dataset.case).filter((id) => !id.includes(":")));
    assert.ok(ids.length >= 35, `the fixture draws its cases (${ids.length})`);
    const light = {};
    for (const mode of ["light", "dark"]) {
      await page.evaluate((mode) => { document.documentElement.dataset.mode = mode; }, mode);
      await settle(page);
      for (const id of ids) {
        const name = `${mode} ${id}`;
        await t.test(name, KNOWN[name] ? { todo: KNOWN[name] } : {}, async () => {
          const { failures, before } = await walk(page, id);
          if (mode === "light") light[id] = before;
          else if (light[id]) compare(failures, "dark against light", light[id], before);
          assert.deepEqual(failures, []);
        });
      }
    }
    assert.deepEqual(errors, []);
  } finally {
    await browser?.close();
    await server.close();
  }
});
