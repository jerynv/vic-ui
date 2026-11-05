import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { chromium } from "playwright";
import { createServer } from "vite";
import { parseDelimited } from "../src/components/preview/delimited.ts";
import { previewLimit, previewLines, readPreviewText } from "../src/components/preview/preview-input.ts";

const encoded = text => new TextEncoder().encode(text);

test("delimited parsing preserves quoted records and bounds retained data", () => {
  const parse = (text, delimiter = ",", rows = 1000, columns = 60, partial = false) => parseDelimited(text, delimiter, rows, columns, partial);
  assert.deepEqual(parse('\ufeffa,b\r\n"one,two","line\nnext"\r\n"a ""quote""",end').rows,
    [["a", "b"], ["one,two", "line\nnext"], ['a "quote"', "end"]]);
  assert.deepEqual(parse('""').rows, [[""]]);
  assert.deepEqual(parse(',').rows, [["", ""]]);
  assert.deepEqual(parse('').rows, []);
  assert.deepEqual(parse('a\tb\n"c\td"\te', "\t").rows, [["a", "b"], ["c\td", "e"]]);
  assert.deepEqual(parse('a,b\nshort\nlast,,').rows, [["a", "b"], ["short"], ["last", "", ""]]);
  assert.deepEqual(parse('a,b,c\n1,2,3\n4,5,6', ",", 2, 2), {
    rows: [["a", "b"], ["1", "2"]], columns: 2, truncatedRows: true, truncatedColumns: true,
  });
  assert.equal(parse('a\nb\n', ",", 2).truncatedRows, false, "a final newline does not invent another row");
  assert.deepEqual(parse('a,b\n1,2\ncut', ",", 1000, 60, true).rows, [["a", "b"], ["1", "2"]]);
  const many = parse(Array.from({ length: 1500 }, () => Array.from({ length: 80 }, () => "x").join(',')).join('\n'));
  assert.equal(many.rows.length, 1000);
  assert.ok(many.rows.every(row => row.length === 60));
  assert.equal(many.truncatedRows, true); assert.equal(many.truncatedColumns, true);
});

test("text input reads only its budget and preserves complete UTF-8", async () => {
  let readEnd;
  class ObservedBlob extends Blob {
    slice(start, end) { readEnd = end; return super.slice(start, end); }
  }
  assert.deepEqual(await readPreviewText(new ObservedBlob(["A€B"]), 3), { text: "A", truncated: true });
  assert.equal(readEnd, 3, "slice precedes arrayBuffer allocation");
  assert.deepEqual(await readPreviewText(encoded("A€B"), 4), { text: "A€", truncated: true });
  assert.deepEqual(await readPreviewText(encoded("A�B"), 4), { text: "A�", truncated: true });
  const padded = encoded("outsideA€Boutside").subarray(7, 12);
  assert.equal((await readPreviewText(padded, 4)).text, "A€", "respect a view's byte offset");
  assert.deepEqual(previewLines("a\r\nb\rc\n", 2), { lines: ["a", "b"], truncated: true });
  assert.deepEqual(previewLines("a\nb\n", 2), { lines: ["a", "b"], truncated: false });
  assert.deepEqual(previewLines("", 2), { lines: [""], truncated: false });
  for (const value of [Infinity, -Infinity, NaN, 500]) assert.equal(previewLimit(value, 100), 100);
  assert.equal(previewLimit(-2, 100), 1); assert.equal(previewLimit(2.8, 100), 2);
});

