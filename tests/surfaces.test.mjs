import assert from "node:assert/strict";
import test from "node:test";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { chromium } from "playwright";
import { createServer } from "vite";
import { DialogSurface, DialogHeading, DialogActions, MenuSurface, PopoverSurface, TooltipSurface, ScrollArea } from "../dist/index.js";
import { SurfacesFixture } from "./surfaces.fixture.mjs";

test("shared surfaces retain the f156af1 controller and native scrolling contract", { timeout: 45000 }, async () => {
  for (const [Component, kind] of [[DialogSurface, "dialog"], [DialogHeading, "dialog-head"], [DialogActions, "dialog-foot"], [MenuSurface, "menu"], [PopoverSurface, "popover"], [TooltipSurface, "tooltip"]]) {
    const markup = renderToString(h(Component, { asChild: true, className: "consumer", id: "overridden" }, h("section", { id: "controller", role: "region", "aria-label": "Example", "data-state": "open", className: "positioned" }, "Body")));
    assert.match(markup, /^<section/);
    assert.equal((markup.match(/<section/g) ?? []).length, 1);
    for (const attribute of ['id="controller"', 'role="region"', 'aria-label="Example"', 'data-state="open"', `data-vic-surface="${kind}"`, "consumer positioned"]) assert.ok(markup.includes(attribute), attribute);
    assert.throws(() => renderToString(h(Component, { asChild: true }, h("div"), h("div"))));
    const plain = renderToString(h(Component, null, "Body"));
    assert.match(plain, /^<div/);
    assert.doesNotMatch(plain, /role=|aria-modal=/, "style-only surfaces do not invent controller semantics");
  }
  assert.match(renderToString(h(ScrollArea, { "aria-label": "Activity" }, "Body")), /data-slot="scroll-area-viewport"/);
  const html = renderToString(h(SurfacesFixture));
  const server = await createServer({ configFile: false, cacheDir: "node_modules/.vite-surfaces-test", optimizeDeps: { entries: ["tests/surfaces-hydrate.fixture.mjs"] }, server: { host: "127.0.0.1", port: 0 }, plugins: [{
    name: "surfaces-fixture",
    configureServer(server) { server.middlewares.use((request, response, next) => {
      if (!request.url?.startsWith("/?")) return next();
      const sheet = request.url.includes("composable") ? "ui/styles.css" : "vic-ui.css";
      response.setHeader("Content-Type", "text/html");
      response.end(`<html data-mode="light"><head><link rel="stylesheet" href="/dist/${sheet}"></head><body><div id="root">${html}</div><script type="module" src="/tests/surfaces-hydrate.fixture.mjs"></script></body></html>`);
    }); },
  }] });
  let browser;
  try {
    await server.listen();
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ reducedMotion: "reduce" });
    page.setDefaultTimeout(10000);
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    for (const stylesheet of ["native", "composable"]) {
      await page.goto(`${server.resolvedUrls.local[0]}?${stylesheet}`);
      await page.getByRole("button", { name: "Open settings" }).click();
      const dialog = page.getByRole("dialog", { name: "Settings", exact: true });
      await dialog.waitFor();
      assert.equal(await dialog.evaluate(el => el.matches(":modal")), true, "child ref opens the native dialog");
      assert.equal(await dialog.locator("header.ui-dialog-head").count(), 1);
      assert.equal(await dialog.locator(".ui-dialog-foot").count(), 1);
      assert.notEqual(await dialog.evaluate(el => getComputedStyle(el).boxShadow), "none");
      await page.keyboard.press("Escape");
      await dialog.waitFor({ state: "hidden" });
      await page.waitForFunction(() => document.querySelector("#close-count").textContent === "1");
      assert.equal(await page.evaluate(() => document.activeElement.id), "open-dialog");
      await page.getByRole("menuitem", { name: "Save item" }).click();
      assert.equal(await page.locator("#child-count").textContent(), "1");
      assert.equal(await page.locator("#surface-count").textContent(), "0", "child handler retains precedence");
      for (const mode of ["light", "dark"]) {
        await page.evaluate(mode => { document.documentElement.dataset.mode = mode; }, mode);
        for (const id of ["controlled-menu", "popover", "tooltip"]) assert.notEqual(await page.locator(`#${id}`).evaluate(el => getComputedStyle(el).boxShadow), "none", `${stylesheet}/${mode}/${id} retains shared styling`);
      }
      const viewport = page.locator("#native-scroll > [data-slot=scroll-area-viewport]");
      const metrics = await viewport.evaluate(el => ({ overflow: getComputedStyle(el).overflowY, height: el.clientHeight, scrollHeight: el.scrollHeight }));
      assert.equal(metrics.overflow, "auto");
      assert.equal(metrics.height, 120);
      assert.ok(metrics.scrollHeight > metrics.height);
      await viewport.hover();
      await page.mouse.wheel(0, 240);
      await page.waitForFunction(() => document.querySelector("#native-scroll > div").scrollTop > 0);
    }
    assert.deepEqual(errors, []);
  } finally { await browser?.close(); await server.close(); }
});
