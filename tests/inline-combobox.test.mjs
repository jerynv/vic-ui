import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { chromium } from "playwright";
import { createServer } from "vite";
import { InlineComboboxFixture, fixtureCSS } from "./inline-combobox.fixture.mjs";

const state = async region => JSON.parse(await region.locator(".fixture-state").textContent());
async function visibleActive(input) {
  assert.ok(await input.evaluate(node => {
    const option = document.getElementById(node.getAttribute("aria-activedescendant"));
    const list = option?.closest('[role="listbox"]');
    if (!option || !list) return false;
    const row = option.getBoundingClientRect(), frame = list.getBoundingClientRect();
    return row.top >= frame.top - 1 && row.bottom <= frame.bottom + 1;
  }), "active option is visible inside its own list");
}
async function active(input, expected) {
  const current = await input.evaluate(node => {
    const id = node.getAttribute("aria-activedescendant");
    const option = id && document.getElementById(id);
    return { id, text: option?.textContent, role: option?.getAttribute("role"), disabled: option?.getAttribute("aria-disabled"), focused: document.activeElement === node };
  });
  assert.ok(current.id, "active descendant is present");
  assert.equal(current.role, "option");
  assert.notEqual(current.disabled, "true");
  assert.equal(current.text, expected);
  assert.equal(current.focused, true, "navigation keeps focus on search");
}

