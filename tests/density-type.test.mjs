import assert from "node:assert/strict";
import test from "node:test";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { chromium } from "playwright";
import { createServer } from "vite";
import { DensityTypeFixture } from "./density-type.fixture.mjs";

// What each density step draws, in pixels: a field, a small field, a button (the dense height)
// and a large one, a tab switcher, a list's row, a menu's item, a table's body row, an inline
// combobox's row, a place picker's row, a roster's body row, and a small field's padding.
const expected = {
  default: { field: 36, small: 32, button: 32, large: 36, tabs: 36, row: 44, item: 34, cell: 33, option: 32, place: 34, roster: 40, smPad: 10 },
  compact: { field: 32, small: 28, button: 28, large: 32, tabs: 32, row: 36, item: 28, cell: 27, option: 26, place: 28, roster: 34, smPad: 8 },
  comfortable: { field: 40, small: 36, button: 36, large: 40, tabs: 40, row: 52, item: 40, cell: 41, option: 38, place: 40, roster: 48, smPad: 12 },
};

test("density and type tokens", { timeout: 60000 }, async (t) => {
  const html = renderToString(h(DensityTypeFixture));
  const server = await createServer({ configFile: false, cacheDir: "node_modules/.vite-density-type-test", optimizeDeps: { noDiscovery: true, include: [] }, server: { host: "127.0.0.1", port: 0 }, plugins: [{
    name: "density-type-fixture",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (new URL(request.url, "http://localhost").pathname !== "/") return next();
        response.setHeader("Content-Type", "text/html");
        response.end(`<html data-mode="light"><head><link rel="stylesheet" href="/dist/vic-ui.css"></head><body>${html}</body></html>`);
      });
    },
  }] });
  let browser;
  try {
    await server.listen();
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, reducedMotion: "reduce" });
    page.setDefaultTimeout(10000);
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(server.resolvedUrls.local[0]);
    await page.evaluate(() => document.fonts.ready);

    const measure = (name) => page.getByTestId(name).evaluate((root) => {
      const height = (selector) => Math.round(root.querySelector(selector).getBoundingClientRect().height);
      return {
        field: height(".ui-field:not(.ui-field-sm) .ui-field-box"),
        small: height(".ui-field-sm .ui-field-box"),
        button: height(".ui-button:not(.ui-button-lg)"),
        large: height(".ui-button-lg"),
        tabs: height(".ui-tabs"),
        row: height(".ui-list-row"),
        item: height(".ui-menu-item"),
        cell: height(".ui-table tbody tr"),
        option: height(".ui-combobox-item"),
        place: height(".ui-place-row"),
        roster: height("[data-look='roster'] tbody tr"),
        smPad: parseFloat(getComputedStyle(root.querySelector(".ui-field-sm .ui-field-input")).paddingLeft),
      };
    });

    await t.test("each step sets every height together, and size=sm stays a step under it", async () => {
      for (const [name, step] of [["default", "default"], ["compact", "compact"], ["comfortable", "comfortable"]]) {
        assert.deepEqual(await measure(name), expected[step], `${name} section`);
      }
    });

    await t.test("a section set to the other mode keeps its density, and a nested default resets it", async () => {
      assert.deepEqual(await measure("compact-dark"), expected.compact);
      assert.deepEqual(await measure("reset"), expected.default);
    });

    await t.test("a compact rail is the rail SidebarProvider size=sm draws", async () => {
      const rail = (id) => page.getByTestId(id).evaluate((root) => {
        const row = root.querySelectorAll(".ui-sidebar-button");
        const words = root.querySelector(".ui-sidebar-group-words");
        return { row: row[0].getBoundingClientRect().height, kept: row[1].getBoundingClientRect().height, label: words.getBoundingClientRect().height, size: getComputedStyle(words).fontSize };
      });
      const compact = await rail("compact-rail");
      assert.deepEqual(compact, await rail("sm-rail"));
      assert.deepEqual(compact, { row: 28, kept: 32, label: compact.label, size: "11px" });
      const plain = await rail("default-rail");
      assert.equal(plain.row, 32);
      assert.equal(plain.size, "12px");
      assert.ok(plain.label > compact.label, "the dense heading has less room above and below");
    });

    await t.test("headlines read the title size, its line height and its tracking", async () => {
      const title = await page.getByTestId("title").evaluate((el) => { const s = getComputedStyle(el); return [s.fontSize, s.lineHeight, s.letterSpacing]; });
      assert.deepEqual(title, ["20px", "24px", "-0.4px"]);
      const tracking = () => page.getByTestId("default-button").evaluate((el) => getComputedStyle(el.querySelector(".ui-button-face") ?? el).letterSpacing);
      assert.match(await tracking(), /^(normal|0px)$/);
      await page.addStyleTag({ content: ":root { --track-ui: 0.02em; --track-title: -0.01em; }" });
      assert.equal(await tracking(), "0.26px", "a button's words follow --track-ui");
      assert.equal(await page.getByTestId("title").evaluate((el) => getComputedStyle(el).letterSpacing), "-0.2px");
    });

    await t.test("the fallback face takes the room Cal Sans UI takes", async () => {
      const stack = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
      assert.match(stack, /^"Cal Sans UI", "Cal Sans UI Fallback", /);
      // A paragraph of interface copy wrapped at a set width with `line-height: normal`, so the
      // ascent and descent count, then the same words on one line at 100px for the width alone
      // (large, since this Chromium rounds each advance to a pixel at small sizes).
      const box = (family) => page.getByTestId("sample").evaluate(async (el, family) => {
        el.style.fontFamily = family;
        await document.fonts.load(`500 16px ${family}`);
        const range = document.createRange();
        range.selectNodeContents(el);
        const lines = new Set([...range.getClientRects()].map((r) => Math.round(r.top))).size;
        const height = el.getBoundingClientRect().height;
        el.style.cssText += "; white-space: nowrap; width: max-content; font-size: 100px";
        const line = el.getBoundingClientRect();
        el.style.cssText += "; white-space: normal; width: 360px; font-size: 16px";
        return { height, lines, width: line.width, line: line.height };
      }, family);
      const face = await box('"Cal Sans UI"');
      const fallback = await box('"Cal Sans UI Fallback"');
      const plain = await box('Arial, "Liberation Sans"');
      const near = (a, b, by) => Math.abs(a / b - 1) < by;
      assert.equal(fallback.lines, face.lines, "the same words break into the same lines");
      assert.ok(Math.abs(fallback.height - face.height) <= 1, `the paragraph keeps its height: ${fallback.height} against ${face.height}`);
      assert.ok(near(fallback.width, face.width, 0.015), `a line keeps its width: ${fallback.width} against ${face.width}`);
      assert.ok(Math.abs(fallback.line - face.line) <= 1, `a line keeps its height: ${fallback.line} against ${face.line}`);
      assert.ok(!near(plain.width, face.width, 0.05) && Math.abs(plain.line - face.line) > 1, `the unadjusted face would not: ${JSON.stringify(plain)} against ${JSON.stringify(face)}`);
      // At 600 and 700 the fallback draws its bold face, scaled to Cal Sans UI's bold; the
      // regular face thickened would run about 2% narrow at 600.
      const bold = (family, weight) => page.getByTestId("sample").evaluate(async (el, [family, weight]) => {
        await document.fonts.load(`${weight} 100px ${family}`);
        const probe = el.cloneNode(true);
        probe.style.cssText += `; font-family: ${family}; font-weight: ${weight}; white-space: nowrap; width: max-content; font-size: 100px`;
        el.after(probe);
        const width = probe.getBoundingClientRect().width;
        probe.remove();
        return width;
      }, [family, weight]);
      for (const weight of [600, 700]) {
        const faceWidth = await bold('"Cal Sans UI"', weight);
        const fallbackWidth = await bold('"Cal Sans UI Fallback"', weight);
        assert.ok(near(fallbackWidth, faceWidth, 0.015), `a ${weight} line keeps its width: ${fallbackWidth} against ${faceWidth}`);
      }
    });

    assert.deepEqual(errors, []);
    await page.close();
  } finally {
    await browser?.close();
    await server.close();
  }
});
