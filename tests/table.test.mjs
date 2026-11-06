import assert from "node:assert/strict";
import test from "node:test";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Table } from "../dist/index.js";

const columns = [{ key: "name", label: "Name", sort: true }, { key: "count", label: "Count", align: "end", sort: true }];
const rows = [{ id: "a", name: "Alpha", count: 3 }];

test("Table supports caption and only the selected row header is a scoped th", () => {
  const html = renderToString(h(Table, {
    columns, rows, rowKey: row => row.id, caption: "Usage by item", rowHeaderKey: "name",
    cell: (row, column) => `${column.key}:${row[column.key]}`,
    cellProps: (_row, column) => ({ "aria-label": `cell ${column.key}`, role: "gridcell", "data-source": "test" }),
  }));
  assert.match(html, /<caption>Usage by item<\/caption>/);
  assert.match(html, /<th aria-label="cell name" role="gridcell" data-source="test" scope="row"[^>]*>name:Alpha<\/th>/);
  assert.match(html, /<td aria-label="cell count" role="gridcell" data-source="test"[^>]*>count:3<\/td>/);
  assert.equal((html.match(/scope="row"/g) ?? []).length, 1);
});

test("Table keeps controlled sort state and caller cell rendering", () => {
  const html = renderToString(h(Table, {
    columns, rows, rowKey: row => row.id, rowHeaderKey: "name",
    sort: { key: "count", direction: "desc" }, onSortChange: () => {},
    cell: () => h("strong", null, "custom value"),
  }));
  assert.match(html, /aria-sort="descending"/);
  assert.match(html, /data-sorted="desc"/);
  assert.match(html, /<strong>custom value<\/strong>/);
  assert.match(html, /<th[^>]*scope="row"/);
});

test("a row's header cell reads as a body cell: weight, roster height, the line under a row", { timeout: 30000 }, async () => {
  const { chromium } = await import("playwright");
  const { readFile } = await import("node:fs/promises");
  const css = await readFile(new URL("../dist/vic-ui.css", import.meta.url), "utf8");
  const rows = [{ id: "a", name: "Alpha", count: 3 }, { id: "b", name: "A much longer name that would wrap in a narrow column", count: 4 }];
  const table = (look) => renderToString(h("div", look ? { "data-look": look } : {}, h(Table, {
    columns: [{ key: "name", label: "Name", width: 120 }, { key: "count", label: "Count", align: "end" }], rows, rowKey: row => row.id,
    rowHeaderKey: "name", caption: "Usage by item", after: row => row.id === "a" ? "Needs a look" : null,
  })));
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 600, height: 600 } });
    await page.setContent(`<html><head><style>${css}</style></head><body><div id="plain">${table()}</div><div id="roster">${table("roster")}</div></body></html>`);
    const facts = await page.evaluate(() => {
      const of = (box) => {
        const th = document.querySelector(`#${box} tbody th`), td = document.querySelector(`#${box} tbody td`);
        return {
          thWeight: getComputedStyle(th).fontWeight, tdWeight: getComputedStyle(td).fontWeight,
          thLine: getComputedStyle(th).borderBottomColor, tdLine: getComputedStyle(td).borderBottomColor,
          heights: [...document.querySelectorAll(`#${box} tbody tr:not(.ui-table-after)`)].map(tr => tr.getBoundingClientRect().height),
          caption: getComputedStyle(document.querySelector(`#${box} caption`)).textAlign,
        };
      };
      return { plain: of("plain"), roster: of("roster") };
    });
    assert.equal(facts.plain.thWeight, facts.plain.tdWeight, "no browser bold on the row header");
    assert.equal(facts.plain.thLine, facts.plain.tdLine, "the line under a row drops from the header cell too");
    assert.equal(facts.plain.caption, "start");
    assert.equal(new Set(facts.roster.heights).size, 1, "roster rows keep one height even with a long row header");
  } finally { await browser.close(); }
});
