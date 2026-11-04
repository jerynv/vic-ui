import assert from "node:assert/strict";
import test from "node:test";
import { chromium } from "playwright";
import { preview } from "vite";
import { readFile } from "node:fs/promises";

test("marketing uses working library components and links to the full catalogue", { timeout: 30000 }, async () => {
  const server = await preview({ configFile: false, root: "website", base: "/vic-ui/", build: { outDir: "build/client" }, preview: { host: "127.0.0.1", port: 0 } });
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(server.resolvedUrls.local[0]);
    await page.getByRole("heading", { name: "Good interfaces start here.", level: 1 }).waitFor();
    assert.equal(await page.locator('[aria-label="Component directory"] a').count(), 66);
    await page.getByLabel("Workspace name", { exact: true }).fill("Field Notes");
    await page.getByRole("switch", { name: "Open to your team" }).click();
    await page.getByText("Only people you invite can join.", { exact: true }).waitFor();
    await page.getByRole("button", { name: "Create workspace", exact: true }).click();
    await page.getByRole("button", { name: "Workspace created", exact: true }).waitFor();
    await page.getByRole("textbox", { name: "Find a component" }).fill("slider");
    assert.equal(await page.locator('[aria-label="Component directory"] a').count(), 1);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForFunction(() => document.documentElement.scrollWidth <= innerWidth);
    await page.locator('[aria-label="Component directory"]').getByRole("link", { name: "Slider" }).click();
    await page.getByRole("slider", { name: "Volume" }).waitFor();
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
    await new Promise(resolve => server.httpServer.close(resolve));
  }
});

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
    const response = await page.goto(`${url}docs/components/slider/`);
    assert.match(await response.text(), /Slider/);
    await page.getByRole("slider", { name: "Volume" }).focus();
    await page.keyboard.press("ArrowRight");
    assert.equal(await page.getByRole("slider", { name: "Volume" }).getAttribute("aria-valuenow"), "76");
    await page.getByRole("tab", { name: "Source", exact: true }).click();
    await page.locator("pre span[style]").first().waitFor();
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
    await page.locator("#nd-sidebar-mobile").getByRole("link", { name: "Getting started", exact: true }).click();
    await page.getByRole("heading", { name: "Getting started", exact: true, level: 1 }).waitFor();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
    await new Promise(resolve => server.httpServer.close(resolve));
  }
});

test("every catalogue example renders on desktop and fits a mobile viewport", { timeout: 120000 }, async () => {
  const registry = JSON.parse(await readFile(new URL("../src/ui/registry.json", import.meta.url), "utf8"));
  const server = await preview({ configFile: false, root: "website", base: "/vic-ui/", build: { outDir: "build/client" }, preview: { host: "127.0.0.1", port: 0 } });
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    for (const { id, name } of registry.components) {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto(`${server.resolvedUrls.local[0]}docs/components/${id}/`);
      await page.getByRole("heading", { name, exact: true, level: 1 }).waitFor();
      assert.equal(await page.title(), `${name} · vic/ui`);
      const preview = page.getByRole("tabpanel", { name: "Preview", exact: true });
      await preview.waitFor();
      await preview.locator(":scope > :visible").first().waitFor();
      await page.waitForFunction(() => !document.querySelector('.preview-canvas [data-slot="skeleton"]') || location.pathname.includes("skeleton"));
      assert.ok(await preview.locator("*").count() > 0, id);
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForFunction(() => document.documentElement.scrollWidth <= innerWidth, null, { timeout: 5000 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${id} overflows`);
    }
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
    await new Promise(resolve => server.httpServer.close(resolve));
  }
});

test("the original catalogue retains every component and its source", { timeout: 120000 }, async () => {
  const server = await preview({ configFile: false, root: "website", base: "/vic-ui/", build: { outDir: "build/client" }, preview: { host: "127.0.0.1", port: 0 } });
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(`${server.resolvedUrls.local[0]}docs/compatibility/`);
    const select = page.getByLabel("Original component", { exact: true });
    await select.waitFor();
    const options = await select.locator("option").evaluateAll(options => options.map(option => ({ id: option.value, name: option.textContent })));
    assert.ok(options.length >= 40);
    for (const { id, name } of options) {
      await select.selectOption(id);
      await page.getByRole("heading", { name, exact: true, level: 2 }).waitFor();
      await page.locator(".legacy-preview").first().waitFor();
      assert.ok(await page.locator(".legacy-preview > *").count() > 0, id);
      await page.waitForFunction(() => document.documentElement.scrollWidth <= innerWidth, null, { timeout: 5000 });
    }
    await page.getByRole("tab", { name: "Source", exact: true }).first().click();
    await page.getByRole("tabpanel", { name: "Source", exact: true }).locator("pre span[style]").first().waitFor();
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
    await new Promise(resolve => server.httpServer.close(resolve));
  }
});
