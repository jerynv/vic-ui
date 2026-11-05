import assert from "node:assert/strict";
import test from "node:test";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";
import { startFixture } from "./canonical-data.server.mjs";

test("canonical row actions and roster cells preserve independent activation and responsive columns", { timeout: 90000 }, async t => {
  const server = await startFixture(), browser = await chromium.launch({ headless: true });
  try {
    await mkdir("/tmp/vic-canonical-data-evidence", { recursive: true });
    for (const sheet of ["native", "ui"]) for (const theme of ["light", "dark"]) await t.test(`${sheet}/${theme}`, async () => {
      const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
      page.setDefaultTimeout(6000);
      const errors = []; page.on("pageerror", e => errors.push(e.message));
      await page.goto(`${server.resolvedUrls.local[0]}?sheet=${sheet}&theme=${theme}`, { waitUntil: "networkidle" });
      const create = page.getByRole("button", { name: "Create item" });
      await create.focus(); await page.keyboard.press("Enter");
      assert.equal(await page.getByLabel("Action count").textContent(), "1");
      assert.equal(await page.getByRole("button", { name: "Unavailable person" }).isDisabled(), true);
      await page.keyboard.press("Tab");
      assert.equal(await page.getByRole("button", { name: "Unavailable person" }).evaluate(e => e === document.activeElement), false);
      const table = page.getByRole("table", { name: "People", exact: true });
      const cell = table.getByRole("button", { name: "Ada", exact: true });
      await cell.click();
      assert.equal(await page.getByLabel("Cell count").textContent(), "1");
      assert.equal(await page.getByLabel("Row count").textContent(), "0");
      await cell.focus(); await page.keyboard.press("Enter");
      assert.equal(await page.getByLabel("Cell count").textContent(), "2");
      assert.equal(await page.getByLabel("Row count").textContent(), "0");
      await table.getByRole("row").nth(1).focus(); await page.keyboard.press("Enter");
      assert.equal(await page.getByLabel("Row count").textContent(), "1");
      await table.getByRole("button", { name: "Name", exact: true }).click();
      assert.equal(await table.getByRole("columnheader", { name: "Name" }).getAttribute("aria-sort"), "descending");
      assert.equal(await table.locator("tbody tr").evaluate(e => Math.round(e.getBoundingClientRect().height)), 40);
      assert.equal(await table.getByRole("columnheader", { name: "Place" }).isVisible(), true);
      await page.screenshot({ path: `/tmp/vic-canonical-data-evidence/${sheet}-${theme}.png`, fullPage: true });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForFunction(() => getComputedStyle(document.querySelector('th[data-wide]')).display === "none");
      assert.equal(await table.getByRole("columnheader", { name: "Place" }).count(), 0);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert.deepEqual(errors, []); await page.close();
    });
  } finally { await browser.close(); await server.close(); }
});

test("fit-aware table scrollers are named only when needed and release resize observers", { timeout: 30000 }, async () => {
  const server = await startFixture(), browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
    await page.addInitScript(() => {
      const Native = window.ResizeObserver, active = new Map();
      window.ResizeObserver = class extends Native {
        observe(target, options) { const set = active.get(this) ?? new Set(); set.add(target); active.set(this, set); return super.observe(target, options); }
        unobserve(target) { active.get(this)?.delete(target); return super.unobserve(target); }
        disconnect() { active.delete(this); return super.disconnect(); }
      };
      window.tableObserverCount = () => [...active.values()].filter(set => [...set].some(e => e.matches(".ui-table-scroll"))).length;
    });
    await page.goto(server.resolvedUrls.local[0], { waitUntil: "networkidle" });
    const region = page.getByRole("region", { name: "Wide values" });
    await region.waitFor(); assert.equal(await region.getAttribute("tabindex"), "0");
    assert.equal(await page.evaluate(() => window.tableObserverCount()), 2);
    await region.focus(); await page.keyboard.press("ArrowRight");
    await page.waitForFunction(() => document.querySelector(".fit-container .ui-table-scroll").scrollLeft > 0);
    await page.getByRole("button", { name: "Resize container" }).click();
    await page.waitForFunction(() => !document.querySelector(".fit-container .ui-table-scroll").hasAttribute("tabindex"));
    assert.equal(await region.count(), 0);
    assert.equal(await page.locator(".fit-container .ui-table-scroll").evaluate(e => getComputedStyle(e).overflowX), "visible");
    await page.getByRole("button", { name: "Toggle height" }).click();
    await region.waitFor(); assert.equal(await region.getAttribute("tabindex"), "0");
    await page.getByRole("button", { name: "Toggle table" }).click();
    await page.waitForFunction(() => window.tableObserverCount() === 1);
    await page.getByRole("button", { name: "Toggle table" }).click();
    await page.waitForFunction(() => window.tableObserverCount() === 2);
  } finally { await browser.close(); await server.close(); }
});
