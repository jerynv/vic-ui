import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Tabs } from "../dist/index.js";
import { Tabs as ComposableTabs, TabsList, TabsTrigger } from "../dist/ui.js";

// More tabs than a phone is wide: the row scrolls inside its own box and never widens the page.
test("a row of tabs wider than a phone scrolls inside itself", { timeout: 60000 }, async () => {
  const { chromium } = await import("playwright");
  const names = ["Overview", "Engagement", "Retention", "Conversations", "Exports", "Settings"];
  const vic = renderToString(h(Tabs, { "aria-label": "Views", value: "Overview", onValueChange() {}, items: names.map((n) => ({ value: n, label: n })) }));
  const composable = renderToString(h(ComposableTabs, { defaultValue: "Overview" }, h(TabsList, null, names.map((n) => h(TabsTrigger, { key: n, value: n }, n)))));
  const wraps = {
    block: (x) => x,
    grid: (x) => `<div style="display:grid;grid-template-columns:1fr">${x}</div>`,
    column: (x) => `<div style="display:flex;flex-direction:column">${x}</div>`,
    // A flex item's own minimum is its content, as CSS has it: the item that holds the row says min-width: 0.
    row: (x) => `<div style="display:flex"><div style="flex:1;min-width:0">${x}</div></div>`,
  };
  const browser = await chromium.launch({ headless: true });
  try {
    // The composable pieces draw from the composable sheet; the vic sheet has none of its utilities.
    for (const [sheet, kinds] of [["vic-ui.css", ["vic"]], ["ui/styles.css", ["vic", "composable"]]]) {
      const css = await readFile(new URL(`../dist/${sheet}`, import.meta.url), "utf8");
      const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
      const body = Object.entries(wraps).flatMap(([name, wrap]) => kinds.map((kind) => `<section id="${name}-${kind}">${wrap(kind === "vic" ? vic : composable)}</section>`)).join("");
      await page.setContent(`<html><head><style>${css}</style></head><body style="margin:0;padding:16px">${body}</body></html>`);
      const rows = await page.evaluate(() => [...document.querySelectorAll("section")].map((section) => {
        const list = section.querySelector('[role="tablist"]');
        return { id: section.id, width: list.getBoundingClientRect().width, right: list.getBoundingClientRect().right, scroll: list.scrollWidth, overflow: getComputedStyle(list).overflowX };
      }));
      for (const row of rows) {
        assert.ok(row.right <= 374.5, `${sheet} ${row.id}: the row ends at ${row.right}, past the page's 16px gutter`);
        assert.ok(row.scroll > row.width, `${sheet} ${row.id}: the tabs overflow their row and scroll`);
        assert.equal(row.overflow, "auto", `${sheet} ${row.id}`);
      }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390, `${sheet}: the page never scrolls sideways`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
});
