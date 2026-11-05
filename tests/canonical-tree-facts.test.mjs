import assert from "node:assert/strict";
import test from "node:test";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";
import { treePathTo } from "../src/components/treePath.ts";
import { startFixture } from "./canonical-tree-facts.server.mjs";

const screenshots = process.env.CANONICAL_TREE_FACTS_SCREENSHOTS;
const focused = async locator => assert.ok(await locator.evaluate(el => el === document.activeElement));

test("canonical tree paths preserve opaque IDs and report ancestors without the selected item", () => {
  const items = [{ id: "root|folder", label: "Root", children: [{ id: "child:[]|folder", label: "Child", children: [{ id: "leaf/one", label: "Leaf" }] }] }];
  assert.deepEqual(treePathTo(items, "leaf/one"), ["root|folder", "child:[]|folder"]);
  assert.deepEqual(treePathTo(items, "child:[]|folder"), ["root|folder"]);
  assert.deepEqual(treePathTo(items, "root|folder"), []);
  assert.deepEqual(treePathTo(items, "missing"), []);
  assert.deepEqual(treePathTo(items, null), []);
});

test("canonical Facts and Tree preserve source layout, selection, keyboard and host control", { timeout: 120000 }, async t => {
  const server = await startFixture();
  const browser = await chromium.launch({ headless: true });
  try {
    if (screenshots) await mkdir(screenshots, { recursive: true });
    for (const sheet of ["native", "ui"]) for (const theme of ["light", "dark"]) {
      await t.test(`${sheet}/${theme}`, async () => {
        const page = await browser.newPage({ viewport: { width: 1200, height: 950 }, reducedMotion: "reduce" });
        page.setDefaultTimeout(8000);
        const errors = []; page.on("pageerror", error => errors.push(error.message));
        await page.goto(`${server.resolvedUrls.local[0]}?theme=${theme}&sheet=${sheet}`, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
        const tree = page.getByRole("tree", { name: "Project folders" });
        const row = name => tree.getByRole("treeitem", { name, exact: true });
        const projects = row("Projects"), alpha = row("Alpha"), notes = row("Notes");
        assert.equal(await tree.getByRole("treeitem").count(), 4);
        assert.equal(await tree.locator('[tabindex="0"]').count(), 1);
        await projects.focus(); await focused(projects);
        await page.keyboard.press("ArrowRight");
        assert.equal(await projects.getAttribute("aria-expanded"), "true");
        assert.equal(await page.locator("[data-selection]").textContent(), "None");
        await page.keyboard.press("ArrowRight"); await focused(alpha);
        await page.keyboard.press("ArrowRight");
        assert.equal(await alpha.getAttribute("aria-expanded"), "true");
        await page.keyboard.press("ArrowDown"); await focused(notes);
        assert.equal(await notes.getAttribute("aria-level"), "3");
        await page.keyboard.press("Space");
        assert.equal(await notes.getAttribute("aria-selected"), "true");
        assert.equal(await notes.getAttribute("aria-current"), "page");
        await page.keyboard.press("ArrowLeft"); await focused(alpha);
        await page.keyboard.press("ArrowLeft");
        assert.equal(await notes.count(), 0);
        await page.keyboard.press("ArrowDown"); await focused(row("Beta 4 files"));
        await page.keyboard.press("Enter");
        assert.equal(await page.locator("[data-selection]").textContent(), "beta");
        await page.keyboard.press("Home"); await focused(projects);
        await projects.locator(".ui-tree-chevron").click();
        assert.equal(await alpha.count(), 0);
        assert.equal(await page.locator("[data-selection]").textContent(), "beta", "chevron only toggles expansion");
        await page.getByRole("button", { name: "Choose nested note", exact: true }).click();
        await notes.waitFor();
        assert.equal(await projects.getAttribute("aria-expanded"), "true");
        assert.equal(await alpha.getAttribute("aria-expanded"), "true");
        assert.equal(await notes.getAttribute("tabindex"), "0");
        await notes.focus(); await page.keyboard.press("End"); await focused(row("Opaque IDs"));
        await page.keyboard.type("ar"); await focused(row("Archive"));
        await page.keyboard.press("Home"); await focused(projects);
        await page.keyboard.press("ArrowUp"); await focused(projects);
        await page.keyboard.press("End"); await focused(row("Opaque IDs"));
        await page.keyboard.press("ArrowDown"); await focused(row("Opaque IDs"));
        await page.getByRole("button", { name: "Choose opaque child", exact: true }).click();
        const opaque = row("Child with separator"); await opaque.waitFor();
        assert.equal(await opaque.getAttribute("aria-selected"), "true");
        assert.equal(await opaque.getAttribute("tabindex"), "0", "opaque IDs retain their ancestor path");
        await page.getByRole("button", { name: "Hold selection", exact: true }).click();
        await row("Archive").click();
        assert.equal(await page.locator("[data-request]").textContent(), "archive");
        assert.equal(await page.locator("[data-selection]").textContent(), "opaque|child");
        assert.equal(await opaque.getAttribute("aria-selected"), "true");
        assert.equal(await row("Archive").getAttribute("aria-selected"), "false");
        assert.equal(await row("Archive").getAttribute("aria-expanded"), "true");
        await page.getByRole("button", { name: "Toggle Beta", exact: true }).click();
        assert.equal(await row("Beta 4 files").count(), 0);
        assert.equal(await tree.locator('[tabindex="0"]').count(), 1);
        const facts = page.locator('dl[aria-label="Recording details"]');
        assert.equal(await facts.locator("dt").count(), 4);
        assert.equal(await facts.locator("dd").count(), 4);
        assert.equal(await facts.locator('.ui-fact-mark[aria-hidden="true"]').count(), 1);
        assert.equal(await page.locator('dl[aria-label="No facts"] dt').count(), 0);
        let wideRows;
        for (const [width, label] of [[1200, "desktop"], [390, "mobile"], [320, "small"]]) {
          await page.setViewportSize({ width, height: 950 });
          await page.waitForFunction(() => document.documentElement.scrollWidth <= innerWidth);
          const geometry = await facts.evaluate(el => {
            const children = [...el.querySelectorAll('.ui-fact')].map(child => child.getBoundingClientRect());
            return { tops: [...new Set(children.map(box => box.top))], rows: [...document.querySelectorAll('.ui-tree-row')].map(row => row.getBoundingClientRect().height), words: getComputedStyle(document.querySelector('.ui-tree-words')).textOverflow, transition: getComputedStyle(document.querySelector('.ui-tree-chevron svg')).transitionDuration };
          });
          assert.ok(geometry.rows.every(height => height === 32));
          assert.equal(geometry.words, "ellipsis");
          if (width === 1200) { wideRows = geometry.tops.length; assert.ok(wideRows < 4); }
          else assert.ok(geometry.tops.length > wideRows, "facts wrap further in a narrow column");
          assert.ok(geometry.transition === "0s" || Number.parseFloat(geometry.transition) <= 0.00001);
          if (screenshots && label !== "small") await page.screenshot({ path: `${screenshots}/${sheet}-${theme}-${label}.png`, fullPage: true });
        }
        await page.getByRole("button", { name: "Toggle empty tree", exact: true }).click();
        assert.equal(await tree.getByRole("treeitem").count(), 0);
        await page.getByRole("button", { name: "Replace folders", exact: true }).click();
        const arriving = row("Arriving leaf"); await arriving.waitFor();
        assert.equal(await arriving.getAttribute("tabindex"), "0");
        assert.equal(await arriving.getAttribute("aria-selected"), "true");
        await arriving.focus(); await page.keyboard.press("Tab");
        assert.ok(await page.getByRole("button", { name: "Choose nested note", exact: true }).evaluate(el => el === document.activeElement));
        assert.deepEqual(errors, []);
        await page.close();
      });
    }
  } finally { await browser.close(); await server.close(); }
});
