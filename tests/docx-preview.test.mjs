import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { chromium } from "playwright";
import { createServer } from "vite";
import { docxCases } from "./docx-preview-data.fixture.mjs";
import { DocxFixture } from "./docx-preview.fixture.mjs";

test("DOCX renders real text, tables and bounded images in a sandbox and cleans up retries/stale inputs", { timeout: 60000 }, async () => {
  const html = renderToString(createElement(DocxFixture, { cases: docxCases }));
  assert.ok(html.includes("Preparing document")); assert.ok(!html.includes("<iframe"));
  const server = await createServer({ configFile: false, cacheDir: "node_modules/.vite-docx-preview-test", optimizeDeps: { entries: ["tests/docx-preview-hydrate.fixture.mjs"] }, server: { host: "127.0.0.1", port: 0 }, plugins: [{
    name: "docx-preview-fixture", configureServer(server) { server.middlewares.use((request, response, next) => {
      if (!request.url?.startsWith("/?")) return next();
      const sheet = request.url.includes("composable") ? "ui/styles.css" : "vic-ui.css";
      response.setHeader("Content-Type", "text/html; charset=utf-8");
      response.end(`<html><head><link rel="stylesheet" href="/dist/${sheet}"></head><body><div id="root">${html}</div><script>window.docxCases=${JSON.stringify(docxCases)}</script><script type="module" src="/tests/docx-preview-hydrate.fixture.mjs"></script></body></html>`);
    }); },
  }] });
  let browser;
  try {
    await server.listen(); browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 1000, height: 900 } }); page.setDefaultTimeout(8000);
    const errors = [], outside = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("request", request => { if (/must-not-fetch/.test(request.url())) outside.push(request.url()); });
    const ready = async text => { await page.frameLocator("#docx-host iframe").getByText(text, { exact: true }).waitFor(); };
    for (const sheet of ["native", "composable"]) for (const mode of ["light", "dark"]) {
      await page.goto(`${server.resolvedUrls.local[0]}?${sheet}`, { waitUntil: "networkidle" });
      await page.evaluate(mode => document.documentElement.dataset.mode = mode, mode);
      await ready("Quarterly report"); const iframe = page.locator("#docx-host iframe"), frame = page.frameLocator("#docx-host iframe");
      assert.equal(await iframe.getAttribute("sandbox"), "");
      assert.equal(await iframe.getAttribute("referrerpolicy"), "no-referrer");
      assert.equal(await frame.locator("table").count(), 1);
      assert.equal(await frame.getByText("120", { exact: true }).count(), 1);
      assert.ok(await frame.getByText("Quarterly report", { exact: true }).evaluate(node => Number(getComputedStyle(node).fontWeight) >= 600));
      await frame.locator("img").evaluate(image => image.decode());
      assert.equal(await frame.locator("img").evaluate(image => image.naturalWidth), 1);
      assert.equal(await frame.locator("[href],script,iframe,form,svg").count(), 0);
      assert.ok(await frame.getByText("External link becomes text", { exact: true }).isVisible());
      assert.match(await frame.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute("content"), /default-src 'none'/);
      assert.equal(await iframe.evaluate(node => { try { return node.contentWindow.document.body.textContent; } catch { return "isolated"; } }), "isolated");
      assert.deepEqual(await page.evaluate(() => window.docxUrls), []);
      assert.ok(await page.evaluate(() => window.docxBitmaps.every(image => image.closed)));
      await page.getByRole("button", { name: "invalid", exact: true }).click(); await page.getByRole("alert").waitFor();
      assert.equal(await iframe.count(), 0, "replacement hides previous document immediately");
      await page.getByRole("button", { name: "retry", exact: true }).click(); await page.getByRole("alert").getByText("Temporary byte read failure", { exact: true }).waitFor();
      await page.getByRole("button", { name: "Try again", exact: true }).click(); await ready("Quarterly report");
      assert.equal(await page.evaluate(() => document.activeElement?.className), "ui-preview-docx", "retry keeps focus on the persistent preview group");
      await page.getByRole("button", { name: "repeated", exact: true }).click(); await ready("Two image placements");
      assert.equal(await frame.locator("img").count(), 2);
      await frame.locator("img").evaluateAll(images => Promise.all(images.map(image => image.decode())));
      await page.getByRole("button", { name: "numbered", exact: true }).click(); await ready("First numbered item");
      assert.equal(await frame.locator("wbr").count(), 1);
      assert.ok(await frame.locator("p").filter({ hasText: "First numbered item" }).evaluate(node => getComputedStyle(node, "::before").content.includes("counter(")), "ordinary list counters and escaped tab suffixes survive");
      await page.getByRole("button", { name: "headerGood", exact: true }).click(); await ready("Header page 5");
      assert.equal(await frame.locator("section.docx").count(), 5);
      assert.equal(await frame.locator("header img").count(), 5);
      await frame.locator("header img").evaluateAll(images => Promise.all(images.map(image => image.decode())));
      await page.getByRole("button", { name: "stale", exact: true }).click(); await page.waitForFunction(() => typeof window.resolveOldDocx === "function");
      await page.getByRole("button", { name: "plain", exact: true }).click(); await ready("Current document");
      await page.evaluate(() => window.resolveOldDocx()); await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      await ready("Current document");
      await page.evaluate(() => { window.deferDocxBitmap = true; });
      await page.getByRole("button", { name: "imageRace", exact: true }).click(); await page.waitForFunction(() => typeof window.resolveDocxBitmap === "function");
      await page.getByRole("button", { name: "plain", exact: true }).click(); await ready("Current document");
      await page.evaluate(() => window.resolveDocxBitmap()); await page.waitForFunction(() => window.docxBitmaps.every(image => image.closed)); await ready("Current document");
      const beforeStaleConversion = await page.locator("#docx-errors").textContent();
      await page.evaluate(() => { window.deferDocxFileReader = true; });
      await page.getByRole("button", { name: "imageRace", exact: true }).click(); await page.waitForFunction(() => typeof window.resolveDocxFileReader === "function");
      await page.getByRole("button", { name: "plain", exact: true }).click(); await ready("Current document");
      await page.evaluate(() => window.resolveDocxFileReader());
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      await ready("Current document"); assert.equal(await page.locator("#docx-errors").textContent(), beforeStaleConversion);
      await page.setViewportSize({ width: 390, height: 844 }); await ready("Current document");
      assert.ok(await iframe.evaluate(node => node.getBoundingClientRect().width <= innerWidth));
      await page.getByRole("button", { name: "Unmount", exact: true }).click();
      assert.equal(await iframe.count(), 0); assert.equal(await page.evaluate(() => window.docxObservers.size), 0);
      await page.evaluate(() => { window.deferDocxBitmap = true; window.resolveDocxBitmap = undefined; });
      await page.getByRole("button", { name: "imageRace", exact: true }).click(); await page.waitForFunction(() => typeof window.resolveDocxBitmap === "function");
      const beforeUnmount = await page.locator("#docx-errors").textContent();
      await page.getByRole("button", { name: "Unmount", exact: true }).click(); await page.evaluate(() => window.resolveDocxBitmap());
      await page.waitForFunction(() => window.docxBitmaps.every(image => image.closed));
      assert.equal(await page.locator("#docx-errors").textContent(), beforeUnmount);
      await page.setViewportSize({ width: 1000, height: 900 });
    }
    await page.goto(`${server.resolvedUrls.local[0]}?native`, { waitUntil: "networkidle" }); await ready("Quarterly report");
    for (const [name, message] of [["mainBin", /validated XML/], ["namespacedMainBin", /validated XML/], ["stylesBin", /validated XML/], ["headerBin", /validated XML/], ["numberingLevels", /unique levels/], ["numberingProduct", /expanded numbering/], ["numberingWeight", /expanded numbering/], ["headerBudget", /image placement budget/]]) {
      const work = await page.evaluate(() => ({ renders: window.docxInertRenders, readers: window.docxFileReads, bytes: window.docxFileReadBytes, bitmaps: window.docxBitmaps.length }));
      await page.getByRole("button", { name, exact: true }).click(); await page.getByRole("alert").waitFor();
      assert.match(await page.getByRole("alert").textContent(), message, name);
      assert.deepEqual(await page.evaluate(() => ({ renders: window.docxInertRenders, readers: window.docxFileReads, bytes: window.docxFileReadBytes, bitmaps: window.docxBitmaps.length })), work, `${name} must be refused before dependency rendering, Blob conversion or image decoding`);
    }
    for (const [name, message] of [["external", /External resources/], ["vml", /VML/], ["doctype", /entities|document types/], ["pixels", /pixel budget/], ["repeatedBudget", /image placement budget/], ["repeatedPixels", /image placement budget/], ["escapedUrl", /resource-bearing styles/], ["escapedImport", /resource-bearing styles/], ["imageSet", /resource-bearing styles/], ["macro", /macros/], ["unsafe", /unsafe identifier/], ["textBudget", /text or element budget/], ["zipBomb", /expanded budget/], ["oversized", /encoded bytes/]]) {
      await page.getByRole("button", { name, exact: true }).click();
      await page.getByRole("alert").waitFor(); assert.match(await page.getByRole("alert").textContent(), message, name);
      assert.equal(await page.locator("#docx-host iframe").count(), 0);
    }
    await page.getByRole("button", { name: "plain", exact: true }).click(); await ready("Current document");
    await page.getByRole("button", { name: "Lower byte limit", exact: true }).click(); await page.getByRole("alert").waitFor();
    assert.match(await page.getByRole("alert").textContent(), /64 encoded bytes/);
    await page.getByRole("button", { name: "Reset byte limit", exact: true }).click(); await ready("Current document");
    await page.getByRole("button", { name: "good", exact: true }).click(); await ready("Quarterly report");
    await page.locator("#docx-host").screenshot({ path: "/tmp/vic-docx-preview.png" });
    assert.deepEqual(outside, []); assert.deepEqual(errors, []);
  } finally { await browser?.close(); await server.close(); }
});
