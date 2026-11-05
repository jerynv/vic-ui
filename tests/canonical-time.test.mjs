import assert from "node:assert/strict";
import test from "node:test";
import { mkdir } from "node:fs/promises";
import { build } from "esbuild";
import { chromium } from "playwright";
import { startFixture } from "./canonical-time.server.mjs";

const result = await build({ entryPoints: ["src/components/time-support/clock.ts"], bundle: true, write: false, format: "esm", platform: "node" });
const { readClock, timesFor, clockOf, timeBounds, durationWords } = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString("base64")}`);

test("canonical time parsing keeps ambiguous and exact readings within finite host bounds", () => {
  for (const [typed, expected] of [["930", [570, 1290]], ["9:30", [570, 1290]], ["9.30", [570, 1290]], ["0930", [570]], ["9:30p", [1290]], ["9.30 pm", [1290]], ["2130", [1290]], ["12a", [0]], ["12p", [720]], ["24:00", [1440]]]) assert.deepEqual(readClock(typed), expected, typed);
  for (const typed of ["9:3", "25:00", "24:01", "12:60", "0am", "13pm", "words", "<script>"]) assert.deepEqual(readClock(typed), [], typed);
  assert.equal(clockOf(0), "00:00"); assert.equal(clockOf(1439), "23:59"); assert.equal(durationWords(135), "2 h 15 min");
  assert.deepEqual(timeBounds(600, 900, 630), [631, 900]); assert.deepEqual(timeBounds(NaN), [1, 0]);
  assert.deepEqual(timesFor("", 0, 1439).length, 96); assert.equal(timesFor("1", 0, 1439).length <= 24, true);
  assert.deepEqual(timesFor("17:03", 0, 1439)[0], 1023); assert.deepEqual(timesFor("24:00", 0, 1439), []);
  for (const [min, max] of [[Infinity, 1439], [0, Infinity], [-1, 1439], [0, 1440], [700, 600], [0.5, 500], [NaN, 100]]) assert.deepEqual(timesFor("", min, max), []);
});

const value = (page, name) => page.getByLabel(name, { exact: true }).textContent();
const trigger = (page, name) => page.getByRole("button", { name: new RegExp(`^${name} `) });
async function setup(browser, server, sheet = "native", theme = "light") {
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 }, reducedMotion: "reduce" }); const errors = [];
  page.on("pageerror", e => errors.push(e.message)); page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto(`${server.resolvedUrls.local[0]}?sheet=${sheet}&theme=${theme}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready); return { page, errors };
}

test("canonical suggestion field keeps selected time, parses typed choices, bounds and host refusal", { timeout: 90000 }, async () => {
  const server = await startFixture(), browser = await chromium.launch({ headless: true });
  try {
    const { page, errors } = await setup(browser, server); const start = page.getByRole("combobox", { name: "Start time" });
    await start.click(); assert.equal(await page.getByRole("option").first().textContent(), "10:30");
    await start.press("Enter"); assert.equal(await value(page, "Start value"), "630");
    await start.fill("930"); assert.deepEqual(await page.getByRole("option").allTextContents(), ["09:30", "21:30"]);
    await start.press("ArrowDown"); await start.press("Enter"); assert.equal(await value(page, "Start value"), "1290");
    await start.fill("17:03"); await start.press("Enter"); assert.equal(await value(page, "Start value"), "1023");
    await start.click(); assert.equal(await page.getByRole("option").first().textContent(), "17:03"); await start.press("Enter"); assert.equal(await value(page, "Start value"), "1023");
    await start.fill("24:00"); assert.equal(await page.getByRole("option").count(), 0); const before = await value(page, "Change requests"); await start.press("Enter"); assert.equal(await value(page, "Change requests"), before); await start.press("Escape");
    await page.getByRole("checkbox", { name: "Host refuses changes" }).check(); await start.fill("9:30p"); await page.getByRole("option", { name: "21:30", exact: true }).click(); assert.equal(await value(page, "Start value"), "1023"); assert.equal(await start.inputValue(), "17:03");
    await page.getByRole("checkbox", { name: "Host refuses changes" }).uncheck();
    const end = page.getByRole("combobox", { name: "End time" }); await end.click(); assert.equal(await page.getByRole("option").first().textContent(), "10:15 (15 min)"); await end.press("Escape");
    const bounded = page.getByRole("combobox", { name: "Bounded suggestions" }); await bounded.click(); assert.deepEqual(await page.getByRole("option").allTextContents(), ["11:00 (15 minutes later)", "11:15 (30 minutes later)"]);
    await bounded.fill("10:46"); await bounded.press("Enter"); assert.equal(await value(page, "Bounded value"), "646");
    await bounded.click();
    assert.ok((await page.getByRole("option").allTextContents()).includes("10:46 (1 minutes later)"));
    await bounded.press("Enter"); assert.equal(await value(page, "Bounded value"), "646", "reopening an end time must not round a valid minute");
    await bounded.fill("10:45"); assert.equal(await page.getByRole("option").count(), 0); await bounded.press("Escape");
    const invalid = page.getByRole("combobox", { name: "Invalid bounds" }); await invalid.click(); assert.equal(await page.getByRole("option").count(), 0); await invalid.press("Escape");
    const held = page.getByRole("combobox", { name: "Unavailable suggestions" }); await held.focus(); await held.press("ArrowDown"); assert.equal(await held.getAttribute("aria-disabled"), "true"); assert.ok(await held.getAttribute("aria-describedby")); assert.equal(await page.getByRole("option").count(), 0);
    assert.deepEqual(errors, []);
  } finally { await browser.close(); await server.close(); }
});

