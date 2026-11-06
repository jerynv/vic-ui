import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { chromium } from "playwright";
import { createServer } from "vite";
import { SidebarFixture, SidebarOptionsFixture } from "./sidebar.fixture.mjs";

test("mobile sidebar traps focus, restores the opener, and respects contained layouts", { timeout: 60000 }, async (t) => {
  const server = await createServer({ configFile: false, cacheDir: "node_modules/.vite-sidebar-test", optimizeDeps: { entries: ["tests/sidebar-hydrate.fixture.mjs"] }, server: { host: "127.0.0.1", port: 0 }, plugins: [{
    name: "sidebar-fixture",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const url = new URL(request.url, "http://localhost");
        if (url.pathname !== "/") return next();
        const html = renderToString(url.searchParams.has("options") ? createElement(SidebarOptionsFixture, { dense: url.searchParams.has("dense") }) : createElement(SidebarFixture, { contained: url.searchParams.has("contained"), empty: url.searchParams.has("empty") }));
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
      assert.equal(await popup.locator('[data-sidebar="trigger"]').count(), 0, "a sheet has its own close, so the header's trigger draws nothing");
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
    await t.test("row sizes, dense labels, group gap, counts, trigger and weights", async () => {
      const page = await browser.newPage({ viewport: { width: 1100, height: 600 }, reducedMotion: "reduce" });
      page.setDefaultTimeout(10000);
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(server.resolvedUrls.local[0] + "?options");
      const row = (name) => page.locator(".ui-sidebar-button").filter({ hasText: name }).first();
      const height = (name) => row(name).evaluate((el) => el.getBoundingClientRect().height);
      assert.equal(await height("Small"), 28);
      assert.equal(await height("Middle"), 32);
      assert.equal(await height("Large"), 40);
      const box = (id) => page.getByTestId(id).evaluate((el) => el.getBoundingClientRect().height);
      assert.ok(await box("dense") < await box("plain"), "a dense label is shorter than a plain one");
      const gap = () => page.evaluate(() => document.querySelector('[data-testid="second"]').getBoundingClientRect().top - document.querySelector('[data-testid="first"]').getBoundingClientRect().bottom);
      assert.equal(await gap(), 12, "groups are 0.75rem apart by default");
      const soft = page.locator(".ui-count-soft").first();
      assert.equal(await soft.evaluate((el) => getComputedStyle(el).height), "18px");
      const counted = row("Counted");
      assert.equal(await counted.locator(".ui-count-soft").isVisible(), true);
      assert.equal(await counted.locator(".ui-sidebar-dot").isVisible(), false);
      assert.equal(await page.getByRole("button", { name: "Counted 3 unread", exact: true }).count(), 1, "the count is said once, by its label");
      const trigger = page.locator('[data-sidebar="trigger"]');
      assert.equal(await trigger.getAttribute("aria-label"), "Collapse menu");
      assert.equal(await trigger.getAttribute("aria-expanded"), "true");
      await trigger.click();
      assert.equal(await trigger.getAttribute("aria-label"), "Expand menu");
      assert.equal(await trigger.getAttribute("aria-expanded"), "false");
      await page.waitForFunction(() => document.querySelector("aside.ui-sidebar").getBoundingClientRect().width === 48);
      assert.equal(await page.getByTestId("brand").isVisible(), false, "folded, the header shows only the trigger");
      const at = await trigger.evaluate((el) => { const r = el.getBoundingClientRect(), a = document.querySelector("aside.ui-sidebar").getBoundingClientRect(); return [r.left - a.left, r.width]; });
      assert.deepEqual(at, [8, 32], "the folded trigger sits over the marks");
      assert.equal(await counted.locator(".ui-count-soft").isVisible(), false);
      assert.equal(await counted.locator(".ui-sidebar-dot").isVisible(), true);
      assert.match(await counted.ariaSnapshot(), /^- button "3 unread Counted"/, "folded, the dot says the count once");
      assert.equal(await gap(), 0, "folded, the rule spaces the groups rather than the gap");
      await trigger.press("Enter");
      assert.equal(await trigger.getAttribute("aria-expanded"), "true");
      assert.equal(await page.getByTestId("brand").isVisible(), true);
      const weight = (locator) => locator.evaluate((el) => getComputedStyle(el).fontWeight);
      assert.equal(await weight(row("Middle")), "500");
      await page.addStyleTag({ content: ":root { --weight-quiet: 400; }" });
      assert.equal(await weight(row("Middle")), "400");
      assert.equal(await weight(page.locator(".ui-sidebar-group-words").first()), "400");
      assert.equal(await weight(page.getByTestId("ink")), "500", "the rest of the interface keeps --weight-ui");
      await page.addStyleTag({ content: ":root { --weight-ui: 400; }" });
      assert.equal(await weight(page.getByTestId("ink")), "400");
      assert.deepEqual(errors, []);
      await page.goto(server.resolvedUrls.local[0] + "?options&dense");
      assert.equal(await height("Middle"), 28, "a dense rail sets every row 1.75rem");
      assert.equal(await height("Large"), 40, "a row's own size outranks the rail's");
      assert.equal(await height("Kept"), 32);
      assert.equal(await page.locator(".ui-sidebar-group-words").last().evaluate((el) => getComputedStyle(el).fontSize), "11px");
      assert.deepEqual(errors, []);
      await page.close();
    });
  } finally {
    await browser?.close();
    await server.close();
  }
});
