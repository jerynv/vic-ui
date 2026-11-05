import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { chromium } from "playwright";
import { createServer } from "vite";
import { PreviewDialogFixture } from "./preview-dialog.fixture.mjs";

test("preview stages and dialogs preserve host actions, focus and scoped keyboard behavior", { timeout: 45000 }, async () => {
  const html = renderToString(createElement(PreviewDialogFixture));
  assert.ok(html.includes("Example.csv"));
  const server = await createServer({ configFile: false, cacheDir: "node_modules/.vite-preview-dialog-test",
    optimizeDeps: { entries: ["tests/preview-dialog-hydrate.fixture.mjs"] }, server: { host: "127.0.0.1", port: 0 }, plugins: [{
      name: "preview-dialog-fixture", configureServer(server) { server.middlewares.use((request, response, next) => {
        if (!request.url?.startsWith("/?")) return next();
        const sheet = request.url.includes("composable") ? "ui/styles.css" : "vic-ui.css";
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(`<html><head><link rel="stylesheet" href="/dist/${sheet}"></head><body style="overflow:auto"><div id="root">${html}</div><script type="module" src="/tests/preview-dialog-hydrate.fixture.mjs"></script></body></html>`);
      }); },
    }] });
  let browser;
  try {
    await server.listen(); browser = await chromium.launch();
    const page = await browser.newPage({ reducedMotion: "reduce" });
    page.setDefaultTimeout(5000);
    const errors = []; page.on("pageerror", error => errors.push(error.message));
    for (const sheet of ["native", "composable"]) for (const mode of ["light", "dark"]) {
      await page.goto(`${server.resolvedUrls.local[0]}?${sheet}`, { waitUntil: "networkidle" });
      await page.evaluate(mode => document.documentElement.dataset.mode = mode, mode);
      await page.getByRole("button", { name: "Try again", exact: true }).click();
      assert.ok(await page.getByText("Retry completed").isVisible());
      const download = page.waitForEvent("download");
      await page.getByRole("link", { name: "Download sample" }).click();
      assert.equal((await download).suggestedFilename(), "example.txt");
      await page.locator("#launch").click();
      const dialog = page.getByRole("dialog", { name: "First file" });
      assert.ok(await dialog.isVisible());
      assert.equal(await page.evaluate(() => document.body.style.overflow), "hidden");
      assert.equal(await page.evaluate(() => document.activeElement.className), "ui-preview-dialog-body");
      for (let n = 0; n < 10; n++) { await page.keyboard.press("Tab"); assert.ok(await page.evaluate(() => !!document.activeElement.closest("dialog")), "native modal contains focus"); }
      await page.getByRole("textbox", { name: "Filter preview" }).focus();
      await page.keyboard.press("ArrowRight");
      assert.ok(await dialog.isVisible(), "editable arrows do not navigate files");
      await page.keyboard.press("Escape");
      assert.equal(await page.getByRole("textbox", { name: "Filter preview" }).inputValue(), "");
      assert.ok(await dialog.isVisible(), "nested Escape is respected");
      await page.getByRole("button", { name: "Open nested dialog", exact: true }).click();
      assert.ok(await page.getByRole("dialog", { name: "Nested choices", exact: true }).isVisible());
      await page.keyboard.press("Escape");
      assert.equal(await page.getByRole("dialog", { name: "Nested choices", exact: true }).count(), 0);
      assert.ok(await dialog.isVisible(), "nested dialog cancel does not close its preview ancestor");
      await page.keyboard.press("Escape");
      assert.equal(await page.locator("#active").textContent(), "closed");
      await page.locator("#launch").click();
      await page.getByRole("textbox", { name: "Editable annotation" }).focus();
      await page.keyboard.press("ArrowLeft"); assert.ok(await dialog.isVisible());
      await page.keyboard.press("Tab");
      assert.equal(await page.evaluate(() => document.activeElement.getAttribute("aria-label")), "Wide data", "Tab after contenteditable reaches the following control");
      const data = page.getByRole("region", { name: "Wide data", exact: true });
      await data.focus(); await page.keyboard.press("ArrowRight");
      assert.ok(await dialog.isVisible(), "table arrows never switch files");
      await page.waitForFunction(() => document.querySelector("dialog .ui-preview-table-scroll").scrollLeft > 0);
      await page.getByRole("button", { name: "Replace active file" }).click();
      assert.equal(await page.evaluate(() => document.activeElement.className), "ui-preview-dialog-body", "replacing focused content restores dialog focus");
      await page.getByRole("button", { name: "Previous file", exact: true }).click();
      assert.equal(await page.evaluate(() => document.activeElement.getAttribute("aria-label")), "Previous file", "navigation controls keep their focus");
      await page.locator(".ui-preview-dialog-body").focus();
      await page.keyboard.press("ArrowRight");
      assert.ok(await page.getByRole("dialog", { name: "Second file" }).isVisible());
      await page.keyboard.press("ArrowRight"); assert.ok(await dialog.isVisible(), "navigation wraps");
      await page.keyboard.press("Escape");
      assert.equal(await page.locator("#active").textContent(), "closed");
      assert.equal(await page.evaluate(() => document.activeElement.id), "launch");
      assert.equal(await page.evaluate(() => document.body.style.overflow), "auto");
      await page.locator("#launch").click(); await page.getByRole("button", { name: "Remove active item" }).click();
      await page.waitForFunction(() => document.getElementById("active").textContent === "closed");
      assert.equal(await page.evaluate(() => document.activeElement.id), "launch");
      await page.locator("#launch").click(); await page.getByRole("button", { name: "Unmount preview" }).click();
      assert.equal(await page.evaluate(() => document.activeElement.id), "launch");
      assert.equal(await page.evaluate(() => document.body.style.overflow), "auto");
    }
    await page.goto(`${server.resolvedUrls.local[0]}?native&explicit`, { waitUntil: "networkidle" });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator("#launch").click();
    assert.ok(await page.getByRole("button", { name: "Close preview", exact: true }).isVisible());
    assert.ok(await page.getByRole("link", { name: "Download file" }).isVisible());
    assert.ok(await page.evaluate(() => document.querySelector("dialog").scrollWidth <= innerWidth), "narrow dialog fits viewport");
    await page.getByRole("button", { name: "Close preview", exact: true }).click();
    assert.equal(await page.evaluate(() => document.activeElement.getAttribute("aria-label")), "Return focus target");
    await page.getByRole("button", { name: "Open missing item" }).click();
    await page.waitForFunction(() => document.getElementById("active").textContent === "closed");
    assert.equal(await page.getByRole("dialog").count(), 0);
    assert.deepEqual(errors, []);
  } finally { await browser?.close(); await server.close(); }
});
