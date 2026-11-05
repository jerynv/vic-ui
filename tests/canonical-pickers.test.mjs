import assert from "node:assert/strict";
import test from "node:test";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";
import { startFixture } from "./canonical-pickers.server.mjs";

test("canonical picker options and nested right sheets preserve controlled behavior", { timeout: 90000 }, async t => {
  const server = await startFixture(), browser = await chromium.launch({ headless: true });
  try {
    await mkdir("/tmp/vic-canonical-pickers-evidence", { recursive: true });
    for (const sheet of ["native", "ui"]) for (const theme of ["light", "dark"]) await t.test(`${sheet}/${theme}`, async () => {
      const page = await browser.newPage({ viewport: { width: 1280, height: 1000 }, reducedMotion: "reduce" });
      page.setDefaultTimeout(6000);
      const errors = []; page.on("pageerror", e => errors.push(e.message));
      await page.goto(`${server.resolvedUrls.local[0]}?sheet=${sheet}&theme=${theme}`, { waitUntil: "networkidle" });
      const select = page.getByRole("combobox", { name: "Reserved choice" });
      const before = await select.boundingBox();
      assert.equal(Math.round(before.height), 24);
      assert.equal(await select.locator("../..").getAttribute("data-ui-surface"), "bordered");
      await select.press("ArrowDown"); await select.press("End"); await select.press("Enter");
      assert.equal((await select.boundingBox()).width, before.width);
      assert.equal(await page.locator('[name="choice"]').inputValue(), "long");
      await select.click();
      const list = page.getByRole("listbox", { name: "Reserved choice" });
      assert.ok((await list.getAttribute("class")).includes("ui-menu-xs"));
      assert.equal(Math.round((await list.getByRole("option").first().boundingBox()).height), 28);
      await select.press("Escape");
      const date = page.getByRole("button", { name: "Due date", exact: true });
      assert.equal(Math.round((await date.boundingBox()).height), 24);
      await date.click();
      const calendar = page.getByRole("dialog", { name: "Choose a date, February 2031" });
      assert.equal(await page.locator('[data-day="2031-02-03"]').evaluate(e => document.activeElement === e), true);
      assert.equal(await page.locator('[data-day="2031-02-03"]').getAttribute("aria-current"), "date");
      await page.keyboard.press("Shift+Tab");
      const none = calendar.getByRole("button", { name: "No due date", exact: true });
      assert.equal(await none.evaluate(e => document.activeElement === e), true);
      assert.equal(await none.getAttribute("aria-pressed"), "true");
      await page.keyboard.press("Tab"); await page.keyboard.press("ArrowRight"); await page.keyboard.press("Enter");
      assert.equal(await page.locator('[name="day"]').inputValue(), "2031-02-04");
      assert.equal(await date.evaluate(e => document.activeElement === e), true);
      await date.click(); await page.getByRole("button", { name: "No due date", exact: true }).click();
      assert.equal(await page.locator('[name="day"]').inputValue(), "");
      for (const [role, name, reason, hint] of [["combobox", "Held choice", "Choice is unavailable.", "Choice hint"], ["button", "Held date", "Date is unavailable.", "Date hint"]]) {
        const control = page.getByRole(role, { name, exact: true });
        await control.focus(); await control.press("ArrowDown");
        assert.equal(await control.getAttribute("aria-expanded"), "false");
        const described = await control.evaluate(e => e.getAttribute("aria-describedby").split(/\s+/).map(id => document.getElementById(id)?.textContent).join(" "));
        assert.ok(described.includes(reason) && described.includes(hint) && described.includes("External instructions."));
      }
      await page.getByRole("button", { name: "Changing date", exact: true }).click();
      await page.evaluate(() => window.disablePickers());
      await page.getByRole("dialog", { name: "Choose a date, February 2031" }).waitFor({ state: "detached" });
      assert.equal(await page.getByRole("button", { name: "Changing date", exact: true }).evaluate(e => document.activeElement === e), true);
      await page.screenshot({ path: `/tmp/vic-canonical-pickers-evidence/${sheet}-${theme}.png`, fullPage: true });
      await page.getByRole("button", { name: "Open side sheet", exact: true }).click();
      const outer = page.getByRole("dialog", { name: "Side sheet", exact: true });
      let box = await outer.boundingBox();
      assert.equal(Math.round(box.x + box.width), 1280); assert.equal(Math.round(box.height), 1000);
      await page.getByRole("button", { name: "Open nested dialog", exact: true }).click();
      await page.keyboard.press("Escape");
      await page.getByRole("dialog", { name: "Nested dialog", exact: true }).waitFor({ state: "hidden" });
      assert.equal(await outer.isVisible(), true);
      assert.equal(await page.getByRole("button", { name: "Open nested dialog", exact: true }).evaluate(e => document.activeElement === e), true);
      await page.setViewportSize({ width: 390, height: 844 });
      box = await outer.boundingBox();
      await page.waitForFunction(() => Math.round(document.querySelector(".ui-dialog-side-right").getBoundingClientRect().width) === 390);
      box = await outer.boundingBox();
      assert.equal(Math.round(box.width), 390); assert.equal(Math.round(box.height), 844);
      await page.screenshot({ path: `/tmp/vic-canonical-pickers-evidence/${sheet}-${theme}-mobile-sheet.png` });
      await page.keyboard.press("Escape"); await outer.waitFor({ state: "hidden" });
      assert.equal(await page.getByRole("button", { name: "Open side sheet", exact: true }).evaluate(e => document.activeElement === e), true);
      assert.deepEqual(errors, []); await page.close();
    });
  } finally { await browser.close(); await server.close(); }
});
