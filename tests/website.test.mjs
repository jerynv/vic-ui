import assert from "node:assert/strict";
import test from "node:test";
import { chromium } from "playwright";
import { preview } from "vite";

test("prerendered documentation, search, theme, and mobile navigation", { timeout: 60000 }, async () => {
  const base = process.env.VIC_UI_BASE ?? "/vic-ui/";
  const server = await preview({ configFile: false, root: "website", base, build: { outDir: "build/client" }, preview: { host: "127.0.0.1", port: 0 } });
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    page.setDefaultTimeout(10000);
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    const url = server.resolvedUrls.local[0];
    const response = await page.goto(`${url}docs/slider/`);
    assert.match(await response.text(), /Choose a value or a range/);
    await page.getByRole("slider", { name: "Volume" }).focus();
    await page.keyboard.press("ArrowRight");
    await page.getByText("41%", { exact: true }).waitFor();
    assert.ok(await page.locator("pre span[style]").count() > 3);
    const theme = page.getByRole("button", { name: "Change color theme" });
    assert.equal(await theme.textContent(), "");
    await theme.click();
    await page.getByRole("menuitemradio", { name: "Dark", exact: true }).click();
    await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
    await page.reload();
    await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
    await page.keyboard.press("Meta+k");
    await page.getByRole("combobox", { name: "Search", exact: true }).fill("slider");
    await page.getByRole("option").first().waitFor();
    await page.keyboard.press("Enter");
    await page.getByRole("heading", { name: "Slider", exact: true, level: 1 }).waitFor();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: "Open Sidebar", exact: true }).click();
    await page.getByRole("link", { name: "Getting started", exact: true }).first().click();
    await page.getByRole("heading", { name: "Getting started", exact: true, level: 1 }).waitFor();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
    await new Promise(resolve => server.httpServer.close(resolve));
  }
});
