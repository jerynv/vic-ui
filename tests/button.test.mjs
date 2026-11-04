import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { chromium } from "playwright";
import { createServer } from "vite";
import { Fixture } from "./button.fixture.mjs";

test("buttons and descriptions render on the server and hydrate without changing behavior", { timeout: 45000 }, async () => {
  const html = renderToString(createElement(Fixture));
  assert.match(html, /aria-label="Theme"/);
  assert.match(html, /Choose a file first/);
  assert.match(html, /aria-disabled="true"/);
  const serveFixture = (request, response, next) => {
    if (request.url !== "/") return next();
    response.setHeader("Content-Type", "text/html");
    response.end(`<html><head><link rel="stylesheet" href="/dist/vic-ui.css"></head><body><div id="root">${html}</div><script type="module" src="/tests/hydrate.fixture.mjs"></script></body></html>`);
  };
  const server = await createServer({
    configFile: false,
    server: { host: "127.0.0.1", port: 0 },
    plugins: [{ name: "button-fixture", configureServer: (server) => { server.middlewares.use(serveFixture); } }],
  });
  let browser;
  try {
    await server.listen();
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    page.setDefaultTimeout(10000);
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    await page.goto(server.resolvedUrls.local[0]);
    await page.getByRole("button", { name: "Count", exact: true }).click();
    await page.waitForFunction(() => document.querySelector("#presses").textContent === "1");
    await page.keyboard.press("Enter");
    await page.keyboard.press("Space");
    assert.equal(await page.locator("#presses").textContent(), "3");
    const held = page.getByRole("button", { name: "Held", exact: true });
    await held.focus();
    await page.waitForFunction(() => document.querySelector('[role="tooltip"]')?.matches(":popover-open"));
    await page.keyboard.press("Enter");
    await page.keyboard.press("Space");
    await held.dispatchEvent("click");
    assert.equal(await page.locator("#presses").textContent(), "3");
    assert.equal(await held.evaluate((element) => element.disabled), false);
    assert.equal(await page.getByRole("button", { name: "Disabled", exact: true }).isDisabled(), true);
    assert.equal(await page.getByRole("button", { name: "Saving", exact: true }).isDisabled(), true);
    await page.getByRole("button", { name: "Remove", exact: true }).click();
    assert.equal(await page.locator("#submitted").textContent(), "remove");
    await page.getByRole("button", { name: "Focus count", exact: true }).click();
    assert.equal(await page.evaluate(() => document.activeElement.textContent), "Count");
    const theme = page.getByRole("button", { name: "Theme", exact: true });
    for (let step = 0; step < 3; step++) await page.keyboard.press("Tab");
    assert.equal(await theme.evaluate((element) => element === document.activeElement), true);
    await page.waitForFunction(() => document.querySelector('[role="tooltip"]')?.textContent === "Theme");
    await page.keyboard.press("Escape");
    assert.equal(await page.locator('[role="tooltip"]').count(), 0);
    const id = await theme.getAttribute("aria-describedby");
    assert.equal(await page.locator(`[id="${id}"]`).textContent(), "Theme");
    assert.equal(await page.getByRole("link", { name: "Destination" }).getAttribute("href"), "#destination");
    assert.deepEqual(errors, []);
  } finally {
    await browser?.close();
    await server.close();
  }
});
