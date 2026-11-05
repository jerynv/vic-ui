import assert from "node:assert/strict";
import test from "node:test";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";
import { startFixture } from "./canonical-panels.server.mjs";

test("canonical panels retain labels, host links, native appearance choice and actions", { timeout: 120000 }, async t => {
  const server = await startFixture(); const browser = await chromium.launch({ headless: true });
  try {
    await mkdir("/tmp/vic-canonical-panels", { recursive: true });
    for (const sheet of ["native", "ui"]) for (const theme of ["light", "dark"]) await t.test(`${sheet}/${theme}`, async () => {
      const page = await browser.newPage({ viewport: { width: 1280, height: 1000 }, reducedMotion: "reduce" }); const errors = []; page.on("pageerror", e => errors.push(e.message)); page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
      await page.goto(`${server.resolvedUrls.local[0]}?sheet=${sheet}&theme=${theme}`, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const facts = page.locator('dl[aria-label="Workspace facts"]'); assert.equal(await facts.locator("dt").count(), 3); assert.equal(await facts.locator("dd").count(), 3);
      assert.equal(await page.getByRole("link", { name: "Open workspace" }).getAttribute("href"), "#host/workspace");
      assert.equal(await page.getByRole("link", { name: "Open settings", exact: true }).getAttribute("href"), "#host/workspace");
      const row = facts.locator(".ui-panel-field").first(); const before = await row.boundingBox();
      await page.getByRole("button", { name: "Toggle field error" }).click();
      assert.equal(await page.getByRole("alert").count(), 3);
      assert.equal(await page.getByRole("textbox", { name: "Workspace notes" }).getAttribute("aria-invalid"), "true"); assert.ok(Math.abs((await row.boundingBox()).height - before.height) <= 1);
      await page.getByRole("textbox", { name: "Workspace notes" }).fill("Updated notes"); await page.getByRole("textbox", { name: "Workspace notes" }).press("Tab");
      assert.equal(await page.getByLabel("Blur commits", { exact: true }).textContent(), "1");
      const mode = page.getByRole("radiogroup", { name: "Appearance" }); await mode.getByRole("radio", { name: "Match this device" }).focus();
      await page.keyboard.press("ArrowRight"); assert.equal(await page.getByLabel("Appearance value", { exact: true }).textContent(), "light");
      await page.keyboard.press("ArrowRight"); assert.equal(await mode.getByRole("radio", { name: "Dark", exact: true }).isChecked(), true);
      await page.getByRole("button", { name: "Archive item" }).click(); await page.getByRole("button", { name: "Remove workspace" }).click();
      assert.equal(await page.getByLabel("Action count", { exact: true }).textContent(), "2"); assert.equal(await page.getByRole("button", { name: "Unavailable action" }).isDisabled(), true);
      assert.equal(await page.getByRole("button", { name: "Unavailable action" }).evaluate(el => getComputedStyle(el).opacity), "0.55");
      const blockedLink = page.getByRole("link", { name: "Unavailable link" });
      assert.equal(await blockedLink.getAttribute("aria-disabled"), "true");
      assert.equal(await blockedLink.getAttribute("tabindex"), "-1");
      await blockedLink.evaluate(el => el.click()); assert.equal(await page.evaluate(() => location.hash), "");
      await blockedLink.focus(); await page.keyboard.press("Enter"); assert.equal(await page.evaluate(() => location.hash), "");
      assert.equal(await page.getByRole("heading", { name: "Existing generic heading" }).getAttribute("id"), "existing-heading");
      await page.screenshot({ path: `/tmp/vic-canonical-panels/${sheet}-${theme}-desktop.png`, fullPage: true });
      for (const width of [390, 320]) { await page.setViewportSize({ width, height: 844 }); await page.waitForFunction(() => document.documentElement.scrollWidth <= innerWidth); }
      await page.screenshot({ path: `/tmp/vic-canonical-panels/${sheet}-${theme}-mobile.png`, fullPage: true });
      assert.deepEqual(errors, []); await page.close();
    });
  } finally { await browser.close(); await server.close(); }
});

test("canonical settings dialog preserves host state, guarded submit, pane identity and cleanup", { timeout: 90000 }, async t => {
  const server = await startFixture(); const browser = await chromium.launch({ headless: true });
  try {
    for (const sheet of ["native", "ui"]) await t.test(sheet, async () => {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" }); const errors = []; page.on("pageerror", e => errors.push(e.message)); page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    await page.addInitScript(() => {
      window.observers = { active: 0, disconnected: 0 };
      const Original = window.ResizeObserver;
      window.ResizeObserver = class extends Original { constructor(callback) { super(callback); window.observers.active++; } disconnect() { window.observers.active--; window.observers.disconnected++; super.disconnect(); } };
    });
    await page.goto(`${server.resolvedUrls.local[0]}?sheet=${sheet}`, { waitUntil: "networkidle" }); const initial = await page.evaluate(() => window.observers.active);
    const opener = page.getByRole("button", { name: "Open object settings" }); await opener.click();
    const dialog = page.getByRole("dialog", { name: "Field notes settings" }); await dialog.waitFor();
    const detailsId = await dialog.getByRole("button", { name: "Details", exact: true }).getAttribute("aria-controls");
    assert.ok(detailsId.includes("%20") && !/\s/.test(detailsId));
    assert.ok(await page.evaluate(id => !!document.getElementById(id), detailsId));
    const save = dialog.getByRole("button", { name: "Save changes", exact: true }); assert.equal(await save.getAttribute("aria-disabled"), "true");
    await dialog.locator("form").dispatchEvent("submit"); assert.equal(await page.getByLabel("Save count", { exact: true }).textContent(), "0");
    await dialog.getByRole("textbox", { name: "Workspace title" }).fill("New workspace name");
    await page.waitForFunction(() => document.querySelector('.ui-settings-dialog-changes')?.textContent === '1 change');
    await save.click(); assert.equal(await page.getByLabel("Save count", { exact: true }).textContent(), "1");
    await dialog.getByRole("checkbox", { name: "Disable saving" }).check(); await dialog.locator("form").dispatchEvent("submit"); assert.equal(await page.getByLabel("Save count", { exact: true }).textContent(), "1");
    await dialog.getByRole("checkbox", { name: "Disable saving" }).uncheck();
    await dialog.getByRole("checkbox", { name: "Hold selected section" }).check(); await dialog.getByRole("button", { name: "Details", exact: true }).click();
    assert.equal(await dialog.getByRole("button", { name: /General/ }).getAttribute("aria-current"), "true");
    await dialog.getByRole("checkbox", { name: "Hold selected section" }).uncheck();
    await dialog.getByRole("checkbox", { name: "Show host refusal" }).check(); assert.equal(await dialog.locator(".ui-settings-dialog-changes").textContent(), "The host could not save. Try again.");
    await dialog.getByRole("button", { name: "Details", exact: true }).click();
    const note = dialog.getByRole("textbox", { name: "Persistent note" }); await note.fill("Still here"); await note.evaluate(el => { el.dataset.identity = "retained"; });
    await page.waitForFunction(() => document.querySelector('.ui-settings-dialog-room')?.hasAttribute('data-scrolls'));
    await dialog.getByRole("button", { name: /General/ }).click();
    const hidden = dialog.locator('.ui-settings-dialog-pane[data-away]'); assert.equal(await hidden.evaluate(el => el.inert), true);
    await page.keyboard.press("Tab");
    assert.ok(await page.evaluate(() => !document.activeElement?.closest("[inert]")));
    await hidden.waitFor({ state: "hidden" });
    assert.equal(await dialog.getByRole("textbox", { name: "Persistent note" }).count(), 0);
    await dialog.getByRole("button", { name: "Details", exact: true }).click(); assert.equal(await note.inputValue(), "Still here"); assert.equal(await note.getAttribute("data-identity"), "retained");
    await dialog.screenshot({ path: `/tmp/vic-canonical-panels/dialog-${sheet}-light-desktop.png` });
    await page.setViewportSize({ width: 390, height: 844 }); await page.evaluate(() => document.documentElement.dataset.mode = "dark");
    await dialog.screenshot({ path: `/tmp/vic-canonical-panels/dialog-${sheet}-dark-mobile.png` });
    assert.ok(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth));
    await save.focus(); await page.keyboard.press("Tab");
    // Native dialogs permit browser-chrome focus at the boundary, never background controls.
    assert.ok(await page.evaluate(() => !document.hasFocus() || !!document.activeElement?.closest(".ui-settings-dialog")));
    await dialog.getByRole("button", { name: /General/ }).focus();
    await page.keyboard.press("Escape"); await dialog.waitFor({ state: "hidden" });
    assert.ok(await opener.evaluate(el => el === document.activeElement));
    assert.equal(await page.evaluate(() => window.observers.active), initial); assert.ok(await page.evaluate(() => window.observers.disconnected) > 0);
    assert.deepEqual(errors, []); await page.close();
    });
  } finally { await browser.close(); await server.close(); }
});
