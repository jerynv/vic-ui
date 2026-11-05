import assert from "node:assert/strict";
import test from "node:test";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";
import { startFixture } from "./controls-layout.server.mjs";

const screenshots = process.env.CONTROLS_SCREENSHOTS;
const value = async (slider, expected) => assert.equal(Number(await slider.inputValue()), expected);
async function track(page, name, fraction, button = "left") {
  const control = page.getByRole("slider", { name, exact: true }).locator("xpath=../..");
  await control.scrollIntoViewIfNeeded();
  const box = await control.boundingBox();
  await page.mouse.click(box.x + 12 + fraction * (box.width - 24), box.y + box.height / 2, { button });
}

test("source controls and settings behave in both themes", { timeout: 120000 }, async (t) => {
  const server = await startFixture();
  const browser = await chromium.launch({ headless: true });
  try {
    if (screenshots) await mkdir(screenshots, { recursive: true });
    for (const theme of ["light", "dark"]) {
      await t.test(theme, async () => {
        const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
        page.setDefaultTimeout(6000);
        const errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto(`${server.resolvedUrls.local[0]}?theme=${theme}`);
        const size = page.getByRole("slider", { name: "Text size", exact: true });
        await size.waitFor();
        await value(size, 50);
        assert.equal(await size.getAttribute("aria-describedby"), "size-description");
        assert.equal(await size.getAttribute("aria-valuetext"), "50 percent");
        await size.focus();
        for (const [key, next] of [["ArrowRight", 55], ["ArrowUp", 60], ["ArrowLeft", 55], ["ArrowDown", 50], ["Home", 0], ["ArrowLeft", 0], ["End", 100], ["ArrowRight", 100], ["PageDown", 50], ["PageUp", 100]]) {
          await page.keyboard.press(key);
          await value(size, next);
        }
        assert.equal(await size.locator("..").evaluate((el) => getComputedStyle(el).outlineStyle), "solid");
        assert.equal(await page.locator('[data-testid="committed"]').textContent(), "100");
        await page.getByRole("button", { name: "Reset appearance" }).click();
        await value(size, 50);
        assert.ok(await size.evaluate((el) => el === document.activeElement));
        await track(page, "Text size", 1);
        await value(size, 55); // One step, not a jump to 100.
        await track(page, "Text size", 1);
        await value(size, 60);
        assert.equal(await page.locator('[data-testid="committed"]').textContent(), "60");
        assert.ok(await size.evaluate((el) => el === document.activeElement));
        await track(page, "Text size", 0, "right");
        await value(size, 60);
        const thumb = await size.boundingBox();
        const control = await size.locator("xpath=../..").boundingBox();
        await page.mouse.move(thumb.x + thumb.width / 2, thumb.y + thumb.height / 2);
        await page.mouse.down();
        await page.mouse.move(control.x + control.width - 12, control.y + control.height / 2, { steps: 10 });
        await page.mouse.up();
        await value(size, 100);
        assert.equal(await page.locator('[data-testid="committed"]').textContent(), "100");

        const spacing = page.getByRole("slider", { name: "Line spacing", exact: true });
        await spacing.focus();
        for (const [key, next] of [["ArrowRight", 1.25], ["PageUp", 1.75], ["PageDown", 1.25], ["Home", 0.25], ["ArrowDown", 0.25], ["End", 2]]) {
          await page.keyboard.press(key); await value(spacing, next);
        }
        await track(page, "Line spacing", 0);
        await value(spacing, 1.75);

        const rtl = page.getByRole("slider", { name: "Right to left", exact: true });
        await rtl.focus();
        for (const [key, next] of [["ArrowRight", 25], ["ArrowLeft", 30], ["ArrowUp", 35], ["Home", 0], ["End", 100]]) {
          await page.keyboard.press(key); await value(rtl, next);
        }
        await track(page, "Right to left", 1);
        await value(rtl, 95);
        const rtlThumb = await rtl.boundingBox();
        const rtlControl = await rtl.locator("xpath=../..").boundingBox();
        await page.mouse.move(rtlThumb.x + 12, rtlThumb.y + 12);
        await page.mouse.down();
        await page.mouse.move(rtlControl.x + rtlControl.width - 12, rtlControl.y + 12, { steps: 10 });
        await page.mouse.up();
        await value(rtl, 0);

        const color = page.getByRole("slider", { name: "Color position", exact: true });
        assert.equal(await color.locator("xpath=../../..").locator(".ui-slider-fill").count(), 0);
        assert.match(await color.locator("xpath=../..").locator(".ui-slider-track").evaluate((el) => getComputedStyle(el).backgroundImage), /linear-gradient/);
        await track(page, "Color position", 1);
        await value(color, 198); // Dense ranges use a twentieth of the range.
        await color.focus(); await page.keyboard.press("End"); await track(page, "Color position", 0);
        await value(color, 342);

        const disabled = page.getByRole("slider", { name: "Unavailable control", exact: true });
        assert.ok(await disabled.isDisabled());
        await track(page, "Unavailable control", 1); await value(disabled, 40);
        await rtl.focus(); await page.keyboard.press("Tab");
        assert.ok(await page.getByRole("slider", { name: "Host controlled" }).evaluate((el) => el === document.activeElement));
        await page.getByRole("button", { name: "Toggle disabled" }).click();
        assert.ok(await disabled.isEnabled());
        await disabled.focus(); await page.keyboard.press("ArrowRight"); await value(disabled, 41);
        await page.getByRole("button", { name: "Toggle disabled" }).click();
        await track(page, "Unavailable control", 1); await value(disabled, 41);

        const refused = page.getByRole("slider", { name: "Host controlled", exact: true });
        await refused.focus(); await page.keyboard.press("ArrowRight"); await value(refused, 50);
        assert.equal(await page.locator('[data-testid="requested"]').textContent(), "51");
        await track(page, "Host controlled", 1); await value(refused, 50);
        assert.equal(await page.locator('[data-testid="requested"]').textContent(), "55");
        await track(page, "Jump to position", 0.8);
        await value(page.getByRole("slider", { name: "Jump to position" }), 80);

        // Real responsive geometry, including a narrow panel inside a wide viewport.
        for (const [width, narrow, label] of [[1280, false, "desktop"], [390, false, "mobile"], [1280, true, "panel"], [320, false, "small-mobile"]]) {
          await page.setViewportSize({ width, height: 900 });
          await page.evaluate((narrow) => document.documentElement.toggleAttribute("data-narrow", narrow), narrow);
          await page.evaluate(() => window.scrollTo(0, 0));
          const geometry = await page.evaluate(() => {
            const nav = document.querySelector(".ui-settings-navigation").getBoundingClientRect();
            const detail = document.querySelector(".ui-settings-detail").getBoundingClientRect();
            const row = document.querySelector(".ui-settings-row");
            const words = row.querySelector(".ui-settings-row-words").getBoundingClientRect();
            const control = row.querySelector(".ui-settings-row-control").getBoundingClientRect();
            const thumb = row.querySelector(".ui-slider-thumb").getBoundingClientRect();
            const visual = row.querySelector(".ui-slider-thumb-visual").getBoundingClientRect();
            return { overflow: document.documentElement.scrollWidth > innerWidth, stackedNav: nav.bottom <= detail.top, stackedRow: words.bottom <= control.top, thumb: thumb.width, visual: visual.width, borders: [...document.querySelectorAll(".ui-settings-group-body")].map((el) => getComputedStyle(el).borderTopWidth) };
          });
          assert.equal(geometry.overflow, false, label);
          assert.equal(geometry.stackedNav, width < 700 || narrow, label);
          assert.equal(geometry.stackedRow, width < 700 || narrow, label);
          assert.ok(geometry.thumb >= 24 && geometry.visual === 14);
          assert.deepEqual(geometry.borders, ["1px", "0px", "0px"]);
          if (screenshots && label !== "small-mobile") await page.screenshot({ path: `${screenshots}/${theme}-${label}.png`, fullPage: true });
        }
        await page.getByRole("textbox").fill("Readable at small widths");
        await page.keyboard.press("Tab");
        assert.ok(await page.getByRole("button", { name: "Reset appearance" }).evaluate((el) => el === document.activeElement));
        assert.deepEqual(errors, []);
        await page.close();
      });
    }
  } finally { await browser.close(); await server.close(); }
});

