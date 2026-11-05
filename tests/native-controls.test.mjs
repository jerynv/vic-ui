import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { chromium } from "playwright";
import { createServer } from "vite";
import { NativeControlsFixture } from "./native-controls.fixture.mjs";

test("restored native controls retain refs, form behavior, disclosure and shared styling", { timeout: 45000 }, async () => {
  const html = renderToString(createElement(NativeControlsFixture));
  const server = await createServer({ configFile: false, cacheDir: "node_modules/.vite-native-controls-test",
    optimizeDeps: { entries: ["tests/native-controls-hydrate.fixture.mjs"] }, server: { host: "127.0.0.1", port: 0 }, plugins: [{
      name: "native-controls-fixture", configureServer(server) { server.middlewares.use((request, response, next) => {
        if (!request.url?.startsWith("/?")) return next();
        const sheet = request.url.includes("composable") ? "ui/styles.css" : "vic-ui.css";
        response.setHeader("Content-Type", "text/html");
        response.end(`<html data-mode="light"><head><link rel="stylesheet" href="/dist/${sheet}"><style>*{transition:none!important}</style></head><body><div id="root">${html}</div><script type="module" src="/tests/native-controls-hydrate.fixture.mjs"></script></body></html>`);
      }); },
    }] });
  let browser;
  try {
    await server.listen(); browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ reducedMotion: "reduce", viewport: { width: 1280, height: 1000 } });
    page.setDefaultTimeout(10000);
    const errors = []; page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    for (const sheet of ["native", "composable"]) {
      await page.goto(`${server.resolvedUrls.local[0]}?${sheet}`, { waitUntil: "networkidle" });
      for (const [name, id] of [["email", "email"], ["notes", "notes"], ["role", "role"], ["radio", "basic"]]) {
        await page.getByRole("button", { name: `Focus ${name}`, exact: true }).click();
        assert.equal(await page.evaluate(() => document.activeElement.id), id, `${name} forwards its ref`);
      }
      await page.getByRole("button", { name: "Submit", exact: true }).click();
      assert.equal(await page.locator("#submitted").textContent(), "", "native validation prevents empty submission");
      assert.equal(await page.evaluate(() => document.activeElement.id), "email");
      await page.getByLabel("Email", { exact: true }).fill("vic@example.com");
      assert.equal(await page.locator("#changed").textContent(), "email:vic@example.com");
      await page.getByLabel("Notes", { exact: true }).fill("Keep the native API.");
      await page.getByLabel("Role", { exact: true }).selectOption("editor");
      assert.equal(await page.locator("#changed").textContent(), "role:editor");
      await page.locator("#basic").focus(); await page.keyboard.press("ArrowRight");
      assert.equal(await page.locator("#advanced").isChecked(), true);
      assert.equal(await page.locator("#basic").isChecked(), false);
      assert.equal(await page.locator("#changed").textContent(), "plan:advanced");
      assert.equal(await page.getByLabel("Unavailable", { exact: true }).isDisabled(), true);
      await page.getByRole("button", { name: "Submit", exact: true }).click();
      assert.deepEqual(JSON.parse(await page.locator("#submitted").textContent()), { email: "vic@example.com", notes: "Keep the native API.", role: "editor", plan: "advanced" });
      const summary = page.locator("#extra > summary");
      await summary.focus(); await page.keyboard.press("Enter");
      assert.equal(await page.locator("#extra").evaluate(el => el.open), true);
      assert.equal(await page.locator("#extra svg").evaluate(el => getComputedStyle(el).transform), "matrix(0, 1, -1, 0, 0, 0)");
      await page.keyboard.press("Space");
      assert.equal(await page.locator("#extra").evaluate(el => el.open), false);
      assert.equal(await page.locator("#placeholder").getAttribute("aria-hidden"), "true");
      assert.ok((await page.locator("#email").getAttribute("class")).includes("consumer-input"));
      for (const mode of ["light", "dark"]) {
        await page.evaluate(mode => { document.documentElement.dataset.mode = mode; }, mode);
        for (const id of ["email", "notes", "role"]) {
          const field = page.locator(`#${id}`);
          assert.notEqual(await field.evaluate(el => getComputedStyle(el).backgroundColor), "rgba(0, 0, 0, 0)");
          assert.equal(await field.evaluate(el => getComputedStyle(el).borderTopLeftRadius), "12px");
        }
        assert.equal(await page.locator("#disabled").evaluate(el => getComputedStyle(el).opacity), "0.55");
        assert.notEqual(await page.locator("#placeholder").evaluate(el => getComputedStyle(el).backgroundColor), "rgba(0, 0, 0, 0)");
        await page.locator("#email").focus();
        assert.equal(await page.locator("#email").evaluate(el => getComputedStyle(el).outlineWidth), "2px");
        await page.locator("#native-form").evaluate(el => el.dataset.uiSurface = "bordered");
        const bordered = await page.locator("#role").evaluate(el => getComputedStyle(el).borderTopColor);
        await page.locator("#native-form").evaluate(el => el.dataset.uiSurface = "flat");
        assert.notEqual(await page.locator("#role").evaluate(el => getComputedStyle(el).borderTopColor), bordered);
      }
    }
    const noScript = await browser.newPage({ javaScriptEnabled: false });
    await noScript.goto(`${server.resolvedUrls.local[0]}?native`);
    await noScript.locator("#extra > summary").click();
    assert.equal(await noScript.locator("#extra").getAttribute("open"), "");
    await noScript.close();
    assert.deepEqual(errors, []);
  } finally { await browser?.close(); await server.close(); }
});
