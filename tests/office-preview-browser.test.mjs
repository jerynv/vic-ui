import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { chromium } from "playwright";
import { createServer } from "vite";
import { officeZip, workbookParts, presentationParts } from "./office-zip.fixture.mjs";

const changedParts = { ...workbookParts, "xl/worksheets/sheet1.xml": workbookParts["xl/worksheets/sheet1.xml"].replace("=SUM(A1:A2)", "CURRENT FILE") };
const data = parts => Array.from(officeZip(parts, { compress: true }));
const files = { book: data(workbookParts), slides: data(presentationParts), changed: data(changedParts) };

test("Office previews render actual cells and extracted slide text with bounded parsing, retry and stale-input cleanup", { timeout: 60000 }, async () => {
  const { OfficePreviewFixture } = await import("./office-preview.fixture.mjs");
  const html = renderToString(createElement(OfficePreviewFixture, { files }));
  assert.ok(html.includes("Loading spreadsheet") && html.includes("Loading slide text"), "SSR does not access browser parsers");
  const server = await createServer({ configFile: false, cacheDir: "node_modules/.vite-office-preview-test", optimizeDeps: { entries: ["tests/office-preview-hydrate.fixture.mjs"] },
    server: { host: "127.0.0.1", port: 0 }, plugins: [{ name: "office-preview-fixture", configureServer(server) { server.middlewares.use((request, response, next) => {
      if (!request.url?.startsWith("/?")) return next();
      const sheet = request.url.includes("composable") ? "ui/styles.css" : "vic-ui.css";
      response.setHeader("Content-Type", "text/html; charset=utf-8");
      response.end(`<html><head><link rel="stylesheet" href="/dist/${sheet}"><style>main{padding:16px;max-width:900px}main>div{margin-bottom:24px}</style></head><body><div id="root">${html}</div><script>window.__officeFiles=${JSON.stringify(files)}</script><script type="module" src="/tests/office-preview-hydrate.fixture.mjs"></script></body></html>`);
    }); } }] });
  let browser;
  try {
    await server.listen(); browser = await chromium.launch();
    const page = await browser.newPage({ reducedMotion: "reduce" }); page.setDefaultTimeout(5000);
    const errors = [], external = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    page.on("request", request => { if (!request.url().startsWith(server.resolvedUrls.local[0]) && !request.url().startsWith("data:")) external.push(request.url()); });
    for (const sheet of ["native", "composable"]) for (const mode of ["light", "dark"]) {
      await page.goto(`${server.resolvedUrls.local[0]}?${sheet}`, { waitUntil: "networkidle" });
      await page.evaluate(mode => { document.documentElement.dataset.mode = mode; }, mode);
      const book = page.locator("#workbook");
      await book.getByRole("table", { name: "Summary", exact: true }).waitFor();
      assert.equal(await book.locator("tbody tr").count(), 3);
      assert.equal(await book.locator("tbody tr").first().locator("td").nth(0).textContent(), "<script>window.__officeRan=true</script>");
      assert.equal(await book.locator("tbody tr").first().locator("td").nth(1).textContent(), "=SUM(A1:A2)");
      assert.equal(await book.locator("tbody tr").first().locator("td").nth(2).textContent(), "TRUE");
      assert.equal(await book.locator("tbody tr").nth(2).locator("td").nth(0).textContent(), "4");
      assert.equal(await book.locator("tbody tr").nth(2).locator("td").nth(1).textContent(), "Not calculated");
      assert.equal(await book.locator("tbody tr").nth(2).locator("td").nth(2).textContent(), "Shared words");
      assert.equal(await book.locator("script, img, a").count(), 0);
      await book.getByRole("tab", { name: "Summary", exact: true }).focus(); await page.keyboard.press("ArrowRight");
      assert.ok(await book.getByRole("table", { name: "Details", exact: true }).isVisible());
      assert.equal(await book.getByRole("tab", { name: "Details", exact: true }).getAttribute("aria-selected"), "true");
      assert.equal(await book.getByRole("tab", { name: "Details", exact: true }).getAttribute("aria-controls"), await book.getByRole("tabpanel").getAttribute("id"));
      assert.ok(await page.locator("#slides").getByText("Quarterly report", { exact: true }).isVisible());
      assert.ok(await page.locator("#slides").getByText("Stored table text", { exact: true }).isVisible());
      assert.ok(await page.locator("#slides").getByText("<img src=x onerror=alert(1)>", { exact: true }).isVisible());
      assert.ok(await page.locator("#slides").getByText(/Extracted slide text only/).isVisible());
      assert.equal(await page.locator("#slides img").count(), 0);
      assert.equal(await page.evaluate(() => window.__officeRan), undefined);
      assert.equal(await page.locator("#limited-book tbody tr").count(), 1);
      assert.equal(await page.locator("#limited-book tbody td").count(), 2);
      assert.equal(await page.locator("#limited-book [role=tab]").count(), 1);
      assert.match(await page.locator("#limited-book").textContent(), /Showing the first 1 of 3 rows and 2 of 3 columns/);
      assert.match(await page.locator("#limited-book").textContent(), /Showing 1 of 2 worksheets/);
      assert.match(await page.locator("#limited-slides").textContent(), /Showing 1 of 2 slides/);
      await page.locator("#retry [role=alert]").waitFor(); assert.equal(await page.locator("#errors").textContent(), "1");
      await page.locator("#retry").getByRole("button", { name: "Try again" }).click(); await page.locator("#retry table").waitFor();
      assert.ok(await page.evaluate(() => document.querySelector('#retry [role="tab"][aria-selected="true"]') === document.activeElement), "spreadsheet retry restores focus to its sheet tab");
      await page.locator("#retry-slides").getByRole("button", { name: "Try again" }).click();
      await page.locator("#retry-slides article").first().waitFor();
      assert.ok(await page.evaluate(() => document.querySelector('#retry-slides [role="region"][tabindex="0"]') === document.activeElement), "slide retry restores focus to its text region");
      await page.locator("#replace").click();
      await page.locator("#stale").getByText("CURRENT FILE", { exact: true }).waitFor();
      assert.ok(await book.getByRole("table", { name: "Summary", exact: true }).isVisible(), "new input resets sheet selection");
      await page.evaluate(() => window.__resolveOldOffice());
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      assert.ok(await page.locator("#stale").getByText("CURRENT FILE", { exact: true }).isVisible());
      await page.locator("#unmount").click(); await page.evaluate(() => window.__rejectLateOffice());
      assert.equal(await page.locator("#errors").textContent(), "1", "late errors do not escape an unmounted preview");
    }
    const cases = {
      malformed: '<r><a></r>', deep: '<r>'.repeat(130) + '</r>'.repeat(130), dtd: '<!DOCTYPE r [<!ENTITY x "boom">]><r>&x;</r>',
      badCell: data({ ...workbookParts, "xl/worksheets/sheet1.xml": workbookParts["xl/worksheets/sheet1.xml"].replace('r="A1"', 'r="A999999999"') }),
      external: data({ ...workbookParts, "xl/_rels/workbook.xml.rels": '<Relationships><Relationship Id="r1" Target="https://example.invalid/remote.xml" TargetMode="External"/></Relationships>' }),
      strings: data({ ...workbookParts, "xl/sharedStrings.xml": '<sst>' + '<si/>'.repeat(20_001) + '</sst>' }),
      character: data({ ...workbookParts, "xl/sharedStrings.xml": '<sst><si><t>' + 'X'.repeat(16_385) + '</t></si></sst>' }),
      tooManySheets: data({ ...workbookParts, "xl/workbook.xml": '<workbook><sheets>' + '<sheet/>'.repeat(33) + '</sheets></workbook>' }),
      tooManySlides: data({ ...presentationParts, "ppt/presentation.xml": '<presentation><sldIdLst>' + '<sldId/>'.repeat(101) + '</sldIdLst></presentation>' }),
      sparse: data({ ...workbookParts, "xl/worksheets/sheet1.xml": '<worksheet><sheetData><row r="1048576"><c r="XFD1048576"><v>1</v></c></row></sheetData></worksheet>' }),
    };
    const parserResults = await page.evaluate(async cases => {
      const { readOfficeArchive, parseOfficeXml } = await import('/src/preview/office/zip.ts');
      const { readWorkbook } = await import('/src/preview/office/workbook.ts');
      const { readSlides } = await import('/src/preview/office/slides.ts');
      const results = {};
      for (const key of ['malformed','deep','dtd']) { try { parseOfficeXml(new TextEncoder().encode(cases[key])); results[key] = 'accepted'; } catch (e) { results[key] = e.message; } }
      for (const key of ['badCell','external','strings','character','tooManySheets','tooManySlides']) {
        try { const archive = await readOfficeArchive(Uint8Array.from(cases[key])); key === 'tooManySlides' ? readSlides(archive,100) : readWorkbook(archive,{rows:1000,columns:60,sheets:32}); results[key] = 'accepted'; } catch (e) { results[key] = e.message; }
      }
      const sparse = readWorkbook(await readOfficeArchive(Uint8Array.from(cases.sparse)),{rows:3,columns:2,sheets:1}).sheets[0];
      results.sparse = { rows: sparse.rows.length, columns: sparse.columns, totalRows: sparse.totalRows, totalColumns: sparse.totalColumns };
      return results;
    }, cases);
    for (const [key, value] of Object.entries(parserResults)) if (key !== "sparse") assert.notEqual(value, "accepted", `${key} must be rejected`);
    assert.deepEqual(parserResults.sparse, { rows: 3, columns: 2, totalRows: 1_048_576, totalColumns: 16384 });
    await page.setViewportSize({ width: 390, height: 844 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Office previews fit narrow layouts");
    await page.locator("#workbook").screenshot({ path: "/tmp/vic-office-workbook.png" });
    await page.locator("#slides").screenshot({ path: "/tmp/vic-office-slides.png" });
    assert.deepEqual(errors, []); assert.deepEqual(external, []);
  } finally { await browser?.close(); await server.close(); }
});
