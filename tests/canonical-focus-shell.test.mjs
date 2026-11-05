import assert from "node:assert/strict";
import test from "node:test";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";
import { startFixture } from "./canonical-focus-shell.server.mjs";

const screenshots = process.env.CANONICAL_SHELL_SCREENSHOTS;
test("portable focus shell and provider callbacks preserve focus, geometry and host policy", { timeout: 120000 }, async t => {
  const server = await startFixture(); const browser = await chromium.launch({ headless: true });
  try {
    if (screenshots) await mkdir(screenshots, { recursive: true });
    for (const sheet of ["native", "ui"]) for (const theme of ["light", "dark"]) await t.test(`${sheet}/${theme}`, async () => {
      const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" }); page.setDefaultTimeout(6000);
      const errors = []; page.on("pageerror", error => errors.push(error.message));
      const requests = []; page.on("request", request => { if (request.method() !== "GET") requests.push(request.url()); });
      await page.goto(`${server.resolvedUrls.local[0]}?theme=${theme}&sheet=${sheet}`, { waitUntil: "networkidle" });
      assert.equal(await page.title(), "Host document title");
      assert.equal(await page.locator(".ui-focus-side").evaluate(el => getComputedStyle(el).display), "flex");
      assert.equal(await page.locator('.ui-focus-steps [aria-current="step"]').textContent(), "Verify");
      assert.equal(await page.locator(".ui-focus-side canvas").count(), 0, "art belongs to the host; no bundled shader is claimed");
      await page.getByRole("link", { name: "Previous step" }).click();
      assert.equal(await page.getByLabel("Back count").textContent(), "1");
      assert.equal(await page.getByRole("link", { name: "Previous step" }).getAttribute("data-host-link"), "");
      await page.getByRole("button", { name: "Appearance side" }).click();
      assert.equal(await page.getByLabel("Appearance count").textContent(), "1");
      const google = page.getByRole("button", { name: "Continue with Google", exact: true });
      await google.focus(); await page.keyboard.press("Enter");
      assert.equal(await page.getByLabel("Chosen provider").textContent(), "google");
      assert.equal(await page.locator('.ui-provider-button[data-provider="google"] svg path').count(), 4);
      const apple = page.getByRole("button", { name: "Continue with Apple", exact: true });
      const before = await page.locator(".ui-providers-stack").boundingBox();
      await apple.focus(); await page.keyboard.press("Space");
      const confirm = page.getByRole("button", { name: "Confirm locally" });
      await page.waitForFunction(() => document.activeElement?.textContent === "Confirm locally");
      assert.equal(await page.getByRole("button", { name: "Continue with Apple", exact: true }).count(), 0);
      assert.equal(await page.locator(".ui-providers-buttons").evaluate(el => el.inert), true);
      const after = await page.locator(".ui-providers-stack").boundingBox(); assert.ok(Math.abs(before.height - after.height) < 1);
      assert.equal(await page.getByLabel("Confirmed count").textContent(), "0", "no automatic provider policy runs");
      await page.getByRole("button", { name: "Cancel", exact: true }).click();
      await page.waitForFunction(() => document.activeElement?.getAttribute("data-provider") === "apple");
      await apple.click(); await confirm.click(); assert.equal(await page.getByLabel("Confirmed count").textContent(), "1");
      await page.getByRole("button", { name: "Reset notice" }).click();
      await page.waitForFunction(() => document.activeElement?.getAttribute("data-provider") === "apple");
      await page.getByRole("button", { name: "Toggle providers disabled" }).click();
      assert.equal(await google.isDisabled(), true); assert.equal(await apple.isDisabled(), true);
      await google.evaluate(el => el.click()); assert.equal(await page.getByLabel("Chosen provider").textContent(), "apple");
      await page.getByRole("button", { name: "Toggle providers disabled" }).click();
      await apple.click(); await page.getByRole("button", { name: "Toggle providers", exact: true }).click();
      assert.equal(await page.locator(".ui-providers").count(), 0);
      await page.getByRole("button", { name: "Toggle providers", exact: true }).click();
      await page.waitForFunction(() => document.activeElement?.textContent === "Confirm locally");
      await page.getByRole("button", { name: "Cancel", exact: true }).click();
      await page.getByRole("textbox", { name: "Local code" }).fill("12");
      assert.equal(await page.getByTestId("host-art").getAttribute("data-amount"), "0.7");
      await page.getByRole("button", { name: "Submit locally" }).click();
      assert.equal(await page.getByTestId("host-art").getAttribute("data-amount"), "3");
      assert.equal(await page.getByLabel("Submitted count").textContent(), "1");
      assert.equal(await page.locator('.ui-focus-mark[data-logo]').count(), 0, "failed logo keeps the source letter fallback");
      for (const width of [1440, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.waitForFunction(() => document.documentElement.scrollWidth <= innerWidth);
        assert.equal(await page.locator(".ui-focus-side").evaluate(el => getComputedStyle(el).display), width > 896 ? "flex" : "none");
        if (screenshots) await page.screenshot({ path: `${screenshots}/${sheet}-${theme}-${width}.png`, fullPage: true });
      }
      await page.getByRole("button", { name: "Appearance phone" }).click();
      assert.equal(await page.getByLabel("Appearance count").textContent(), "2");
      assert.equal(await page.evaluate(() => localStorage.length), 0);
      assert.deepEqual(requests, []); assert.deepEqual(errors, []); await page.close();
    });
  } finally { await browser.close(); await server.close(); }
});

test("canonical form steps keep reached navigation controlled and animate positions without resizing circles", { timeout: 60000 }, async () => {
  const server = await startFixture(); const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" }); page.setDefaultTimeout(6000);
    await page.goto(server.resolvedUrls.local[0], { waitUntil: "networkidle" });
    const nav = page.getByRole("navigation", { name: "Form steps" });
    const first = nav.getByRole("button", { name: "Step 1: Your name, completed", exact: true });
    const future = nav.getByRole("button", { name: "Step 2.1: Optional details", exact: true });
    assert.equal(await future.getAttribute("aria-disabled"), "true");
    await future.focus(); await page.keyboard.press("Enter"); assert.equal(await page.getByLabel("Current form step").textContent(), "code");
    await first.focus(); await page.keyboard.press("Space"); assert.equal(await page.getByLabel("Current form step").textContent(), "name");
    await page.getByRole("button", { name: "Reach all steps" }).click();
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const finish = nav.getByRole("button", { name: "Step 4: Finish", exact: true });
    const sizes = await nav.locator(".ui-form-step-mark").evaluateAll(els => els.map(el => { const b = el.getBoundingClientRect(); return [b.width, b.height]; }));
    await finish.click(); assert.equal(await page.getByLabel("Current form step").textContent(), "done");
    await page.waitForFunction(() => {
      const label = document.querySelector('.ui-form-steps li[data-current] .ui-form-step-label');
      return label && Number(getComputedStyle(label).opacity) === 1;
    });
    assert.deepEqual(await nav.locator(".ui-form-step-mark").evaluateAll(els => els.map(el => { const b = el.getBoundingClientRect(); return [b.width, b.height]; })), sizes);
    assert.equal(await finish.getAttribute("aria-current"), "step");
    assert.equal(await nav.locator("li[data-complete]").count(), 3);
    await page.getByRole("button", { name: "Toggle steps disabled" }).click();
    const blocked = nav.getByRole("button", { name: "Step 1: Your name, completed", exact: true });
    await blocked.focus(); await page.keyboard.press("Enter"); assert.equal(await page.getByLabel("Current form step").textContent(), "done");
    await page.getByRole("button", { name: "Toggle steps disabled" }).click();
    await page.getByRole("button", { name: "Reset steps" }).click();
    assert.equal(await page.getByLabel("Current form step").textContent(), "name");
    assert.equal(await finish.getAttribute("aria-disabled"), "true");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 320, height: 900 });
    await page.waitForFunction(() => document.documentElement.scrollWidth <= innerWidth);
    assert.equal(await nav.locator(".ui-form-step-mark").first().evaluate(el => getComputedStyle(el).width), "24px");
    assert.equal(await nav.locator(".ui-form-step-mark").first().evaluate(el => getComputedStyle(el).transitionDuration), "0s");
  } finally { await browser.close(); await server.close(); }
});

