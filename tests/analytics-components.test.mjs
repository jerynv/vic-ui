import assert from "node:assert/strict";
import test from "node:test";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { MetricSummary, TraceWaterfall, WorkspaceHeader } from "../dist/index.js";

test("WorkspaceHeader exposes semantic title, description and action slots", () => {
  const html = renderToString(h(WorkspaceHeader, { title: "Usage", description: "Recent activity", action: h("button", null, "Download"), id: "head" }));
  assert.match(html, /<header[^>]*id="head"/);
  assert.match(html, /<h1>Usage<\/h1>/);
  assert.match(html, /<p>Recent activity<\/p>/);
  assert.match(html, /<button>Download<\/button>/);
  const embedded = renderToString(h(WorkspaceHeader, { as: "div", role: "banner", title: "Usage" }));
  assert.match(embedded, /^<div[^>]*role="banner"/);
});

test("TraceWaterfall plots overlapping spans on the shared wall-time extent", () => {
  const html = renderToString(h(TraceWaterfall, {
    extentMs: 100,
    spans: [
      { id: "parent", label: "Parent", offsetMs: 0, durationMs: 100, status: "ok" },
      { id: "child", label: "Child", detail: "worker", offsetMs: 25, durationMs: 50, status: "error" },
    ],
    renderStatus: (status) => h("b", null, status.toUpperCase()),
  }));
  assert.match(html, /aria-label="Trace timing"/);
  assert.match(html, /inset-inline-start:25%;width:50%/);
  assert.match(html, /<b>ERROR<\/b>/);
  assert.match(html, /50 ms · start \+25 ms/);
});

test("TraceWaterfall reports invalid timing without inventing a bar", () => {
  const html = renderToString(h(TraceWaterfall, { extentMs: 0, spans: [{ id: "unknown", label: "Unknown", offsetMs: NaN, durationMs: -1 }] }));
  assert.match(html, /Timing unavailable/);
  assert.doesNotMatch(html, /ui-trace-waterfall-track/);
});

test("MetricSummary renders caller-formatted values as a labeled definition list", () => {
  const html = renderToString(h(MetricSummary, { items: [{ label: "Sessions", value: "1,234", description: "This month", action: h("a", { href: "/sessions" }, "Details") }] }));
  assert.match(html, /<section[^>]*aria-label="Summary metrics"/);
  assert.match(html, /<dt>Sessions<\/dt><dd><span class="ui-metric-summary-value">1,234<\/span>/);
  assert.match(html, /<dd>.*<div class="ui-metric-summary-description">This month<\/div>.*<div class="ui-metric-summary-action"><a href="\/sessions">Details<\/a><\/div><\/dd>/);
});
