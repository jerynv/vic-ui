import assert from "node:assert/strict";
import test from "node:test";
import { chromium } from "playwright";
import { startFixture } from "./v-client-parity.server.mjs";

const px = (value) => Math.round(parseFloat(value) * 100) / 100;
const box = (page, selector) => page.locator(selector).evaluate((el) => {
  const field = el.closest(".ui-field"), frame = field.querySelector(".ui-field-box"), style = getComputedStyle(frame), input = getComputedStyle(el);
  return { classes: field.className, background: style.backgroundColor, shadow: style.boxShadow, height: frame.getBoundingClientRect().height, fontSize: input.fontSize, weight: input.fontWeight, lead: getComputedStyle(document.documentElement).getPropertyValue("--text-lead").trim() };
});

test("v-client parity: field looks, sizes, lead and compact cards", { timeout: 90000 }, async (t) => {
  const server = await startFixture(), browser = await chromium.launch();
  try {
    for (const sheet of ["vic", "ui"]) for (const theme of ["light", "dark"]) await t.test(`${sheet}/${theme}`, async () => {
      const page = await browser.newPage({ viewport: { width: 1100, height: 1400 }, reducedMotion: "reduce" });
      page.setDefaultTimeout(6000);
      const errors = []; page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(`${server.resolvedUrls.local[0]}?sheet=${sheet}&theme=${theme}`, { waitUntil: "networkidle" });

      // TextField look="title": no box, fill or edge, the lead size; the default look keeps its box.
      const title = await box(page, "#title-field");
      assert.ok(title.classes.includes("ui-field-title"));
      assert.equal(title.background, "rgba(0, 0, 0, 0)");
      assert.equal(title.weight, "600");
      assert.equal(px(title.fontSize), 16, `title at --text-lead (${title.lead})`);
      const small = await box(page, "#title-small");
      assert.ok(small.classes.includes("ui-field-sm") && small.classes.includes("ui-field-title"));
      assert.equal(px(small.fontSize), 16, "the title look outranks the dense type");
      const plain = await box(page, "#plain-field");
      assert.ok(!plain.classes.includes("ui-field-title"));
      assert.notEqual(plain.background, "rgba(0, 0, 0, 0)");
      assert.equal(plain.height, 36);
      const borderedTitle = await box(page, "#bordered-title"), bordered = await box(page, "#bordered-field");
      assert.ok(bordered.shadow !== "none" && !bordered.shadow.includes("rgba(0, 0, 0, 0)"), "a bordered field draws its edge");
      assert.ok(borderedTitle.shadow === "none" || borderedTitle.shadow.includes("rgba(0, 0, 0, 0)") || borderedTitle.shadow.includes("transparent"), `a title line draws none: ${borderedTitle.shadow}`);
      // Hover changes nothing on a title line.
      await page.locator("#title-field").hover();
      assert.equal((await box(page, "#title-field")).background, "rgba(0, 0, 0, 0)");

      // Combobox look="bare", size="xs", lead.
      const who = await box(page, "#who");
      assert.ok(who.classes.includes("ui-combo-bare"));
      assert.equal(who.background, "rgba(0, 0, 0, 0)");
      const thin = await box(page, "#thin");
      assert.ok(thin.classes.includes("ui-field-sm") && thin.classes.includes("ui-field-xs"));
      assert.equal(thin.height, 24);
      assert.equal(px(thin.fontSize), 12, "the thin size reads at --text-meta");
      assert.equal(await page.locator("#thin").evaluate((el) => el.previousElementSibling?.className), "ui-combo-lead");
      assert.equal(await page.locator(".ui-combo-lead svg").count(), 1);
      assert.equal((await box(page, "#dense")).height, 32);
      const forwarded = await box(page, "#forwarded");
      assert.equal(forwarded.classes, "ui-field");
      assert.equal(forwarded.height, 36);
      assert.equal(await page.locator("#forwarded").getAttribute("placeholder"), null);
      // The thin field still chooses: type, arrow, Enter.
      await page.locator("#thin").fill("gra");
      await page.keyboard.press("Enter");
      assert.equal(await page.locator("#thin").inputValue(), "Grace Hopper");
      // The bare field still takes chips off and adds them.
      await page.locator("#who").fill("alan");
      await page.keyboard.press("Enter");
      await page.keyboard.press("Escape");
      assert.equal(await page.locator(".ui-combo-bare .ui-combo-chip").count(), 2);

      // ChoiceCards size="sm": compact rows, chosen by the keys, nothing changes size.
      const cards = page.locator(".compact-cards .ui-choice-card");
      assert.ok((await page.locator(".compact-cards").getAttribute("class")).includes("ui-choice-cards-sm"));
      const before = await cards.nth(1).boundingBox();
      assert.ok(before.height >= 32 && before.height < 52, `compact height ${before.height}`);
      const roomy = await page.locator(".ui-choice-cards:not(.compact-cards) .ui-choice-card").boundingBox();
      assert.ok(roomy.height > before.height, "the default card stays roomier");
      await page.getByRole("radio", { name: "No submission" }).focus();
      await page.keyboard.press("ArrowDown");
      assert.equal(await page.getByRole("radio", { name: "Written answer" }).isChecked(), true);
      const after = await cards.nth(1).boundingBox();
      assert.deepEqual([after.width, after.height], [before.width, before.height]);
      assert.notEqual(await cards.nth(1).evaluate((el) => getComputedStyle(el).backgroundColor), "rgba(0, 0, 0, 0)");
      assert.equal(await cards.nth(0).evaluate((el) => getComputedStyle(el).fontSize), "13px");

      // CheckMark: the square drawn without an input.
      assert.equal(await page.locator("#mark-on .ui-check-face").getAttribute("data-checked"), "");
      assert.equal(await page.locator("#mark-off .ui-check-face").getAttribute("data-checked"), null);
      assert.equal(await page.locator("#mark-off .ui-check-box").getAttribute("class"), "ui-check-box extra");
      assert.equal(await page.locator("#mark-on input").count(), 0);
      assert.deepEqual(errors, []);
      await page.close();
    });
  } finally { await browser.close(); await server.close(); }
});