test("exact picker segments, commits and focus work in both CSS foundations and themes", { timeout: 120000 }, async t => {
  const server = await startFixture(), browser = await chromium.launch({ headless: true });
  try {
    await mkdir("/tmp/vic-canonical-time", { recursive: true });
    for (const sheet of ["native", "ui"]) for (const theme of ["light", "dark"]) await t.test(`${sheet}/${theme}`, async () => {
      const { page, errors } = await setup(browser, server, sheet, theme); const exact = trigger(page, "Exact time");
      await exact.focus(); await exact.press("ArrowDown"); const dialog = page.getByRole("dialog", { name: "Choose a time" });
      assert.ok(await dialog.getByRole("spinbutton", { name: "hour, Exact time" }).evaluate(el => el === document.activeElement));
      await page.keyboard.press("ArrowUp"); await page.keyboard.press("ArrowRight"); await page.keyboard.press("ArrowUp");
      assert.equal(await dialog.getByRole("spinbutton", { name: "minute, Exact time" }).getAttribute("aria-valuenow"), "31");
      assert.equal(await page.locator(".ui-time-mark").first().evaluate(el => getComputedStyle(el).rotate), "none");
      await page.screenshot({ path: `/tmp/vic-canonical-time/${sheet}-${theme}-desktop.png`, fullPage: true });
      await dialog.getByRole("button", { name: "Done", exact: true }).click(); assert.equal(await value(page, "Exact value"), "10:31");
      assert.ok(await exact.evaluate(el => el === document.activeElement)); assert.equal(await page.evaluate(() => new FormData(document.querySelector("form")).get("exact")), "10:31");
      await exact.click(); await page.keyboard.press("ArrowUp"); await page.keyboard.press("Escape"); assert.equal(await value(page, "Exact value"), "10:31"); assert.ok(await exact.evaluate(el => el === document.activeElement));
      await exact.click(); assert.equal(await dialog.getByRole("spinbutton", { name: "hour, Exact time" }).getAttribute("aria-valuenow"), "10");
      await dialog.getByRole("button", { name: "No time", exact: true }).click(); assert.equal(await value(page, "Exact value"), "");
      await exact.click(); await page.keyboard.type("13"); assert.equal(await dialog.getByRole("button", { name: "Done", exact: true }).getAttribute("aria-disabled"), "true");
      await page.keyboard.type("47"); await dialog.getByRole("button", { name: "Done", exact: true }).click(); assert.equal(await value(page, "Exact value"), "13:47");
      await page.setViewportSize({ width: 390, height: 844 }); await exact.click(); await page.screenshot({ path: `/tmp/vic-canonical-time/${sheet}-${theme}-mobile.png`, fullPage: true });
      for (const width of [390, 320]) { await page.setViewportSize({ width, height: 844 }); assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)); const box = await dialog.boundingBox(); assert.ok(box.x >= 0 && box.x + box.width <= width); }
      await page.keyboard.press("Escape"); assert.deepEqual(errors, []); await page.close();
    });
  } finally { await browser.close(); await server.close(); }
});

