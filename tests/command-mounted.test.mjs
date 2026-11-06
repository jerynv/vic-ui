import assert from "node:assert/strict";
import test from "node:test";
import { chromium } from "playwright";
import react from "@vitejs/plugin-react";
import { createServer } from "vite";
import { resolve } from "node:path";

// The input's aria-activedescendant must name the item cmdk marks selected: on mount with a value
// already chosen, after moving, and after the list gains an item.
test("CommandInput points at the selected CommandItem on mount, after moving and as the list grows", { timeout: 60000 }, async (t) => {
  const server = await createServer({
    configFile: false,
    root: process.cwd(),
    resolve: { alias: { "@": resolve(process.cwd(), "src") } },
    server: { host: "127.0.0.1", port: 0 },
    plugins: [react()],
  });
  let browser;
  try {
    await server.listen();
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(`${server.resolvedUrls.local[0]}tests/command-mounted.html`);
    await page.locator("[data-case=mounted] [data-slot=command-input]").waitFor();
    await page.waitForFunction(() => document.body.dataset.mountActive !== undefined);
    // The selected item's id, and whether the input names it, for one case.
    const pointed = (name) => page.evaluate((name) => {
      const box = document.querySelector(`[data-case="${name}"]`);
      const input = box.querySelector("[data-slot=command-input]");
      const item = box.querySelector('[cmdk-item][aria-selected="true"]');
      return { item: item?.textContent ?? null, active: input.getAttribute("aria-activedescendant"), id: item?.id ?? null };
    }, name);
    const settle = () => page.evaluate(() => new Promise(requestAnimationFrame));

    await t.test("a controlled value chosen before mount", async () => {
      const association = await page.evaluate(() => ({
        mountActive: document.body.dataset.mountActive,
        itemId: document.body.dataset.itemId,
        active: document.querySelector("[data-case=mounted] [data-slot=command-input]").getAttribute("aria-activedescendant"),
      }));
      assert.equal(association.mountActive, association.itemId);
      assert.equal(association.active, association.itemId);
      await page.locator("[data-case=mounted] [data-slot=command-input]").press("ArrowDown");
      await page.waitForFunction(() => document.body.dataset.changedValue === "second");
    });

    for (const [name, moves, expected] of [["uncontrolled", 1, "Item b"], ["default", 2, "Item d"], ["words", 1, "Item b"]]) {
      await t.test(`${name}: on mount, after moving, after an item is added`, async () => {
        await settle();
        const first = await pointed(name);
        assert.ok(first.id, "an item is selected on mount");
        assert.equal(first.active, first.id, "the input names it on mount");
        const input = page.getByRole("combobox", { name: `Search ${name}` });
        for (let step = 0; step < moves; step++) await input.press("ArrowDown");
        await settle();
        let now = await pointed(name);
        assert.equal(now.item, expected);
        assert.equal(now.active, now.id);
        await page.getByRole("button", { name: `Add to ${name}` }).click();
        await settle();
        now = await pointed(name);
        assert.equal(now.item, expected, "adding an item keeps the choice");
        assert.equal(now.active, now.id, "and the input still names it");
      });
    }

    await t.test("controlled, with items valued by their words, after moving, and with a value no item has", async () => {
      await settle();
      let now = await pointed("controlled-words");
      assert.equal(now.item, "Item b");
      assert.equal(now.active, now.id);
      await page.getByRole("combobox", { name: "Search controlled words" }).press("ArrowDown");
      await settle();
      now = await pointed("controlled-words");
      assert.equal(now.item, "Item c");
      assert.equal(now.active, now.id);
      await page.getByRole("button", { name: "Choose nothing" }).click();
      await settle();
      now = await pointed("controlled-words");
      assert.equal(now.item, null);
      assert.equal(now.active, null, "with nothing selected the input names nothing");
    });

    await t.test("a filter that matches nothing leaves the input naming nothing", async () => {
      const input = page.getByRole("combobox", { name: "Search uncontrolled" });
      // These items filter on their values ("a" to "d"), not their words.
      await input.fill("c");
      await page.waitForFunction(() => document.querySelector('[data-case="uncontrolled"] [cmdk-item][aria-selected="true"]')?.textContent === "Item c");
      await settle();
      let now = await pointed("uncontrolled");
      assert.equal(now.item, "Item c");
      assert.equal(now.active, now.id);
      await input.fill("zzz");
      await settle();
      now = await pointed("uncontrolled");
      assert.equal(now.item, null);
      assert.equal(now.active, null);
      await input.fill("");
      await page.waitForFunction(() => document.querySelector('[data-case="uncontrolled"] [cmdk-item][aria-selected="true"]') !== null);
      await settle();
      now = await pointed("uncontrolled");
      assert.equal(now.active, now.id, "clearing the filter points at the selected item again");
    });
    assert.deepEqual(errors, []);
  } finally { await browser?.close(); await server.close(); }
});