test("v-client parity: provider forms post to their action, hold and leave", { timeout: 60000 }, async () => {
  const server = await startFixture(), browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(6000);
    const errors = []; page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(server.resolvedUrls.local[0], { waitUntil: "networkidle" });
    const events = () => page.evaluate(() => window.parity.events.splice(0));

    const forms = page.locator("#posting form");
    assert.equal(await forms.count(), 2);
    assert.deepEqual(await forms.evaluateAll((all) => all.map((f) => [f.getAttribute("action"), f.method, getComputedStyle(f).display])), [["/auth/google/start", "post", "contents"], ["/auth/apple/start", "post", "contents"]]);
    assert.equal(await page.getByRole("button", { name: "Continue with Google" }).getAttribute("type"), "submit");
    await page.getByRole("button", { name: "Continue with Google" }).click();
    assert.deepEqual(await events(), ["choose google", "leave", "submit /auth/google/start post google"]);
    // The keys press it the same way, and the form is sent once.
    await page.getByRole("button", { name: "Continue with Apple" }).focus();
    await page.keyboard.press("Enter");
    assert.deepEqual(await events(), ["choose apple", "leave", "submit /auth/apple/start post apple"]);

    // A held press sends nothing until the page says go.
    await page.getByRole("button", { name: "Hold Apple" }).click();
    assert.deepEqual(await events(), ["hold apple"]);
    await page.evaluate(() => window.parity.go());
    assert.deepEqual(await events(), ["submit /hold/apple post apple"]);

    // Disabled: nothing chosen or sent.
    await page.getByRole("button", { name: "Off Microsoft" }).click({ force: true });
    assert.deepEqual(await events(), []);

    // Without an action it is the plain button it always was: no form, type=button, onChoose.
    assert.equal(await page.locator("#plain form").count(), 0);
    assert.equal(await page.getByRole("button", { name: "Pick Google" }).getAttribute("type"), "button");
    await page.getByRole("button", { name: "Pick Google" }).click();
    assert.deepEqual(await events(), ["plain google"]);

    // ProviderChoice passes the action on; a disabled fieldset around it holds every press.
    assert.equal(await page.locator("#fieldset form").getAttribute("action"), "/choice/microsoft");
    await page.getByRole("button", { name: "Sign in with Microsoft" }).click();
    assert.deepEqual(await events(), ["submit /choice/microsoft post microsoft"]);
    await page.locator("#hold-fieldset").click();
    await page.getByRole("button", { name: "Sign in with Microsoft" }).click({ force: true });
    assert.deepEqual(await events(), []);
    // A press held earlier sends nothing once its fieldset is disabled.
    await page.evaluate(() => window.parity.go());
    assert.deepEqual(await events(), []);
    assert.deepEqual(errors, []);
  } finally { await browser.close(); await server.close(); }
});

