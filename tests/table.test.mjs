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
