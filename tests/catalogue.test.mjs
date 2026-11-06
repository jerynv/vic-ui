import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { chromium } from "playwright";
import { createServer } from "vite";
import { ArchiveIcon } from "../dist/icons.js";
import { CatalogueFixture } from "./catalogue.fixture.mjs";

test("packaged shadcn controls hydrate, respond to keyboard input, and render themed source", { timeout: 60000 }, async () => {
  assert.doesNotThrow(() => renderToString(createElement(ArchiveIcon, { children: "Primitive fallback" })));
  const html = renderToString(createElement(CatalogueFixture));
  assert.match(html, /Change color theme/);
  const server = await createServer({ configFile: false, cacheDir: "node_modules/.vite-catalogue-test", optimizeDeps: { entries: ["tests/catalogue-hydrate.fixture.mjs"] }, server: { host: "127.0.0.1", port: 0 }, plugins: [{
    name: "catalogue-fixture",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.url !== "/") return next();
        response.setHeader("Content-Type", "text/html");
        response.end(`<html data-mode="light"><head><link rel="stylesheet" href="/dist/ui/styles.css"></head><body><div id="root">${html}</div><script type="module" src="/tests/catalogue-hydrate.fixture.mjs"></script></body></html>`);
      });
    },
  }] });
  let browser;
  try {
    await server.listen();
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ reducedMotion: "reduce", permissions: ["clipboard-read", "clipboard-write"] });
    page.setDefaultTimeout(15000);
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(server.resolvedUrls.local[0]);
    for (const mode of ["light", "dark"]) {
      await page.evaluate(async mode => {
        // Compare settled paints; an in-flight transition serializes the same
        // neutral colour as oklab rather than its final oklch token. A transition
        // can start after any wait for the running ones, so none run while the
        // two are compared: the mode lands at once, then the styles are read.
        const settle = document.createElement("style");
        settle.id = "settle";
        settle.textContent = "*, *::before, *::after { transition: none !important; }";
        document.head.append(settle);
        document.documentElement.dataset.mode = mode;
        getComputedStyle(document.documentElement).color;
        await new Promise(resolve => requestAnimationFrame(resolve));
      }, mode);
      for (const part of ["button", "line", "card", "field", "switch", "badge", "check"]) {
        const styles = await page.evaluate(part => {
          const original = document.querySelector(`#original-${part}`);
          const composed = document.querySelector(part === "switch" ? "#identity [data-slot=switch]" : part === "check" ? "#identity [data-slot=checkbox]" : `#composed-${part}`);
          const appearance = element => {
            const style = getComputedStyle(element);
            return Object.fromEntries(["height", "backgroundImage", "backgroundColor", "borderRadius", "boxShadow", "fontSize", "color"].map(key => [key, style[key]]));
          };
          return [original, composed].map(element => ({ outer: appearance(part === "field" ? element.parentElement : element), inner: element.querySelector(".ui-button-face, .ui-switch-knob") ? appearance(element.firstElementChild) : null }));
        }, part);
        assert.deepEqual(styles[1], styles[0], `${part} preserves vic's ${mode} appearance`);
      }
    }
    await page.evaluate(() => document.querySelectorAll("#settle").forEach(settle => settle.remove()));
    for (const mode of ["light", "dark"]) {
      await page.evaluate(async mode => {
        document.documentElement.dataset.mode = mode;
        // Compare settled paints; an in-flight transition serializes the same
        // neutral colour as oklab rather than its final oklch token.
        await new Promise(resolve => requestAnimationFrame(resolve));
        await Promise.all(document.getAnimations().filter(animation => animation instanceof CSSTransition).map(animation => animation.finished.catch(() => {})));
      }, mode);
      const styles = await page.locator("#surface-tests").evaluate(root => {
        const read = e => ({ fill: getComputedStyle(e).backgroundColor, edge: getComputedStyle(e).boxShadow, height: e.getBoundingClientRect().height });
        return ["flat", "bordered"].map(surface => ({
          fields: [...root.querySelector(`#${surface}`).querySelectorAll(".ui-field-box")].map(read),
          card: read(root.querySelector(`#${surface} .ui-card`)),
        }));
      });
      assert.notEqual(styles[0].fields[0].fill, styles[1].fields[0].fill, `${mode} surface fills differ`);
      assert.notEqual(styles[0].fields[0].edge, styles[1].fields[0].edge, `${mode} surface edges differ`);
      for (const group of styles) {
        assert.deepEqual(group.fields[0], group.fields[1], "native and composable inputs agree");
        assert.equal(group.fields[0].height, group.fields[3].height, "select and input sizing agree");
        assert.equal(group.fields[6].edge, styles[0].fields[6].edge, "nested input has no second frame");
      }
      assert.equal(styles[0].fields[7].fill, styles[1].fields[0].fill, "individual override wins");
      assert.equal(styles[1].fields[7].fill, styles[0].fields[0].fill, "reverse override wins");
      assert.equal(styles[0].fields[8].edge, styles[1].fields[8].edge, "validation survives both styles");
      assert.equal(styles[0].fields[0].height, styles[1].fields[0].height, "styles do not shift layout");
      assert.notEqual(styles[0].card.edge, styles[1].card.edge, "card edges follow the scope");
    }
    await page.evaluate(() => { document.documentElement.dataset.mode = "light"; });
    assert.equal(await page.getByRole("link", { name: "Composed link" }).getAttribute("href"), "#destination");
    const tabs = page.getByRole("tablist", { name: "Composed tabs" });
    await tabs.getByRole("tab", { name: "One", exact: true }).focus();
    await page.keyboard.press("ArrowRight");
    await page.getByRole("tabpanel", { name: "Two", exact: true }).waitFor();
    await page.waitForFunction(() => {
      const list = document.querySelector('[aria-label="Composed tabs"]');
      const mark = list.querySelector(".ui-tabs-mark").getBoundingClientRect();
      const tab = list.querySelector('[aria-selected="true"]').getBoundingClientRect();
      return Math.abs(mark.left - tab.left) < 1 && Math.abs(mark.width - tab.width) < 1;
    });
    const check = page.getByRole("checkbox", { name: "Composed check" });
    await check.focus();
    await page.keyboard.press("Space");
    assert.equal(await check.getAttribute("aria-checked"), "false");
    await page.getByRole("radio", { name: "Second choice" }).click();
    assert.equal(await page.getByRole("radio", { name: "Second choice" }).getAttribute("aria-checked"), "true");
    const theme = page.getByRole("button", { name: "Change color theme" });
    assert.equal(await theme.textContent(), "");
    assert.equal(await theme.locator("svg").count(), 1);
    const light = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    await theme.click();
    const menu = page.getByRole("menu");
    assert.ok((await menu.getAttribute("class")).includes("ui-menu"));
    const surface = await menu.evaluate(element => ({ fill: getComputedStyle(element).backgroundColor, shadow: getComputedStyle(element).boxShadow, width: element.getBoundingClientRect().width }));
    assert.notEqual(surface.shadow, "none");
    assert.ok(surface.width >= 160);
    await page.getByRole("menuitemradio", { name: "Dark" }).click();
    await page.waitForFunction(() => document.documentElement.dataset.mode === "dark");
    assert.notEqual(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), light);
    const slider = page.getByRole("slider", { name: "Volume" });
    assert.equal(await slider.count(), 1);
    assert.equal(await page.locator('[data-slot="slider-track"]').evaluate((element) => getComputedStyle(element).height), "4px");
    await slider.focus();
    await page.keyboard.press("ArrowRight");
    await page.waitForFunction(() => document.querySelector("#volume").textContent === "31");
    await page.getByRole("button", { name: "Bold", exact: true }).click();
    assert.equal(await page.getByRole("button", { name: "Bold", exact: true }).getAttribute("aria-pressed"), "true");
    await page.getByRole("button", { name: "Open dialog" }).click();
    await page.getByRole("dialog", { name: "Edit project" }).waitFor();
    await page.keyboard.press("Escape");
    await page.getByRole("dialog", { name: "Edit project" }).waitFor({ state: "hidden" });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: "Open dialog" }).click();
    const mobileDialog = page.getByRole("dialog", { name: "Edit project" });
    await mobileDialog.waitFor();
    const bounds = await mobileDialog.boundingBox();
    assert.ok(bounds.x >= 0 && bounds.width <= 390 && Math.abs(bounds.y + bounds.height - 844) < 1);
    await page.keyboard.press("Escape");
    await mobileDialog.waitFor({ state: "hidden" });
    await page.getByRole("button", { name: "Open drawer" }).click();
    await page.getByRole("dialog", { name: "Project filters" }).waitFor();
    await page.getByRole("button", { name: "Apply filters" }).click();
    await page.getByRole("dialog", { name: "Project filters" }).waitFor({ state: "hidden" });
    const codeInput = page.getByRole("textbox", { name: "One-time code" });
    await codeInput.focus();
    assert.equal(await page.locator(".ui-code-cursor").evaluate(el => getComputedStyle(el).animationName), "none");
    await codeInput.fill("123456");
    assert.equal(await page.locator("#otp").textContent(), "123456");
    await page.evaluate(() => navigator.clipboard.writeText("654321"));
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.press("ControlOrMeta+v");
    await page.waitForFunction(() => document.querySelector("#otp").textContent === "654321");
    const cell = page.locator(".ui-code-cell").first();
    assert.equal(await cell.evaluate(el => getComputedStyle(el).height), "48px");
    await page.getByRole("button", { name: "Disable code", exact: true }).click();
    await page.waitForFunction(() => {
      const edges = [...document.querySelectorAll(".ui-code-cell")].map(el => getComputedStyle(el).boxShadow);
      return new Set(edges).size === 1 && !/\/ 0\)|rgba\(0, 0, 0, 0\)/.test(edges[0]);
    });
    const errorEdges = await page.locator(".ui-code-cell").evaluateAll(cells => cells.map(el => getComputedStyle(el).boxShadow));
    assert.equal(new Set(errorEdges).size, 1, "root validation marks every cell");
    assert.ok(!errorEdges[0].includes("rgba(0, 0, 0, 0)"));
    assert.equal(await codeInput.isDisabled(), true);
    assert.equal(await page.locator(".ui-code").evaluate(el => getComputedStyle(el).opacity), "0.55");
    const viewport = page.locator('[data-slot="scroll-area-viewport"]');
    assert.equal(await viewport.evaluate((element) => element.scrollHeight > element.clientHeight), true);
    await page.waitForFunction(() => document.querySelectorAll('[data-slot="code-block-code"] span[style]').length > 2);
    await page.getByRole("button", { name: "Copy", exact: true }).click();
    await page.getByRole("button", { name: "Copied", exact: true }).waitFor();
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), "const answer = 42;\n");
    assert.equal(await page.evaluate(() => document.fonts.check('16px "Cal Sans UI"')), true);
    assert.deepEqual(errors, []);
  } finally {
    await browser?.close();
    await server.close();
  }
});