test("provider notice cancels pending focus on controlled reset and unmount", { timeout: 30000 }, async () => {
  const server = await startFixture(); const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" }); page.setDefaultTimeout(6000);
    await page.goto(`${server.resolvedUrls.local[0]}?sheet=ui&brand`, { waitUntil: "networkidle" });
    assert.equal(await page.getByTestId("host-brand").first().textContent(), "Host brand");
    await page.evaluate(() => {
      const tasks = new Map(); let id = 0;
      window.requestAnimationFrame = callback => { tasks.set(++id, callback); return id; };
      window.cancelAnimationFrame = token => tasks.delete(token);
      window.flushFocusFrame = () => {
        const ready = [...tasks.values()]; tasks.clear(); ready.forEach(callback => callback(performance.now()));
      };
      const originalFocus = HTMLElement.prototype.focus;
      window.providerFocuses = [];
      HTMLElement.prototype.focus = function (...args) {
        if (this.closest(".ui-providers")) window.providerFocuses.push({ text: this.textContent, connected: this.isConnected, inert: Boolean(this.closest("[inert]")) });
        originalFocus.apply(this, args);
      };
    });
    const click = text => page.evaluate(text => [...document.querySelectorAll("button")].find(button => button.textContent === text).click(), text);
    // Exercise cancellation both before the first frame and between the two frames.
    for (const advanceFirstFrame of [false, true]) {
      await click("Continue with Apple");
      await page.waitForFunction(() => document.querySelector(".ui-providers-buttons").inert);
      if (advanceFirstFrame) await page.evaluate(() => window.flushFocusFrame());
      await click("Reset notice");
      await page.waitForFunction(() => !document.querySelector(".ui-providers-buttons").inert);
      await page.evaluate(() => { window.flushFocusFrame(); window.flushFocusFrame(); });
      assert.equal(await page.evaluate(() => window.providerFocuses.some(one => one.text === "Confirm locally")), false);
    }
    await click("Continue with Apple");
    await page.waitForFunction(() => document.querySelector(".ui-providers-buttons").inert);
    await page.evaluate(() => window.flushFocusFrame());
    await click("Toggle provider mount");
    await page.waitForFunction(() => !document.querySelector(".ui-providers"));
    const before = await page.evaluate(() => window.providerFocuses.length);
    await page.evaluate(() => { window.flushFocusFrame(); window.flushFocusFrame(); });
    assert.equal(await page.evaluate(() => window.providerFocuses.length), before);
    assert.equal(await page.evaluate(() => window.providerFocuses.some(one => !one.connected || one.inert)), false);
  } finally { await browser.close(); await server.close(); }
});

test("portable shell imports and renders under Node without app state or browser globals", { timeout: 30000 }, async () => {
  const server = await startFixture();
  try {
    const { createElement: h } = await import("react"); const { renderToStaticMarkup } = await import("react-dom/server");
    const { FocusLayout } = await server.ssrLoadModule("/src/components/Focus.tsx");
    const { ProviderChoice } = await server.ssrLoadModule("/src/components/Providers.tsx");
    const { FormSteps } = await server.ssrLoadModule("/src/components/FormSteps.tsx");
    const html = renderToStaticMarkup(h(FocusLayout, { title: "Portable", brand: "Host brand" }, h(ProviderChoice, { providers: ["google"], verb: "Use", onChoose() {} }), h(FormSteps, { steps: [{ value: "one", label: "One" }], current: "one", reached: new Set(["one"]), onChoose() {} })));
    assert.match(html, /Portable/); assert.match(html, /Use.*Google/); assert.match(html, /aria-current="step"/);
    assert.doesNotMatch(html, /method="post"|\/api\/|localStorage|v-client/);
  } finally { await server.close(); }
});