test("SidebarProvider sibling observer persists while mobile presentation unmounts", { timeout: 60000 }, async () => {
  const server = await startFixture();
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1100, height: 844 }, reducedMotion: "reduce" });
    page.setDefaultTimeout(6000);
    await page.goto(`${server.resolvedUrls.local[0]}?sidebar`);
    const toggle = page.getByRole("button", { name: "Toggle navigation" });
    let received = 0;
    async function observer() {
      received++;
      assert.deepEqual(await page.evaluate(() => { window.dispatchEvent(new Event("conversation-update")); return window.observer; }), { mounts: 1, unmounts: 0, active: 1, received });
    }
    await page.getByRole("complementary", { name: "Project navigation" }).waitFor(); await observer();
    await toggle.click();
    await page.waitForFunction(() => document.body.dataset.sidebarState === "desktop-collapsed"); await observer();
    await toggle.click(); await observer();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForFunction(() => document.body.dataset.sidebarState === "mobile-collapsed");
    assert.equal(await page.getByRole("button", { name: "First page" }).count(), 0);
    assert.equal(await page.locator('[data-sidebar="sidebar"]').count(), 0); await observer();
    await toggle.focus(); await page.keyboard.press("Tab");
    assert.ok(await page.getByRole("textbox", { name: "Background" }).evaluate((el) => el === document.activeElement));
    const dialog = page.getByRole("dialog", { name: "Project navigation" });
    for (const close of ["escape", "button", "backdrop"]) {
      await toggle.click(); await dialog.waitFor(); await observer();
      assert.equal(await page.getByRole("textbox", { name: "Background" }).count(), 0);
      for (let i = 0; i < 6; i++) {
        await page.keyboard.press(i % 2 ? "Shift+Tab" : "Tab");
        await page.waitForFunction(() => document.querySelector('[role="dialog"]')?.contains(document.activeElement));
      }
      if (close === "escape") await page.keyboard.press("Escape");
      if (close === "button") await page.getByRole("button", { name: "Close navigation" }).click();
      if (close === "backdrop") await page.locator(".ui-sidebar-backdrop").click({ position: { x: 350, y: 100 } });
      await dialog.waitFor({ state: "hidden" });
      await page.waitForFunction(() => document.activeElement.textContent === "Toggle navigation");
      assert.equal(await page.locator('[data-sidebar="sidebar"]').count(), 0); await observer();
    }
    await toggle.click(); await dialog.waitFor();
    await page.setViewportSize({ width: 1100, height: 844 });
    await page.getByRole("complementary", { name: "Project navigation" }).waitFor(); await observer();
    await page.getByRole("textbox", { name: "Background" }).fill("Available after breakpoint");
    await page.setViewportSize({ width: 390, height: 844 });
    await dialog.waitFor(); await observer();
    await page.keyboard.press("Escape"); await dialog.waitFor({ state: "hidden" }); await observer();
  } finally { await browser.close(); await server.close(); }
});

