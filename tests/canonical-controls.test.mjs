import assert from "node:assert/strict";
import test from "node:test";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";
import { startFixture } from "./canonical-controls.server.mjs";

test("canonical compact options retain defaults, descriptions and native field semantics", { timeout: 90000 }, async t => {
  const server = await startFixture(), browser = await chromium.launch({ headless: true });
  try {
    await mkdir("/tmp/vic-canonical-controls-evidence", { recursive: true });
    for (const sheet of ["native", "ui"]) for (const theme of ["light", "dark"]) await t.test(`${sheet}/${theme}`, async () => {
      const page = await browser.newPage({ viewport: { width: 1280, height: 1000 }, reducedMotion: "reduce" });
      page.setDefaultTimeout(6000);
      const errors = []; page.on("pageerror", e => errors.push(e.message));
      await page.goto(`${server.resolvedUrls.local[0]}?sheet=${sheet}&theme=${theme}`, { waitUntil: "networkidle" });
      const normal = page.getByRole("button", { name: "Default action" });
      assert.ok((await normal.getAttribute("class")).includes("ui-button-ink"));
      assert.equal(Math.round((await normal.boundingBox()).height), 32);
      for (const name of ["Compact action", "Glass action", "Round glass"]) assert.equal(Math.round((await page.getByRole("button", { name, exact: true }).boundingBox()).height), 24);
      const glass = page.getByRole("button", { name: "Glass action", exact: true });
      assert.equal(await glass.evaluate(e => getComputedStyle(e).backdropFilter), "blur(16px)");
      const round = page.getByRole("button", { name: "Round glass" });
      const radii = await round.evaluate(e => {
        const outer = getComputedStyle(e), inner = getComputedStyle(e.querySelector(".ui-button-face"));
        return [parseFloat(outer.borderTopLeftRadius), parseFloat(inner.borderTopLeftRadius), parseFloat(outer.borderTopWidth) + parseFloat(outer.paddingTop)];
      });
      assert.equal(radii[1], radii[0] - radii[2]);
      for (const [role, name, reason, hint] of [
        ["button", "Held action", "An owner must enable this action.", null],
        ["switch", "Held switch", "An owner must enable this switch.", null],
        ["button", "Held chip", "An owner must enable this choice.", null],
        ["checkbox", "Held checkbox", "An owner must enable this checkbox.", null],
        ["textbox", "Held text", "Text is read only.", "Text hint"],
        ["textbox", "Held number", "Number is read only.", "Number hint"],
        ["searchbox", "Held search", "Search is read only.", "Search hint"],
      ]) {
        const control = page.getByRole(role, { name, exact: true });
        await control.focus(); await page.locator(".ui-tooltip:visible").filter({ hasText: reason }).waitFor();
        const description = await control.evaluate(e => (e.getAttribute("aria-describedby") ?? "").split(/\s+/).map(id => document.getElementById(id)?.textContent ?? "").join(" "));
        assert.ok(description.includes("External instructions remain available."), name);
        assert.ok(description.includes(reason), name);
        if (hint) assert.ok(description.includes(hint), name);
        assert.equal(await control.getAttribute("aria-disabled"), "true");
      }
      const limited = page.getByRole("textbox", { name: "Limited words", exact: true });
      const field = limited.locator("..").locator("..");
      await limited.fill("12345678");
      assert.equal(await field.locator('[aria-live="polite"]').textContent(), "");
      assert.equal(await field.locator(".ui-field-count").textContent(), "8 of 10");
      await limited.fill("123456789");
      assert.equal(await field.locator('[aria-live="polite"]').textContent(), "9 of 10");
      assert.ok((await limited.getAttribute("aria-describedby")).includes("external"));
      const hidden = page.getByRole("textbox", { name: "Hidden count", exact: true });
      assert.equal(await hidden.getAttribute("maxlength"), "10");
      assert.equal(await hidden.locator("..").locator("..").locator(".ui-field-count, [aria-live]").count(), 0);
      assert.equal(await page.getByRole("textbox", { name: "Supplied invalid state" }).getAttribute("aria-invalid"), "true");
      assert.equal(await page.getByRole("link", { name: "Current destination" }).getAttribute("aria-current"), "page");
      assert.equal(await page.getByRole("link", { name: "Current step" }).getAttribute("aria-current"), "step");
      await page.screenshot({ path: `/tmp/vic-canonical-controls-evidence/${sheet}-${theme}.png`, fullPage: true });
      assert.deepEqual(errors, []); await page.close();
    });
  } finally { await browser.close(); await server.close(); }
});
