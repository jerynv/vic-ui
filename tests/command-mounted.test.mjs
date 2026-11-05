import assert from "node:assert/strict";
import test from "node:test";
import { chromium } from "playwright";
import react from "@vitejs/plugin-react";
import { createServer } from "vite";
import { resolve } from "node:path";

test("mounted CommandInput points at the initially selected CommandItem", { timeout: 45000 }, async () => {
  const server = await createServer({
    configFile: false,
    root: process.cwd(),
    resolve: { alias: { "@": resolve(process.cwd(), "src") } },
    server: { host: "127.0.0.1", port: 0 },
    plugins: [react()],
  });
  let browser;
  try {
    await server.listen();
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(`${server.resolvedUrls.local[0]}tests/command-mounted.html`);
    const input = page.locator("[data-slot=command-input]");
    await input.waitFor();
    await page.waitForFunction(() => document.body.dataset.mountActive !== undefined);
    const association = await page.evaluate(() => ({
      mountActive: document.body.dataset.mountActive,
      mountInputId: document.body.dataset.mountInputId,
      itemId: document.body.dataset.itemId,
      active: document.querySelector("[data-slot=command-input]").getAttribute("aria-activedescendant"),
    }));
    assert.equal(association.mountActive, association.itemId);
    assert.equal(association.active, association.itemId);
    await input.press("ArrowDown");
    await page.waitForFunction(() => document.body.dataset.changedValue === "second");
    assert.deepEqual(errors, []);
  } finally { await browser?.close(); await server.close(); }
});