test("exact segments retain Home/End, page steps, day-edge wrapping and keyboard completion", { timeout: 90000 }, async () => {
  const server = await startFixture(), browser = await chromium.launch({ headless: true });
  try {
    const { page, errors } = await setup(browser, server); const exact = trigger(page, "Exact time"), dialog = page.getByRole("dialog", { name: "Choose a time" });
    await exact.focus(); await exact.press("Enter"); await page.keyboard.press("End"); await page.keyboard.press("ArrowRight"); await page.keyboard.press("End");
    await page.keyboard.press("Tab"); assert.ok(await dialog.getByRole("button", { name: "No time", exact: true }).evaluate(el => el === document.activeElement));
    await page.keyboard.press("Tab"); await page.keyboard.press("Enter"); assert.equal(await value(page, "Exact value"), "23:59");
    await exact.press("Enter"); await page.keyboard.press("ArrowUp"); await page.keyboard.press("ArrowRight"); await page.keyboard.press("ArrowUp");
    await dialog.getByRole("button", { name: "Done", exact: true }).click(); assert.equal(await value(page, "Exact value"), "00:00");
    await exact.press("Enter"); await page.keyboard.press("ArrowRight"); await page.keyboard.press("PageUp");
    assert.equal(await dialog.getByRole("spinbutton", { name: "minute, Exact time" }).getAttribute("aria-valuenow"), "15");
    await page.keyboard.press("PageDown"); assert.equal(await dialog.getByRole("spinbutton", { name: "minute, Exact time" }).getAttribute("aria-valuenow"), "0");
    await page.keyboard.press("ArrowLeft"); await page.keyboard.press("End"); await page.keyboard.press("Home");
    assert.equal(await dialog.getByRole("spinbutton", { name: "hour, Exact time" }).getAttribute("aria-valuenow"), "0"); await page.keyboard.press("Escape");
    assert.deepEqual(errors, []);
  } finally { await browser.close(); await server.close(); }
});

test("exact picker bounds, disabled descriptions, partial values and controlled refusal block commits", { timeout: 90000 }, async () => {
  const server = await startFixture(), browser = await chromium.launch({ headless: true });
  try {
    const { page, errors } = await setup(browser, server); const dialog = page.getByRole("dialog", { name: "Choose a time" });
    const done = dialog.getByRole("button", { name: "Done", exact: true }); const limited = trigger(page, "Office time");
    await limited.click(); await page.keyboard.type("08"); await page.keyboard.type("30"); assert.equal(await done.getAttribute("aria-disabled"), "true");
    const before = await value(page, "Change requests"); await done.evaluate(el => el.click()); assert.equal(await value(page, "Change requests"), before);
    await dialog.getByRole("spinbutton", { name: "hour, Office time" }).focus(); await page.keyboard.type("09"); await done.click(); assert.equal(await value(page, "Limited value"), "09:30");
    await limited.click(); await page.keyboard.type("18"); await page.keyboard.type("30"); assert.equal(await done.getAttribute("aria-disabled"), "true"); await page.keyboard.press("Escape");
    await page.getByRole("checkbox", { name: "Invalid picker bounds" }).check(); await limited.click(); assert.equal(await done.getAttribute("aria-disabled"), "true"); await page.keyboard.press("Escape");
    await page.getByRole("checkbox", { name: "Host refuses changes" }).check(); const exact = trigger(page, "Exact time"); await exact.click(); await page.keyboard.press("ArrowUp"); await done.click(); assert.equal(await value(page, "Exact value"), "09:30");
    await exact.click(); assert.equal(await dialog.getByRole("spinbutton", { name: "hour, Exact time" }).getAttribute("aria-valuenow"), "9"); await page.keyboard.press("Escape");
    await page.getByRole("checkbox", { name: "Host refuses changes" }).uncheck(); await exact.click();
    const requests = await value(page, "Change requests"); await page.getByRole("checkbox", { name: "Disable exact picker" }).evaluate(el => el.click());
    await dialog.waitFor({ state: "hidden" }); assert.equal(await value(page, "Change requests"), requests); assert.ok(await exact.evaluate(el => el === document.activeElement));
    await exact.focus(); await exact.press("ArrowDown"); await exact.evaluate(el => el.click()); assert.equal(await dialog.count(), 0);
    const locked = trigger(page, "Locked exact"); const description = (await locked.getAttribute("aria-describedby")).split(" "); assert.equal(description.length, 4); assert.ok(description.includes("external-description"));
    assert.equal(await locked.getAttribute("aria-invalid"), "true"); assert.equal(await locked.getAttribute("aria-disabled"), "true");
    assert.equal(await page.getByRole("button", { name: "Native disabled time: 12:00", exact: true }).isDisabled(), true);
    await page.getByRole("checkbox", { name: "Disable exact picker" }).uncheck(); await page.getByRole("button", { name: "Set invalid external value" }).click(); assert.equal(await page.locator('input[name="exact"]').inputValue(), "");
    await exact.click(); assert.equal(await dialog.locator("[data-placeholder]").count(), 2); await page.keyboard.press("Escape");
    assert.deepEqual(errors, []);
  } finally { await browser.close(); await server.close(); }
});

