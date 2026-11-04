import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { chromium } from "playwright";
import { createServer } from "vite";
import { CatalogueFixture } from "./catalogue.fixture.mjs";

test("packaged shadcn controls hydrate, respond to keyboard input, and render themed source", { timeout: 60000 }, async () => {
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
    const theme = page.getByRole("button", { name: "Change color theme" });
    assert.equal(await theme.textContent(), "");
    assert.equal(await theme.locator("svg").count(), 1);
    const light = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    await theme.click();
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
    await page.getByRole("button", { name: "Open drawer" }).click();
    await page.getByRole("dialog", { name: "Project filters" }).waitFor();
    await page.getByRole("button", { name: "Apply filters" }).click();
    await page.getByRole("dialog", { name: "Project filters" }).waitFor({ state: "hidden" });
    await page.getByRole("textbox", { name: "One-time code" }).fill("123456");
    assert.equal(await page.locator("#otp").textContent(), "123456");
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