test("v-client parity: FocusFrame keeps one layout while the page names it", { timeout: 60000 }, async () => {
  const server = await startFixture(), browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(6000);
    const errors = []; page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(`${server.resolvedUrls.local[0]}?part=frames`, { waitUntil: "networkidle" });
    assert.equal(await page.locator(".ui-focus-title").textContent(), "Book a demo");
    assert.equal(await page.title(), "Book a demo");
    assert.equal(await page.locator("#brand").count(), 2, "the host's brand reaches the side and the phone head");
    assert.deepEqual(await page.locator(".ui-focus-steps li").allTextContents(), ["Pick a time", "Your details"]);
    await page.evaluate(() => { window.layout = document.querySelector(".ui-focus"); });

    await page.evaluate(() => window.parity.showPage(true));
    await page.locator("#page-body").waitFor();
    assert.equal(await page.locator(".ui-focus-title").textContent(), "Your details");
    assert.equal(await page.title(), "Your details");
    assert.equal(await page.locator(".ui-focus").count(), 1, "no second layout inside the frame");
    assert.ok(await page.evaluate(() => window.layout === document.querySelector(".ui-focus")), "the frame's layout stayed mounted");
    assert.deepEqual(await page.locator(".ui-focus-steps li").evaluateAll((all) => all.map((li) => li.getAttribute("data-at"))), ["done", "now"]);
    await page.getByRole("link", { name: "Back" }).click();
    assert.ok((await page.evaluate(() => window.parity.events)).includes("back"), "the way back runs the page's own press");
    assert.ok(await page.evaluate(() => window.parity.framed.every(Boolean)));

    // Outside a frame the page draws its own layout, and the host's title comes back when it goes.
    await page.evaluate(() => window.parity.showFrame("alone"));
    await page.locator("#alone .ui-focus").waitFor();
    assert.equal(await page.locator(".ui-focus-title").textContent(), "Alone");
    assert.equal(await page.evaluate(() => window.parity.framed.at(-1)), false);
    assert.equal(await page.title(), "Alone");
    await page.evaluate(() => window.parity.showFrame("none"));
    await page.locator(".ui-focus").waitFor({ state: "detached" });
    assert.equal(await page.title(), "Host document title");
    // A frame mounted again over a page that is already there is named by it before it paints.
    await page.evaluate(() => window.parity.showFrame("frame"));
    await page.locator("#frame #page-body").waitFor();
    assert.equal(await page.locator(".ui-focus-title").textContent(), "Your details");
    assert.deepEqual(errors, []);
  } finally { await browser.close(); await server.close(); }
});

