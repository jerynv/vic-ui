import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { chromium } from "playwright";
import { TraceWaterfall } from "../dist/index.js";

test("TraceWaterfall bars share a wall-time origin across differing status text", { timeout: 30000 }, async () => {
  const css = await readFile(new URL("../src/styles/components/ui-trace-waterfall.css", import.meta.url), "utf8");
  const html = renderToString(h(TraceWaterfall, {
    extentMs: 124,
    spans: [
      { id: "root", label: "Root", offsetMs: 0, durationMs: 124, status: "Completed" },
      { id: "child", label: "Child", offsetMs: 20, durationMs: 80, status: "Failure source" },
    ],
  }));
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1100, height: 500 } });
    await page.setContent(`<style>${css}</style>${html}`);
    const measurements = await page.locator(".ui-trace-waterfall-track").evaluateAll((tracks) => tracks.map((track) => {
      const bar = track.querySelector("span");
      return { track: track.getBoundingClientRect().left, bar: bar.getBoundingClientRect().left };
    }));
    assert.equal(measurements.length, 2);
    assert.ok(Math.abs(measurements[0].track - measurements[1].track) < 1, JSON.stringify(measurements));
    assert.ok(measurements[1].bar > measurements[0].bar, "the child offset is shown from the shared origin");
    await page.setViewportSize({ width: 375, height: 700 });
    const mobile = await page.locator(".ui-trace-waterfall-row").first().evaluate((row) => ({
      status: row.querySelector(".ui-trace-waterfall-status").getBoundingClientRect(),
      timing: row.querySelector(".ui-trace-waterfall-timing").getBoundingClientRect(),
      track: row.querySelector(".ui-trace-waterfall-track").getBoundingClientRect(),
    }));
    assert.ok(mobile.status.top < mobile.timing.top, "mobile keeps status above the full-width timing row");
    assert.ok(mobile.track.width > 200, "mobile timing retains the available row width");
  } finally { await browser.close(); }
});
