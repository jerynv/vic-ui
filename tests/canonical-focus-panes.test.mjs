import assert from "node:assert/strict";
import test from "node:test";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";
import { startFixture } from "./canonical-focus-panes.server.mjs";

const screenshots = process.env.CANONICAL_FOCUS_SCREENSHOTS;
async function paste(page, text) {
  await page.evaluate(text => navigator.clipboard.writeText(text), text);
  await page.keyboard.press("ControlOrMeta+V");
}

test("canonical code cells and focus lines retain native input behavior without changing existing OTP", { timeout: 120000 }, async t => {
  const server = await startFixture(); const browser = await chromium.launch({ headless: true });
  try {
    if (screenshots) await mkdir(screenshots, { recursive: true });
    for (const sheet of ["native", "ui"]) for (const theme of ["light", "dark"]) await t.test(`${sheet}/${theme}`, async () => {
      const context = await browser.newContext({ viewport: { width: 900, height: 1000 }, reducedMotion: "reduce", permissions: ["clipboard-read", "clipboard-write"] });
      const page = await context.newPage(); page.setDefaultTimeout(6000);
      const errors = []; page.on("pageerror", error => errors.push(error.message));
      await page.goto(`${server.resolvedUrls.local[0]}?sheet=${sheet}&theme=${theme}`, { waitUntil: "networkidle" });
      const code = page.getByRole("textbox", { name: "Verification code", exact: true });
      assert.ok(await code.evaluate(el => el === document.activeElement));
      assert.equal(await code.getAttribute("autocomplete"), "one-time-code");
      assert.equal(await code.getAttribute("inputmode"), "numeric");
      const cells = page.locator(".ui-code-field-root").first().locator(".ui-code-field-cell");
      assert.equal(await cells.count(), 6);
      await page.keyboard.type("1a2"); assert.equal(await code.inputValue(), "12");
      await page.keyboard.press("ArrowLeft"); await page.keyboard.type("3"); assert.equal(await code.inputValue(), "132");
      await page.keyboard.press("Backspace"); assert.equal(await code.inputValue(), "12");
      await code.selectText(); await paste(page, "12 34-56");
      await page.waitForFunction(() => document.querySelector(".ui-code-field-input").value === "123456");
      assert.equal(await cells.allTextContents().then(v => v.join("")), "123456");
      await code.evaluate(el => el.setSelectionRange(2, 4)); await paste(page, "98");
      await page.waitForFunction(() => document.querySelector(".ui-code-field-input").value === "129856");
      const held = page.getByRole("textbox", { name: "Host controlled code", exact: true });
      await held.fill("987654"); assert.equal(await held.inputValue(), "12");
      assert.equal(await page.getByLabel("Code requests").textContent(), "987654");
      await page.getByRole("button", { name: "Toggle code error" }).click();
      assert.equal(await code.getAttribute("aria-invalid"), "true");
      const errorId = await code.getAttribute("aria-describedby");
      assert.equal(await page.locator(`[id="${errorId}"]`).textContent(), "That code expired");
      assert.equal(await page.getByRole("alert").textContent(), "That code expired");
      await page.getByRole("button", { name: "Toggle code disabled" }).click();
      assert.equal(await code.isDisabled(), true);
      await code.evaluate(el => el.focus()); assert.equal(await code.evaluate(el => el === document.activeElement), false);
      await code.evaluate(el => { const data = new DataTransfer(); data.setData("text", "000000"); el.dispatchEvent(new ClipboardEvent("paste", { bubbles: true, clipboardData: data })); });
      assert.equal(await code.inputValue(), "129856");
      await page.getByRole("button", { name: "Toggle code disabled" }).click();
      await page.getByRole("button", { name: "Toggle code error" }).click();
      await page.getByRole("button", { name: "Clear code" }).click();
      await code.focus(); assert.equal(await page.locator(".ui-code-field-cursor").evaluate(el => getComputedStyle(el).animationName), "none");
      await page.getByRole("button", { name: "Local form action" }).click();
      assert.equal(await page.getByLabel("Submitted").textContent(), "1");
      assert.equal(await page.locator("form.ui-focus-quiet").getAttribute("method"), "post");
      assert.equal(await page.locator("div.ui-focus-quiet").count(), 1);
      const existing = page.getByRole("textbox", { name: "Existing OTP", exact: true });
      await existing.fill("654321"); assert.equal(await existing.inputValue(), "654321");
      assert.equal(await page.locator('[data-testid="old-otp"] .ui-code').evaluate(el => getComputedStyle(el).display), "flex");
      assert.equal(await page.locator('[data-testid="old-otp"] .ui-code-cell').first().evaluate(el => getComputedStyle(el).height), "48px");
      for (const width of [900, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.waitForFunction(() => document.documentElement.scrollWidth <= innerWidth);
        const height = await cells.first().evaluate(el => parseFloat(getComputedStyle(el).height));
        assert.equal(height, width === 320 ? 44 : 48);
        if (screenshots) await page.locator("main").screenshot({ path: `${screenshots}/${sheet}-${theme}-${width}.png` });
      }
      assert.deepEqual(errors, []); await context.close();
    });
  } finally { await browser.close(); await server.close(); }
});

test("canonical panes stay mounted while hidden panes cannot receive focus", { timeout: 30000 }, async () => {
  const server = await startFixture(); const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    await page.goto(server.resolvedUrls.local[0], { waitUntil: "networkidle" });
    const first = page.getByRole("textbox", { name: "First note" });
    await first.fill("Preserved note");
    await page.getByLabel("First scroll").evaluate(el => { el.scrollTop = 180; });
    await first.evaluate(el => { window.preservedPaneInput = el; });
    const secondNode = page.locator('.ui-pane-view[data-value="two"] input');
    assert.equal(await secondNode.evaluate(el => el.closest(".ui-pane-view").inert), true);
    await secondNode.evaluate(el => el.focus()); assert.equal(await secondNode.evaluate(el => el === document.activeElement), false);
    await page.getByRole("button", { name: "Switch pane" }).click();
    assert.equal(await page.getByRole("textbox", { name: "First note" }).count(), 0);
    await page.getByRole("textbox", { name: "Second note" }).fill("Other note");
    await page.getByRole("button", { name: "Switch pane" }).click();
    assert.equal(await first.inputValue(), "Preserved note");
    assert.ok(await first.evaluate(el => el === window.preservedPaneInput));
    assert.equal(await page.getByLabel("First scroll").evaluate(el => el.scrollTop), 180);
    assert.equal(await page.getByLabel("Pane lifecycle").textContent(), "First:mounted;Second:mounted;");
    const style = await page.locator(".ui-pane-views").evaluate(el => ({ animation: getComputedStyle(el).animationName, transform: getComputedStyle(el).transform }));
    assert.deepEqual(style, { animation: "none", transform: "none" });
  } finally { await browser.close(); await server.close(); }
});

