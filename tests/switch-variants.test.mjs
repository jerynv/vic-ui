import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { chromium } from "playwright";
import { createServer } from "vite";
import { SwitchVariantsFixture } from "./switch-variants.fixture.mjs";

const appearance = locator => locator.evaluate(el => {
  const style = getComputedStyle(el), box = el.getBoundingClientRect();
  const knob = el.querySelector(".ui-switch-knob"), knobStyle = getComputedStyle(knob), knobBox = knob.getBoundingClientRect();
  return { width: box.width, height: box.height, radius: style.borderRadius, fill: style.backgroundColor, rim: style.boxShadow,
    border: style.borderWidth, opacity: style.opacity, cursor: style.cursor,
    knob: { width: knobBox.width, height: knobBox.height, radius: knobStyle.borderRadius, fill: knobStyle.backgroundColor,
      shadow: knobStyle.boxShadow, offset: knobBox.x - box.x } };
});

test("flat and rimmed switches preserve track, knob and interaction in both themes and stylesheet entries", { timeout: 45000 }, async () => {
  const html = renderToString(createElement(SwitchVariantsFixture));
  const server = await createServer({ configFile: false, cacheDir: "node_modules/.vite-switch-variants-test",
    optimizeDeps: { entries: ["tests/switch-variants-hydrate.fixture.mjs"] }, server: { host: "127.0.0.1", port: 0 }, plugins: [{
      name: "switch-variants-fixture", configureServer(server) { server.middlewares.use((request, response, next) => {
        if (!request.url?.startsWith("/?")) return next();
        const sheet = request.url.includes("composable") ? "ui/styles.css" : "vic-ui.css";
        response.setHeader("Content-Type", "text/html");
        response.end(`<html data-mode="light"><head><link rel="stylesheet" href="/dist/${sheet}"><style>*{transition:none!important}</style></head><body><div id="root">${html}</div><script type="module" src="/tests/switch-variants-hydrate.fixture.mjs"></script></body></html>`);
      }); },
    }] });
  let browser;
  try {
    await server.listen(); browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ reducedMotion: "reduce", viewport: { width: 1440, height: 1000 } });
    page.setDefaultTimeout(10000);
    const errors = []; page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    for (const sheet of ["native", "composable"]) {
      for (const mode of ["light", "dark"]) {
        await page.goto(`${server.resolvedUrls.local[0]}?${sheet}`, { waitUntil: "networkidle" });
        await page.evaluate(mode => { document.documentElement.dataset.mode = mode; }, mode);
        for (const api of ["native", "composable"]) {
          await page.mouse.move(1400, 950);
          const flat = await appearance(page.getByRole("switch", { name: `${api}-flat`, exact: true }));
          const rimmed = await appearance(page.getByRole("switch", { name: `${api}-rimmed`, exact: true }));
          assert.equal(flat.rim, "none", `${api} ${mode} flat has no track rim`);
          assert.equal(flat.border, "0px");
          assert.notEqual(rimmed.rim, "none");
          assert.deepEqual({ ...flat, rim: rimmed.rim }, rimmed, "only the decorative rim changes");
          assert.deepEqual(await appearance(page.getByRole("switch", { name: `${api}-default`, exact: true })), rimmed, "default keeps the rimmed appearance");
          assert.notEqual(flat.knob.shadow, "none", "flat keeps knob elevation");
          for (const look of ["flat", "rimmed"]) {
            const id = `${api}-${look}`, control = page.getByRole("switch", { name: id, exact: true });
            assert.equal(await control.getAttribute("look"), null, "look is consumed, not forwarded to the DOM");
            const off = await appearance(control);
            await control.hover();
            const offHover = await appearance(control);
            assert.notEqual(offHover.fill, off.fill, "off hover keeps its feedback");
            assert.equal(offHover.rim, off.rim);
            await page.mouse.move(1400, 950);
            await page.keyboard.press("Tab"); await control.focus();
            assert.equal(await control.evaluate(el => getComputedStyle(el).outlineWidth), "2px", "keyboard focus remains visible");
            await page.keyboard.press("Space");
            await page.waitForFunction(id => document.querySelector(`[role="switch"][aria-label="${id}"]`).getAttribute("aria-checked") === "true", id);
            assert.equal(await page.locator(`#${id}-changes`).textContent(), "1");
            const on = await appearance(control);
            assert.notEqual(on.fill, off.fill);
            assert.ok(on.knob.offset > off.knob.offset, "the knob moves to the on position");
            assert.equal(on.rim, off.rim);
            await control.hover();
            assert.notEqual((await appearance(control)).fill, on.fill, "on hover keeps its feedback");
            assert.equal((await appearance(control)).rim, off.rim);
            await page.mouse.move(1400, 950); await page.keyboard.press("Space");
            await page.waitForFunction(id => document.querySelector(`[role="switch"][aria-label="${id}"]`).getAttribute("aria-checked") === "false", id);
            assert.equal(await page.locator(`#${id}-changes`).textContent(), "2");
            assert.deepEqual(await appearance(control), off, "keyboard toggling restores the off appearance");
            await control.click(); await control.click();
            assert.equal(await control.getAttribute("aria-checked"), "false");
            assert.equal(await page.locator(`#${id}-changes`).textContent(), "4", "one callback per pointer toggle");
            for (const value of [false, true]) {
              const disabled = page.getByRole("switch", { name: `${id} disabled ${value}`, exact: true });
              await page.mouse.move(1400, 950);
              const before = await appearance(disabled);
              assert.equal(before.opacity, "0.55"); assert.equal(before.cursor, "not-allowed");
              await disabled.hover(); await page.mouse.down();
              assert.deepEqual(await appearance(disabled), before, "disabled track and knob stay unchanged on hover and press");
              await page.mouse.up(); await disabled.dispatchEvent("click");
              assert.equal(await disabled.getAttribute("aria-checked"), String(value));
              assert.equal(await page.locator(`#${id}-blocked`).textContent(), "0");
            }
          }
        }
        const held = page.locator("#held-flat");
        await page.keyboard.press("Tab"); await held.focus();
        await page.waitForFunction(() => document.querySelector('[role="tooltip"]')?.matches(":popover-open"));
        assert.equal(await page.getByRole("tooltip", { includeHidden: true }).textContent(), "Only an owner can change this.");
        const description = await held.getAttribute("aria-describedby");
        assert.equal(await page.locator(`[id="${description}"]`).textContent(), "Only an owner can change this.");
        await page.keyboard.press("Space"); await page.keyboard.press("Enter"); await held.dispatchEvent("click");
        assert.equal(await held.getAttribute("aria-checked"), "false");
        assert.equal(await held.getAttribute("aria-disabled"), "true");
        assert.equal(await held.evaluate(el => el.disabled), false, "disabledReason remains keyboard discoverable");
        assert.equal(await page.locator("#held-changes").textContent(), "0");
        assert.equal((await appearance(held)).rim, "none");
      }
    }
    assert.deepEqual(errors, []);
  } finally { await browser?.close(); await server.close(); }
});
