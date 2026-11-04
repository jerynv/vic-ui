import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { chromium } from "playwright";
import { createServer } from "vite";
import { SidebarFixture } from "./sidebar.fixture.mjs";

test("mobile sidebar traps focus, restores the opener, and respects contained layouts", { timeout: 60000 }, async (t) => {
  const server = await createServer({ configFile: false, cacheDir: "node_modules/.vite-sidebar-test", server: { host: "127.0.0.1", port: 0 }, plugins: [{
    name: "sidebar-fixture",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const url = new URL(request.url, "http://localhost");
        if (url.pathname !== "/") return next();
        const html = renderToString(createElement(SidebarFixture, { contained: url.searchParams.has("contained"), empty: url.searchParams.has("empty") }));
        response.setHeader("Content-Type", "text/html");
        response.end(`<html><head><link rel="stylesheet" href="/dist/vic-ui.css"></head><body><div id="root">${html}</div><script type="module" src="/tests/sidebar-hydrate.fixture.mjs"></script></body></html>`);
      });
    },
  }] });
  let browser;
  try {
    await server.listen();
    browser = await chromium.launch({ headless: true });
    for (const query of ["", "?contained", "?empty"]) {
      await t.test(query || "window", async () => {
      const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
      page.setDefaultTimeout(10000);
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(server.resolvedUrls.local[0] + query);
      const opener = page.getByRole("button", { name: "Open navigation" });
      await opener.click();
      const popup = page.getByRole("dialog", { name: "Project navigation" });
      await popup.waitFor();
      assert.equal(await popup.evaluate((element) => getComputedStyle(element).width), "200px");
      assert.equal(await popup.evaluate((element) => getComputedStyle(element).position), query.includes("contained") ? "absolute" : "fixed");
      const close = page.getByRole("button", { name: "Close navigation" });
      await close.focus();
      await page.keyboard.press("Tab");
      await page.waitForFunction(() => document.querySelector('[role="dialog"]')?.contains(document.activeElement));
      await page.keyboard.press("Shift+Tab");
      await page.waitForFunction(() => document.activeElement.getAttribute("aria-label") === "Close navigation");
      assert.equal(await page.getByRole("textbox", { name: "Background" }).count(), 0);
      for (let step = 0; step < 8; step++) {
        await page.keyboard.press("Tab");
        await page.waitForFunction(() => document.querySelector('[role="dialog"]')?.contains(document.activeElement));
      }
      await page.keyboard.press("Escape");
      await popup.waitFor({ state: "hidden" });
      await page.waitForFunction(() => document.activeElement.textContent === "Open navigation");
      await opener.click();
      await close.click();
      await popup.waitFor({ state: "hidden" });
      await page.waitForFunction(() => document.activeElement.textContent === "Open navigation");
      await opener.click();
      await page.locator(".ui-sidebar-backdrop").click({ position: { x: 350, y: 100 } });
      await popup.waitFor({ state: "hidden" });
      await opener.click();
      await page.setViewportSize({ width: 1100, height: 844 });
      await page.getByRole("complementary", { name: "Project navigation" }).waitFor();
      await page.getByRole("textbox", { name: "Background" }).fill("available");
      assert.equal(await page.getByRole("textbox", { name: "Background" }).inputValue(), "available");
      assert.deepEqual(errors, []);
      await page.close();
      });
    }
  } finally {
    await browser?.close();
    await server.close();
  }
});
