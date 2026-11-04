import assert from "node:assert/strict";
import test from "node:test";
import { chromium } from "playwright";
import { preview } from "vite";
import { readFile } from "node:fs/promises";
import { PIECES } from "../site/src/registry.ts";

const base = process.env.VIC_UI_BASE ?? "/vic-ui/";

test("marketing uses working library components and links to the full catalogue", { timeout: 30000 }, async () => {
  const server = await preview({ configFile: false, root: "website", base, build: { outDir: "build/client" }, preview: { host: "127.0.0.1", port: 0 } });
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(server.resolvedUrls.local[0]);
    await page.getByRole("heading", { name: "Good interfaces start here.", level: 1 }).waitFor();
    assert.equal(await page.locator('[aria-label="Component directory"] a').count(), 91);
    await page.getByLabel("Workspace name", { exact: true }).fill("Field Notes");
    await page.getByRole("switch", { name: "Open to your team" }).click();
    await page.getByText("Only people you invite can join.", { exact: true }).waitFor();
    await page.getByRole("button", { name: "Create workspace", exact: true }).click();
    await page.getByRole("button", { name: "Workspace created", exact: true }).waitFor();
    assert.equal(await page.locator(".workspace-preview .ui-org-mark").textContent(), "F");
    await page.getByText("Personal", { exact: true }).click();
    assert.equal(await page.getByRole("radio", { name: "Personal", exact: false }).isChecked(), true);
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
  const server = await preview({ configFile: false, root: "website", base, build: { outDir: "build/client" }, preview: { host: "127.0.0.1", port: 0 } });
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
      const compound = page.getByRole("button", { name: "Composable API", exact: true });
      if (await compound.count()) await compound.click();
      const preview = page.locator(".preview-canvas");
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

test("every vic component has a primary page with its examples and source", { timeout: 120000 }, async () => {
  const server = await preview({ configFile: false, root: "website", base, build: { outDir: "build/client" }, preview: { host: "127.0.0.1", port: 0 } });
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    for (const { id } of PIECES) {
      await page.goto(`${server.resolvedUrls.local[0]}docs/components/${id}/`, { waitUntil: "networkidle" });
      await page.locator(".vic-preview > *").first().waitFor();
      assert.ok(await page.locator(".vic-preview > *").count() > 0, id);
      assert.equal(await page.getByRole("link", { name: "Props and component source", exact: true }).count(), 1);
      if (id === "button") {
        assert.ok(await page.locator('.vic-preview .ui-button-face').count() > 8);
        assert.equal(await page.locator('.vic-preview [aria-busy="true"]').count(), 3);
        await page.getByRole("button", { name: "Stop the wait", exact: true }).click();
        await page.getByRole("button", { name: "Start the wait", exact: true }).waitFor();
        assert.equal(await page.locator('.vic-preview [aria-busy="true"]').count(), 0);
      }
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

test("owned icons render their source strokes and copy a usable import", { timeout: 30000 }, async () => {
  const server = await preview({ configFile: false, root: "website", base, build: { outDir: "build/client" }, preview: { host: "127.0.0.1", port: 0 } });
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ permissions: ["clipboard-read", "clipboard-write"] });
    await page.goto(`${server.resolvedUrls.local[0]}docs/icons/`);
    await page.getByLabel("Find an icon", { exact: true }).fill("iconmcp");
    await page.getByRole("status").filter({ hasText: /^4 icons$/ }).waitFor();
    const catalogue = page.getByLabel("Icon catalogue", { exact: true });
    assert.equal(await catalogue.locator(":scope > div").count(), 4);
    assert.equal(await catalogue.locator("svg").first().getAttribute("viewBox"), "0 0 16 16");
    assert.equal(await catalogue.locator("svg g[stroke-width]").first().getAttribute("stroke-width"), "1.333");
    await page.getByRole("button", { name: "Copy ArchiveIcon import", exact: true }).click();
    await page.getByRole("status").filter({ hasText: "Copied ArchiveIcon" }).waitFor();
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 'import { ArchiveIcon } from "vic-ui/icons";');
    assert.equal(await page.locator("svg.lucide").count(), 0);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForFunction(() => document.documentElement.scrollWidth <= innerWidth);
  } finally {
    await browser.close();
    await new Promise(resolve => server.httpServer.close(resolve));
  }
});

test("card spacing, composable disclosure, and file-row actions", { timeout: 30000 }, async () => {
  const server = await preview({ configFile: false, root: "website", base, build: { outDir: "build/client" }, preview: { host: "127.0.0.1", port: 0 } });
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const url = server.resolvedUrls.local[0];
    await page.goto(`${url}docs/components/card/`, { waitUntil: "networkidle" });
    const flushHeader = page.locator('.ui-card-head:has(+ .ui-card-flush)');
    assert.equal(await flushHeader.evaluate(el => getComputedStyle(el).paddingBottom), "16px");
    const field = page.getByRole("textbox", { name: "First name", exact: true });
    const flatFill = await field.evaluate(el => getComputedStyle(el.parentElement).backgroundColor);
    await page.getByRole("combobox", { name: "Preview surface", exact: true }).click();
    await page.getByRole("option", { name: "Bordered", exact: true }).click();
    assert.notEqual(await field.evaluate(el => getComputedStyle(el.parentElement).backgroundColor), flatFill);
    assert.equal(await page.locator("main details").count(), 0);
    const disclosure = page.getByRole("button", { name: "Composable API", exact: true });
    await disclosure.focus();
    await page.keyboard.press("Enter");
    assert.equal(await disclosure.getAttribute("aria-expanded"), "true");
    await page.getByPlaceholder("Enter your password").fill("demo-password");
    const action = page.getByRole("button", { name: "Sign up", exact: true });
    assert.ok(await action.evaluate(el => el.classList.contains("ui-button-line")));
    await page.goto(`${url}docs/components/list/`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Save Project brief", exact: true }).click();
    await page.getByRole("region", { name: "Saved files", exact: true }).getByText("Project brief", { exact: true }).waitFor();
    await page.getByRole("button", { name: "Unsave Project brief", exact: true }).click();
    await page.getByText("Save a file to keep it here.", { exact: true }).waitFor();
    await page.setViewportSize({ width: 390, height: 844 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  } finally { await browser.close(); await new Promise(resolve => server.httpServer.close(resolve)); }
});