test("Grow measures changes, honors reduced motion, and disconnects its observer", { timeout: 30000 }, async () => {
  const server = await startFixture(); const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    await page.addInitScript(() => {
      const Native = window.ResizeObserver;
      window.growObservers = { created: 0, disconnected: 0 };
      window.ResizeObserver = class extends Native {
        tracked = false;
        observe(target, options) { if (target.classList.contains("ui-grow-inner") && !this.tracked) { this.tracked = true; window.growObservers.created++; } return super.observe(target, options); }
        disconnect() { if (this.tracked) { window.growObservers.disconnected++; this.tracked = false; } return super.disconnect(); }
      };
    });
    await page.goto(server.resolvedUrls.local[0], { waitUntil: "networkidle" });
    const grow = page.locator(".ui-grow");
    await page.waitForFunction(() => document.querySelector(".ui-grow").style.height === "60px");
    assert.equal(await grow.evaluate(el => getComputedStyle(el).transitionDuration), "0s");
    // Reduced motion zeroes the motion tokens, so the entrance has no duration rather than no name.
    assert.equal(await page.locator(".ui-grow-inner").evaluate(el => getComputedStyle(el).animationDuration), "0s");
    await page.getByRole("button", { name: "Resize content" }).click();
    await page.waitForFunction(() => document.querySelector(".ui-grow").style.height === "180px");
    await page.getByRole("button", { name: "Replace content" }).click();
    assert.deepEqual(await page.evaluate(() => window.growObservers), { created: 2, disconnected: 1 });
    await page.getByRole("button", { name: "Toggle Grow" }).click();
    assert.deepEqual(await page.evaluate(() => window.growObservers), { created: 2, disconnected: 2 });
    await page.getByRole("button", { name: "Toggle Grow" }).click();
    await page.waitForFunction(() => document.querySelector(".ui-grow").style.height === "180px");
    assert.deepEqual(await page.evaluate(() => window.growObservers), { created: 3, disconnected: 2 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    assert.equal(await grow.evaluate(el => getComputedStyle(el).transitionProperty), "height");
    assert.equal(await grow.evaluate(el => getComputedStyle(el).transitionDuration), "0.3s", "the height eases over --motion-slow");
  } finally { await browser.close(); await server.close(); }
});

test("focus primitives render on the server with distinct native input identifiers", { timeout: 30000 }, async () => {
  const server = await startFixture();
  try {
    const { createElement: h } = await import("react");
    const { renderToStaticMarkup } = await import("react-dom/server");
    const { CodeField } = await server.ssrLoadModule("/src/components/CodeField.tsx");
    const { PaneView, PaneViews } = await server.ssrLoadModule("/src/components/PaneViews.tsx");
    const { Grow } = await server.ssrLoadModule("/src/components/Grow.tsx");
    const html = renderToStaticMarkup(h(Grow, null, h(PaneViews, { active: "one" },
      h(PaneView, { value: "one" }, h(CodeField, { label: "First code", value: "12", onChange() {} })),
      h(PaneView, { value: "two" }, h(CodeField, { label: "Second code", value: "34", onChange() {}, disabled: true })),
    )));
    const ids = [...html.matchAll(/<input id="([^"]+)"/g)].map(match => match[1]);
    assert.equal(ids.length, 2); assert.equal(new Set(ids).size, 2);
    assert.match(html, /data-value="two" hidden="" inert=""/);
    assert.match(html, /autoComplete="one-time-code" disabled=""/);
  } finally { await server.close(); }
});