test("v-client parity: unlessHeld runs the control's own handler only while it is not held", async () => {
  const server = await startFixture();
  try {
    const { unlessHeld, reasonOf } = await server.ssrLoadModule("/src/components/held.ts");
    const calls = [];
    unlessHeld(false, () => calls.push("reason"), () => calls.push("own"))("event");
    unlessHeld(true, () => calls.push("reason"), () => calls.push("own"))("event");
    unlessHeld(true, undefined, () => calls.push("own"))("event");
    assert.deepEqual(calls, ["own", "reason"]);
    const props = { "aria-describedby": "why" };
    assert.equal(reasonOf(props), props);
  } finally { await server.close(); }
});

test("v-client parity: a thin combobox with several chosen grows to hold its wrapped chips", { timeout: 60000 }, async (t) => {
  const server = await startFixture(), browser = await chromium.launch();
  try {
    for (const sheet of ["vic", "ui"]) await t.test(sheet, async () => {
      const page = await browser.newPage({ viewport: { width: 1100, height: 1400 }, reducedMotion: "reduce" });
      page.setDefaultTimeout(6000);
      await page.goto(`${server.resolvedUrls.local[0]}?sheet=${sheet}`, { waitUntil: "networkidle" });
      const geometry = await page.locator("#thin-many").evaluate((input) => {
        const frame = input.closest(".ui-combo-box"), outer = frame.getBoundingClientRect();
        const parts = [...frame.querySelectorAll(".ui-combo-chip"), input].map((el) => el.getBoundingClientRect());
        return { classes: input.closest(".ui-field").className, many: frame.hasAttribute("data-many"), height: outer.height,
          rows: new Set(parts.map((r) => Math.round(r.top))).size, chips: parts.slice(0, -1).map((r) => r.height),
          inside: parts.every((r) => r.top >= outer.top - 0.5 && r.bottom <= outer.bottom + 0.5) };
      });
      assert.ok(geometry.classes.includes("ui-field-xs") && geometry.many);
      assert.ok(geometry.rows >= 2, `the chips wrap (${geometry.rows} rows)`);
      assert.ok(geometry.inside, `every chip and the input sit inside the box (${JSON.stringify(geometry)})`);
      assert.ok(geometry.height > 24, "the box grew past one thin row");
      for (const height of geometry.chips) assert.equal(height, 20, "a thin chip is the thin height less its inset");
      // A single thin field keeps its fixed thin height.
      assert.equal(await page.locator("#thin").evaluate((el) => el.closest(".ui-field-box").getBoundingClientRect().height), 24);
      await page.close();
    });
  } finally { await browser.close(); await server.close(); }
});

test("v-client parity: a frame forgets a page that has gone and leaves a newer document title alone", { timeout: 60000 }, async () => {
  const server = await startFixture(), browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(6000);
    const errors = []; page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(`${server.resolvedUrls.local[0]}?part=frames`, { waitUntil: "networkidle" });
    await page.evaluate(() => window.parity.showPage(true));
    await page.locator("#page-body").waitFor();
    assert.equal(await page.locator(".ui-focus-title").textContent(), "Your details");
    assert.equal(await page.getByRole("link", { name: "Back" }).count(), 1);
    // The page goes (a lazy next page still loading) while the frame stays mounted.
    await page.evaluate(() => window.parity.showPage(false));
    await page.locator("#loading").waitFor();
    assert.equal(await page.locator(".ui-focus-title").textContent(), "Book a demo", "the frame's own title again");
    assert.equal(await page.title(), "Book a demo", "the frame's own tab again");
    assert.deepEqual(await page.locator(".ui-focus-steps li").evaluateAll((all) => all.map((li) => [li.textContent, li.getAttribute("data-at")])), [["Pick a time", "now"], ["Your details", "next"]]);
    assert.equal(await page.getByRole("link", { name: "Back" }).count(), 0, "no way back the gone page drew");
    // A title the host set after the frame's is not overwritten when the frame goes.
    await page.evaluate(() => { document.title = "Host changed"; window.parity.showFrame("none"); });
    await page.locator(".ui-focus").waitFor({ state: "detached" });
    assert.equal(await page.title(), "Host changed");
    assert.deepEqual(errors, []);
  } finally { await browser.close(); await server.close(); }
});
