import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { chromium } from "playwright";
import { createServer } from "vite";
import { RecipesFixture } from "./recipes.fixture.mjs";

test("table sorting, filtering, selection, visibility, pagination, and date selection", { timeout: 60000 }, async () => {
  const html = renderToString(createElement(RecipesFixture));
  const server = await createServer({ configFile: false, cacheDir: "node_modules/.vite-recipes-test", optimizeDeps: { entries: ["tests/recipes-hydrate.fixture.mjs"] }, server: { host: "127.0.0.1", port: 0 }, plugins: [{
    name: "recipes-fixture", configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.url !== "/") return next();
        response.setHeader("Content-Type", "text/html");
        response.end(`<html data-mode="light"><head><link rel="stylesheet" href="/dist/ui/styles.css"></head><body><div id="root">${html}</div><script type="module" src="/tests/recipes-hydrate.fixture.mjs"></script></body></html>`);
      });
    },
  }] });
  let browser;
  try {
    await server.listen();
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ reducedMotion: "reduce" });
    page.setDefaultTimeout(10000);
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(server.resolvedUrls.local[0]);
    assert.equal(await page.getByRole("heading", { name: "Projects", level: 1 }).count(), 1);
    assert.equal(await page.getByRole("row").count(), 6);
    await page.getByRole("checkbox", { name: "Select row 0", exact: true }).click();
    await page.getByText("1 of 12 selected", { exact: true }).waitFor();
    const filter = page.getByRole("textbox", { name: "Filter records" });
    await filter.fill("Project A");
    await page.getByText("1 of 1 selected", { exact: true }).waitFor();
    assert.equal(await page.getByRole("row").count(), 2);
    await filter.fill("No matching project");
    await page.getByRole("cell", { name: "No results." }).waitFor();
    await filter.fill("");
    await page.getByRole("button", { name: "Cost", exact: true }).click();
    assert.equal(await page.getByRole("columnheader", { name: "Cost" }).getAttribute("aria-sort"), "descending");
    await page.getByRole("button", { name: "Cost", exact: true }).click();
    assert.equal(await page.locator("tbody tr").first().textContent(), "Project L-1");
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.getByText("Page 2 of 3", { exact: true }).waitFor();
    await page.getByRole("button", { name: "Columns", exact: true }).click();
    await page.getByRole("menuitemcheckbox", { name: "Cost", exact: true }).click();
    await page.keyboard.press("Escape");
    assert.equal(await page.getByRole("columnheader", { name: "Cost" }).count(), 0);
    await page.getByRole("button", { name: /Choose date/ }).click();
    await page.getByRole("button", { name: /November 5th, 2026/ }).click();
    assert.equal(await page.locator('input[name="deadline"]').inputValue(), "2026-11-05");
    await page.getByRole("button", { name: /Choose date/ }).click();
    await page.getByRole("button", { name: "Clear date" }).click();
    assert.equal(await page.locator('input[name="deadline"]').inputValue(), "");
    assert.deepEqual(errors, []);
  } finally {
    await browser?.close();
    await server.close();
  }
});