test("time popovers release observers and listeners on close/unmount; outside focus remains with host", { timeout: 90000 }, async () => {
  const server = await startFixture(), browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage(); await page.addInitScript(() => {
      window.timeObservers = new Set(); const Original = window.ResizeObserver;
      window.ResizeObserver = class extends Original { observe(...args) { window.timeObservers.add(this); return super.observe(...args); } disconnect() { window.timeObservers.delete(this); super.disconnect(); } };
      window.timePointerListeners = new Set(); const add = document.addEventListener.bind(document), remove = document.removeEventListener.bind(document);
      document.addEventListener = (type, listener, options) => { if (type === "pointerdown") window.timePointerListeners.add(listener); add(type, listener, options); };
      document.removeEventListener = (type, listener, options) => { if (type === "pointerdown") window.timePointerListeners.delete(listener); remove(type, listener, options); };
    });
    await page.goto(server.resolvedUrls.local[0], { waitUntil: "networkidle" });
    const baseline = await page.evaluate(() => ({ observers: window.timeObservers.size, listeners: window.timePointerListeners.size }));
    const exact = trigger(page, "Exact time"); await exact.click(); assert.ok(await page.evaluate(() => window.timeObservers.size) > baseline.observers);
    await page.getByRole("button", { name: "After controls", exact: true }).click(); assert.equal(await page.getByRole("dialog").count(), 0); assert.ok(await page.getByRole("button", { name: "After controls", exact: true }).evaluate(el => el === document.activeElement));
    await page.waitForFunction(b => window.timeObservers.size === b.observers && window.timePointerListeners.size === b.listeners, baseline);
    await exact.click(); await page.getByRole("button", { name: "Toggle mounted controls", exact: true }).evaluate(el => el.click());
    await page.waitForFunction(b => window.timeObservers.size === b.observers && window.timePointerListeners.size === b.listeners, baseline); assert.equal(await page.locator(":popover-open").count(), 0);
  } finally { await browser.close(); await server.close(); }
});


test("disabling open time suggestions closes the popup, preserves focus and resets its query", { timeout: 60000 }, async t => {
  const server = await startFixture(), browser = await chromium.launch({ headless: true });
  try {
    for (const sheet of ["native", "ui"]) await t.test(sheet, async () => {
      const { page, errors } = await setup(browser, server, sheet);
      const field = page.getByRole("combobox", { name: "Bounded suggestions" });
      await field.fill("10:46"); await field.press("Enter");
      await field.fill("11"); assert.ok(await page.getByRole("option").count() > 0);
      const requests = await value(page, "Change requests");
      // Change host state without a blur that could mask the disabled-transition defect.
      await page.getByRole("checkbox", { name: "Disable suggestions" }).evaluate(el => el.click());
      await page.getByRole("listbox").waitFor({ state: "detached", timeout: 3000 });
      assert.equal(await field.getAttribute("aria-expanded"), "false");
      assert.equal(await field.evaluate(el => el.readOnly && el === document.activeElement), true);
      assert.equal(await field.inputValue(), "10:46");
      await field.press("Escape"); assert.equal(await page.getByRole("option").count(), 0);
      assert.equal(await value(page, "Change requests"), requests);
      await page.getByRole("button", { name: "After controls", exact: true }).click();
      assert.equal(await page.getByRole("button", { name: "After controls", exact: true }).evaluate(el => el === document.activeElement), true);
      await page.getByRole("checkbox", { name: "Disable suggestions" }).uncheck();
      await field.click(); assert.equal(await field.inputValue(), "");
      await field.press("Enter"); assert.equal(await value(page, "Bounded value"), "646");
      assert.deepEqual(errors, []); await page.close();
    });
  } finally { await browser.close(); await server.close(); }
});