// Exercise the built public entry point, not an alternate implementation of the controller.
test("inline combobox composes provider rail and footer with controlled, accessible keyboard and pointer behavior", { timeout: 60000 }, async () => {
  const html = renderToString(createElement(InlineComboboxFixture));
  assert.ok(html.includes("Search models"));
  const server = await createServer({ configFile: false, cacheDir: "node_modules/.vite-inline-combobox-test",
    optimizeDeps: { entries: ["tests/inline-combobox-hydrate.fixture.mjs"] }, server: { host: "127.0.0.1", port: 0 }, plugins: [{
      name: "inline-combobox-fixture", configureServer(server) { server.middlewares.use((request, response, next) => {
        if (!request.url?.startsWith("/?")) return next();
        const sheet = request.url.includes("composable") ? "ui/styles.css" : "vic-ui.css";
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(`<html><head><link rel="stylesheet" href="/dist/${sheet}"><style>${fixtureCSS}</style></head><body><div id="root">${html}</div><script type="module" src="/tests/inline-combobox-hydrate.fixture.mjs"></script></body></html>`);
      }); },
    }] });
  let browser;
  try {
    await server.listen(); browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1100, height: 900 }, reducedMotion: "reduce" });
    page.setDefaultTimeout(5000);
    page.setDefaultNavigationTimeout(30000);
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    for (const sheet of ["native", "composable"]) for (const mode of ["light", "dark"]) {
      await page.goto(`${server.resolvedUrls.local[0]}?${sheet}`, { waitUntil: "networkidle" });
      await page.evaluate(mode => document.documentElement.dataset.mode = mode, mode);
      const picker = page.getByRole("region", { name: "Primary model picker", exact: true });
      const input = picker.getByRole("combobox", { name: "Models", exact: true });
      const list = picker.getByRole("listbox");
      await input.focus();
      await active(input, "Swift");
      const pinned = await picker.evaluate(region => {
        const input = region.querySelector('[role="combobox"]'), list = region.querySelector('[role="listbox"]'), footer = region.querySelector("footer");
        const before = [input.getBoundingClientRect().top, footer.getBoundingClientRect().top];
        list.scrollTop = list.scrollHeight;
        const result = { scrolls: list.scrollTop > 0, pinned: before[0] === input.getBoundingClientRect().top && before[1] === footer.getBoundingClientRect().top };
        list.scrollTop = 0;
        return result;
      });
      assert.ok(pinned.scrolls, "model list genuinely overflows");
      assert.ok(pinned.pinned, "search and footer stay outside the scrolling list");
      const initialIds = await picker.getByRole("option").evaluateAll(options => Object.fromEntries(options.map(option => [option.textContent, option.id])));
      assert.equal(new Set(Object.values(initialIds)).size, Object.keys(initialIds).length);
      assert.ok(Object.values(initialIds).every(id => !/\s/.test(id)), "host keys cannot produce whitespace IDs");
      // Reorder while focus is on an external control, then restore it to the same key.
      await picker.getByRole("button", { name: "Reverse order", exact: true }).click();
      await input.focus(); await active(input, "Swift"); await visibleActive(input);
      await picker.getByRole("button", { name: "Reverse order", exact: true }).click();
      await input.focus(); await active(input, "Swift"); await visibleActive(input);
      // Native scrolling can move an unchanged active item out of view.
      await list.evaluate(node => { node.scrollTop = node.scrollHeight; });
      await input.press("Home"); await visibleActive(input);
      await input.press("Tab");
      await list.evaluate(node => { node.scrollTop = node.scrollHeight; });
      await page.keyboard.press("Shift+Tab"); await active(input, "Swift"); await visibleActive(input);
      const ids = await page.locator("[id]").evaluateAll(nodes => nodes.map(node => node.id));
      assert.equal(new Set(ids).size, ids.length, "multiple instances produce unique IDs");
      assert.equal(await input.getAttribute("aria-controls"), await list.getAttribute("id"));
      assert.equal(await input.getAttribute("aria-expanded"), "true");
      assert.equal(await picker.getByRole("group", { name: "Alpha", exact: true }).count(), 1);
      assert.equal(await picker.getByRole("option", { name: "Swift", exact: true }).getAttribute("aria-selected"), "true");
      await input.press("ArrowDown"); await active(input, "Reasoned");
      await input.press("ArrowUp"); await active(input, "Swift");
      await input.press("ArrowUp"); await active(input, "Swift");
      await input.press("End"); await active(input, "Large");
      await input.press("ArrowDown"); await active(input, "Large");
      await input.press("Home"); await active(input, "Swift");
      await input.press("ArrowDown");
      await input.dispatchEvent("keydown", { key: "Enter", code: "Enter", isComposing: true, keyCode: 229 });
      assert.equal((await state(picker)).value, "swift:/模型 #1", "IME Enter must not select");
      assert.equal((await state(picker)).open, true);
      await input.dispatchEvent("keydown", { key: "Enter", code: "Enter", isComposing: true, keyCode: 13 });
      assert.equal((await state(picker)).value, "swift:/模型 #1", "composing Enter is ignored independently of keyCode 229");
      assert.equal((await state(picker)).open, true);
      await input.press("Enter");
      assert.equal((await state(picker)).value, "a b");
      assert.equal((await state(picker)).open, false);
      assert.equal(await input.getAttribute("aria-expanded"), "false");
      assert.equal(await input.getAttribute("aria-activedescendant"), null);
      assert.equal(await list.count(), 0);
      await input.press("ArrowDown");
      assert.equal((await state(picker)).open, true);
      await input.fill("vi"); await active(input, "Vision");
      assert.equal((await state(picker)).query, "vi");
      await input.press("Enter");
      assert.equal((await state(picker)).value, "a-b");
      assert.equal(await input.inputValue(), "vi", "selection preserves host query");
      await input.click(); await input.fill("nothing");
      assert.equal(await picker.getByRole("option").count(), 0);
      assert.equal(await input.getAttribute("aria-activedescendant"), null);
      assert.ok(await picker.getByText("No models found", { exact: true }).isVisible());
      await input.press("Home"); await input.press("End"); await input.press("ArrowDown");
      assert.equal(await input.getAttribute("aria-activedescendant"), null, "empty list has no stale descendant");
      await input.press("Enter");
      assert.equal((await state(picker)).value, "a-b");
      await input.fill("");
      await picker.getByRole("option", { name: "Reasoned", exact: true }).hover(); await active(input, "Reasoned");
      await picker.getByRole("option", { name: "Balanced", exact: true }).hover(); await active(input, "Reasoned");
      await picker.getByRole("option", { name: "Balanced", exact: true }).click({ force: true });
      assert.equal((await state(picker)).value, "a-b", "disabled option cannot select");
      await input.focus();
      await picker.getByRole("option", { name: "Reasoned", exact: true }).click();
      assert.equal((await state(picker)).value, "a b");
      assert.equal(await input.evaluate(node => document.activeElement === node), true);
      await input.click(); await input.fill("re");
      await input.press("Shift+Home");
      assert.deepEqual(await input.evaluate(node => [node.selectionStart, node.selectionEnd]), [0, 2], "modified Home preserves native text selection");
      await active(input, "Reasoned");
      await input.press("Escape");
      assert.equal((await state(picker)).open, false);
      assert.equal((await state(picker)).escapes, 0, "handled Escape does not close the containing shell");
      assert.equal(await input.inputValue(), "re");
      await input.press("Escape");
      assert.equal((await state(picker)).escapes, 1, "unhandled closed Escape reaches the owner");
      await input.click(); await input.fill("");
      await input.press("Tab");
      assert.equal(await page.evaluate(() => document.activeElement.textContent), "Manage providers");
      assert.equal((await state(picker)).open, true, "footer focus keeps the inline list open");
      await page.keyboard.press("Enter"); assert.equal((await state(picker)).footer, 1);
      await input.focus(); await input.press("Shift+Tab");
      assert.equal(await page.evaluate(() => document.activeElement.getAttribute("aria-label")), "Beta provider");
      assert.equal((await state(picker)).open, true);
      await picker.getByRole("button", { name: "Reverse order", exact: true }).click();
      const reversedIds = await picker.getByRole("option").evaluateAll(options => Object.fromEntries(options.map(option => [option.textContent, option.id])));
      assert.deepEqual(reversedIds, initialIds, "option identity survives list reorder");
      await input.focus(); await input.press("Home"); await active(input, "Large");
      await input.press("End"); await active(input, "Swift");
      await picker.getByRole("button", { name: "Disable Swift", exact: true }).click();
      await input.focus(); await input.press("End"); await active(input, "Reasoned");
      await picker.getByRole("button", { name: "Beta provider", exact: true }).click();
      assert.equal(await picker.getByRole("option", { name: "Swift", exact: true }).count(), 0);
      await input.focus(); await input.press("Home"); await active(input, "Juniper");
      await input.press("End"); await active(input, "Sprout");
      assert.equal((await state(picker)).value, "a b", "provider change does not change selected host value");
      const geometry = await picker.evaluate(region => {
        const rail = region.querySelector(".fixture-rail"), list = region.querySelector('[role="listbox"]');
        const option = region.querySelector('[role="option"]'), input = region.querySelector('[role="combobox"]');
        const before = [input.getBoundingClientRect().top, region.querySelector("footer").getBoundingClientRect().top];
        list.scrollTop = list.scrollHeight;
        return { rail: rail.getBoundingClientRect().width, row: option.getBoundingClientRect().height, weight: getComputedStyle(option).fontWeight,
          stable: before[0] === input.getBoundingClientRect().top && before[1] === region.querySelector("footer").getBoundingClientRect().top };
      });
      assert.equal(geometry.rail, 44); assert.equal(geometry.row, 32); assert.equal(geometry.weight, "400"); assert.ok(geometry.stable);
    }

    await page.goto(`${server.resolvedUrls.local[0]}?native`, { waitUntil: "networkidle" });
    const refusal = page.getByRole("region", { name: "Controlled refusal", exact: true });
    const fixed = refusal.getByRole("combobox");
    await fixed.fill("change"); assert.equal(await fixed.inputValue(), "");
    await fixed.press("End"); await fixed.press("Enter");
    assert.equal(await fixed.getAttribute("aria-expanded"), "true", "open prop remains authoritative");
    assert.equal(await refusal.locator('[aria-selected="true"]').count(), 0, "value prop remains authoritative");
    const requests = JSON.parse(await refusal.locator(".fixture-events").textContent());
    assert.ok(requests.some(([kind, value]) => kind === "query" && value === "change"));
    assert.ok(requests.some(([kind, value]) => kind === "value" && value === "large"));
    assert.ok(requests.some(([kind, value]) => kind === "open" && value === false));
    const disabled = page.getByRole("region", { name: "Disabled picker", exact: true });
    assert.ok(await disabled.getByRole("combobox").isDisabled());
    await disabled.getByRole("option", { name: "Swift", exact: true }).click({ force: true });
    assert.equal(await disabled.locator(".fixture-events").textContent(), "[]");
    assert.equal(await disabled.locator('[role="option"][aria-disabled="true"]').count(), 6);
    for (const kind of ["disabled", "readOnly"]) {
      const restricted = page.getByRole("region", { name: `Search ${kind}`, exact: true });
      const search = restricted.getByRole("combobox");
      if (kind === "disabled") {
        assert.ok(await search.isDisabled());
        assert.equal(await restricted.locator('[role="option"][aria-disabled="true"]').count(), 6);
      } else {
        await search.focus(); await search.press("End"); await search.press("Enter");
      }
      await restricted.getByRole("option", { name: "Large", exact: true }).click({ force: true });
      assert.equal(await restricted.locator(".fixture-events").textContent(), "[]", `${kind} blocks pointer and keyboard selection`);
      assert.equal(await search.getAttribute("aria-activedescendant"), null);
      await restricted.getByRole("button", { name: "Unlock search", exact: true }).click();
      await search.focus(); await search.press("End"); await search.press("Enter");
      assert.equal(await restricted.locator(".fixture-events").textContent(), '["large"]', `${kind} can be removed dynamically`);
    }
    const original = page.getByRole("combobox", { name: "Original combobox", exact: true });
    await original.click(); await original.press("ArrowDown"); await original.press("Enter");
    assert.notEqual(await page.locator("#original-value").textContent(), "none", "existing Combobox keeps selecting normally");
    await page.setViewportSize({ width: 390, height: 844 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "composition fits narrow viewport");
    await page.setViewportSize({ width: 1100, height: 900 });
    await page.locator(".fixture-pair").screenshot({ path: "/tmp/vic-inline-combobox.png" });
    assert.deepEqual(errors, []);
  } finally { await browser?.close(); await server.close(); }
});