test("visible slider labels, composed descriptions, negative decimals and inherited direction", { timeout: 30000 }, async () => {
  const server = await startFixture();
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(`${server.resolvedUrls.local[0]}?standalone`);
    const offset = page.getByRole("slider", { name: "Offset", exact: true });
    await offset.waitFor();
    await value(offset, -1.5); // Omitted defaultValue begins at min.
    assert.equal(await offset.getAttribute("aria-valuetext"), "Offset units");
    assert.deepEqual(await offset.evaluate((el) => el.getAttribute("aria-describedby").split(" ").map((id) => document.getElementById(id).textContent)), ["External description.", "One tenth per step."]);
    await offset.focus();
    await page.keyboard.press("ArrowRight"); await value(offset, -1.4);
    await page.keyboard.press("PageUp"); await value(offset, -0.4);
    await track(page, "Offset", 1); await value(offset, -0.2);
    assert.equal(await page.evaluate(() => new FormData(document.getElementById("preferences")).get("offset")), "-0.2");
    const inherited = page.getByRole("slider", { name: "Inherited direction" });
    await inherited.focus();
    await page.keyboard.press("ArrowRight"); await value(inherited, 49);
    await track(page, "Inherited direction", 0); await value(inherited, 54);
  } finally { await browser.close(); await server.close(); }
});
