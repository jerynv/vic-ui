import assert from "node:assert/strict";
import test from "node:test";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { MetricSummary, WorkspaceHeader } from "../dist/index.js";

test("WorkspaceHeader exposes semantic title, description and action slots", () => {
  const html = renderToString(h(WorkspaceHeader, { title: "Usage", description: "Recent activity", action: h("button", null, "Download"), id: "head" }));
  assert.match(html, /<header[^>]*id="head"/);
  assert.match(html, /<h1>Usage<\/h1>/);
  assert.match(html, /<p>Recent activity<\/p>/);
  assert.match(html, /<button>Download<\/button>/);
  const embedded = renderToString(h(WorkspaceHeader, { as: "div", role: "banner", title: "Usage" }));
  assert.match(embedded, /^<div[^>]*role="banner"/);
});

test("MetricSummary renders caller-formatted values as a labeled definition list", () => {
  const html = renderToString(h(MetricSummary, { items: [{ label: "Sessions", value: "1,234", description: "This month", action: h("a", { href: "/sessions" }, "Details") }] }));
  assert.match(html, /<section[^>]*aria-label="Summary metrics"/);
  assert.match(html, /<dt>Sessions<\/dt><dd><span class="ui-metric-summary-value">1,234<\/span>/);
  assert.match(html, /<dd>.*<div class="ui-metric-summary-description">This month<\/div>.*<div class="ui-metric-summary-action"><a href="\/sessions">Details<\/a><\/div><\/dd>/);
});