test("text and delimited previews escape content, retry and ignore stale reads in both stylesheet entries", { timeout: 60000 }, async () => {
  const { PreviewTextFixture } = await import("./preview-text.fixture.mjs");
  const html = renderToString(createElement(PreviewTextFixture));
  assert.ok(html.includes("Loading text"), "SSR reserves the loading state without browser APIs");
  const server = await createServer({ configFile: false, cacheDir: "node_modules/.vite-preview-text-test",
    optimizeDeps: { entries: ["tests/preview-text-hydrate.fixture.mjs"] }, server: { host: "127.0.0.1", port: 0 }, plugins: [{
      name: "preview-text-fixture", configureServer(server) { server.middlewares.use((request, response, next) => {
        if (!request.url?.startsWith("/?")) return next();
        const sheet = request.url.includes("composable") ? "ui/styles.css" : "vic-ui.css";
        response.setHeader("Content-Type", "text/html");
        response.end(`<html data-mode="light"><head><link rel="stylesheet" href="/dist/${sheet}"></head><body><div id="root">${html}</div><script type="module" src="/tests/preview-text-hydrate.fixture.mjs"></script></body></html>`);
      }); },
    }] });
  let browser;
  try {
    await server.listen(); browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ reducedMotion: "reduce", viewport: { width: 1000, height: 800 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    for (const sheet of ["native", "composable"]) for (const mode of ["light", "dark"]) {
      await page.goto(`${server.resolvedUrls.local[0]}?${sheet}`, { waitUntil: "networkidle" });
      await page.evaluate(mode => { document.documentElement.dataset.mode = mode; }, mode);
      await page.locator("#text .ui-preview-text-line").first().waitFor();
      assert.equal(await page.locator("#text .ui-preview-text-line").count(), 3);
      assert.equal(await page.locator("#text script, #csv img").count(), 0);
      assert.equal(await page.evaluate(() => window.__previewExecuted), undefined);
      assert.equal(await page.locator("#text .ui-preview-text-line").first().textContent(), '<script>window.__previewExecuted = true</script>\n');
      assert.equal(await page.locator("#limited-text .ui-preview-text-line").count(), 2);
      assert.match(await page.locator("#limited-text [role=status]").textContent(), /2 lines/);
      assert.equal(await page.locator("#utf8 pre").textContent(), "A\n");
      assert.equal(await page.locator("#csv tbody tr").count(), 2);
      assert.equal(await page.locator("#csv tbody tr").first().locator("td").nth(1).textContent(), "a comma, and a\nnew line");
      assert.equal(await page.locator("#csv tbody tr").first().locator("td").nth(2).textContent(), "=SUM(A1:A2)");
      assert.equal(await page.locator("#empty-cell thead th").count(), 2, "empty quoted header retained");
      assert.equal(await page.locator("#limits tbody tr").count(), 1);
      assert.equal(await page.locator("#limits thead th").count(), 3);
      assert.match(await page.locator("#limits [role=status]").textContent(), /2 rows including the header, 2 columns/);
      assert.equal(await page.locator("#partial tbody tr").count(), 1);
      assert.match(await page.locator("#partial [role=status]").textContent(), /complete rows only/);
      assert.match(await page.locator("#retry [role=alert]").textContent(), /could not be read/);
      assert.equal(await page.locator("#errors").textContent(), "1");
      await page.locator("#retry").getByRole("button", { name: "Try again" }).click();
      await page.locator("#retry pre").waitFor();
      assert.equal(await page.locator("#retry pre").textContent(), "Retry succeeds\n");
      await page.locator("#replace").click();
      await page.waitForFunction(() => document.querySelector("#stale pre")?.textContent === "CURRENT FILE\n");
      await page.locator("#resolve-old").click();
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      assert.equal(await page.locator("#stale pre").textContent(), "CURRENT FILE\n", "old input cannot overwrite current content");
      await page.locator("#unmount").click();
      assert.equal(await page.locator("#stale pre").count(), 0);
      await page.locator("#reject-abandoned").click();
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      assert.equal(await page.locator("#errors").textContent(), "1", "unmounted read failures never call the host");
      await page.setViewportSize({ width: 390, height: 844 });
      const area = page.locator("#wide .ui-preview-table-scroll");
      const beforeFocus = await area.boundingBox();
      await page.keyboard.press("Tab"); await area.focus();
      const layout = await area.evaluate(el => {
        const style = getComputedStyle(el);
        return { width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height, scrollWidth: el.scrollWidth, border: style.outlineWidth, focusVisible: el.matches(":focus-visible"), outlineStyle: style.outlineStyle, outlineColor: style.outlineColor, background: style.backgroundColor,
          sticky: getComputedStyle(el.querySelector("thead th")).position,
          pageOverflow: document.documentElement.scrollWidth > innerWidth };
      });
      assert.equal(layout.pageOverflow, false);
      assert.ok(layout.scrollWidth > layout.width, "wide rows scroll within their preview");
      assert.equal(layout.sticky, "sticky");
      assert.equal(layout.focusVisible, true); assert.equal(layout.outlineStyle, "solid");
      assert.ok(parseFloat(layout.border) >= 2, `${sheet}/${mode}: visible keyboard outline`);
      assert.notEqual(layout.outlineColor, "rgba(0, 0, 0, 0)"); assert.notEqual(layout.outlineColor, layout.background);
      assert.equal(layout.width, beforeFocus.width); assert.equal(layout.height, beforeFocus.height);
      await page.setViewportSize({ width: 1000, height: 800 });
    }
    assert.deepEqual(errors, []);
  } finally { await browser?.close(); await server.close(); }
});
