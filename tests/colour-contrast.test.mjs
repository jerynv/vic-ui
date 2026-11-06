import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { chromium } from "playwright";
import { Announcement, Badge, Button, Count, Progress, Switch, Tabs, TraceWaterfall } from "../dist/index.js";

// The contrast rule, measured on the colours Chromium resolves from the built stylesheet, in both
// modes: every tone ink and the accent ink at 5.8:1 or more on the canvas, the panel and its own
// tint, and the words on a solid tone or on the accent likewise. WCAG 2 relative luminance, as
// W3C G18 gives it: https://www.w3.org/WAI/WCAG21/Techniques/general/G18
const MIN = 5.8;
const TONES = ["danger", "caution", "settled", "moving"];

function luminance(rgb) {
  const [r, g, b] = rgb.slice(0, 3).map(byte => byte / 255).map(v => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

const pieces = h("main", { id: "pieces" },
  h(Badge, { id: "badge", tone: "accent" }, "new"),
  h(Badge, { id: "badge-solid", tone: "accent", solid: true }, "Beta"),
  h(Badge, { id: "badge-soft", tone: "accent", soft: true }, "Preview"),
  h(Count, { tone: "accent", value: 3, label: "3 new", className: "count" }),
  h(Count, { tone: "accent", soft: true, value: 4, label: "4 new", className: "count-soft" }),
  h(Switch, { id: "switch", tone: "accent", checked: true, "aria-label": "Accent on" }),
  h(Switch, { id: "switch-ink", checked: true, "aria-label": "Ink on" }),
  h(Progress, { label: "Uploading", value: 40, tone: "accent", className: "progress" }),
  h(Tabs, { tone: "accent", "aria-label": "Views", items: { list: "List", board: "Board" }, value: "list", className: "tabs" }),
  h(Button, { id: "button", tone: "accent" }, "Send"),
  h(Announcement, { href: "#", tag: "New", tone: "accent", hue: "sage", className: "announcement" }, "Calls in every group"),
  h(TraceWaterfall, { className: "trace", extentMs: 100, spans: [{ id: "ok", label: "Fetch", offsetMs: 0, durationMs: 40, status: "ok" }, { id: "error", label: "Render", offsetMs: 40, durationMs: 60, status: "error" }] }),
);

async function open(browser, sheet) {
  const css = await readFile(new URL(`../dist/${sheet}`, import.meta.url), "utf8");
  const page = await browser.newPage({ reducedMotion: "reduce" });
  await page.setContent(`<html data-mode="light"><head><style>${css}</style><style>*{transition:none!important}</style></head><body>${renderToStaticMarkup(pieces)}</body></html>`);
  // Paints an expression on a probe inside `within` and reads it back as sRGB bytes, so every
  // light-dark(), color-mix() and var() is resolved where the piece would resolve it.
  await page.evaluate(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    window.rgba = color => { ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = color; ctx.fillRect(0, 0, 1, 1); return [...ctx.getImageData(0, 0, 1, 1).data]; };
    window.paint = (expression, within = document.body) => {
      const probe = document.createElement("span");
      probe.style.backgroundColor = expression;
      (typeof within === "string" ? document.querySelector(within) : within).append(probe);
      const color = window.rgba(getComputedStyle(probe).backgroundColor);
      probe.remove();
      return color;
    };
    window.styleOf = (selector, property) => window.rgba(getComputedStyle(document.querySelector(selector))[property]);
  });
  return page;
}

test("tone and accent inks hold 5.8:1 in both modes, and the accent pieces read the accent", { timeout: 60000 }, async t => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await open(browser, "vic-ui.css");
    let lowest = Infinity;
    for (const mode of ["light", "dark"]) {
      await page.evaluate(mode => { document.documentElement.dataset.mode = mode; }, mode);
      const read = expression => page.evaluate(expression => window.paint(expression), expression);
      const canvas = await read("var(--bg-canvas)"), panel = await read("var(--bg-base)");
      const families = [
        ...TONES.map(tone => ({ name: tone, ink: `var(--tone-${tone}-ink)`, tint: `var(--tone-${tone}-tint)`, on: "var(--tone-on)", fill: `var(--tone-${tone}-ink)` })),
        { name: "accent", ink: "var(--accent-ink)", tint: "var(--accent-tint)", on: "var(--accent-on)", fill: "var(--accent)" },
      ];
      for (const family of families) {
        const ink = await read(family.ink), tint = await read(family.tint), on = await read(family.on), fill = await read(family.fill);
        const pairs = { "ink on canvas": [ink, canvas], "ink on panel": [ink, panel], "ink on its tint": [ink, tint], "words on the fill": [on, fill], "words on the ink": [on, ink] };
        for (const [what, [a, b]] of Object.entries(pairs)) {
          const ratio = contrast(a, b);
          lowest = Math.min(lowest, ratio);
          assert.ok(ratio >= MIN, `${mode} ${family.name} ${what}: ${ratio.toFixed(2)}:1`);
        }
        t.diagnostic(`${mode} ${family.name}: ${Object.entries(pairs).map(([what, [a, b]]) => `${what} ${contrast(a, b).toFixed(2)}`).join(", ")}`);
      }

      // The accent is its own colour: not moving's ink, tint or fill.
      for (const [accent, moving] of [["--accent", "--tone-moving-ink"], ["--accent-ink", "--tone-moving-ink"], ["--accent-tint", "--tone-moving-tint"]])
        assert.notDeepEqual(await read(`var(${accent})`), await read(`var(${moving})`), `${mode}: ${accent} is not ${moving}`);

      // The button's accent slots are left undeclared, so the button falls back to the family,
      // and each piece draws from it.
      assert.deepEqual(await page.evaluate(() => ["--button-accent", "--button-on-accent"].map(name => getComputedStyle(document.querySelector("#button")).getPropertyValue(name))), ["", ""], "the button accent slots are not declared");
      assert.deepEqual(await page.evaluate(() => window.paint("var(--ink-face-top)", "#button")), await read("color-mix(in oklab, var(--accent), white 4%)"), "accent button face reads --accent");
      const accent = await read("var(--accent)"), accentInk = await read("var(--accent-ink)"), accentOn = await read("var(--accent-on)"), accentTint = await read("var(--accent-tint)");
      const style = (selector, property) => page.evaluate(([selector, property]) => window.styleOf(selector, property), [selector, property]);
      assert.deepEqual(await style("#badge", "color"), accentInk, "hairline badge words");
      assert.deepEqual(await style("#badge-solid", "backgroundColor"), accentInk, "solid badge fill");
      assert.deepEqual(await style("#badge-solid", "color"), accentOn, "solid badge words");
      assert.deepEqual(await style("#badge-soft", "backgroundColor"), accentTint, "soft badge ground");
      assert.deepEqual(await style(".count", "backgroundColor"), accentInk, "count fill");
      assert.deepEqual(await style(".count-soft", "backgroundColor"), accentTint, "soft count ground");
      assert.deepEqual(await style("#switch", "backgroundColor"), accent, "switch track");
      assert.notDeepEqual(await style("#switch-ink", "backgroundColor"), accent, "a switch with no tone keeps the ink");
      assert.deepEqual(await style(".progress .ui-progress-fill", "backgroundColor"), accent, "progress fill");
      assert.deepEqual(await style(".announcement .ui-announcement-tag", "backgroundColor"), accent, "announcement tag, over its hue");
      assert.deepEqual(await style(".tabs .ui-tab[aria-selected='true']", "color"), accentOn, "chosen tab words");
      // A failed span's bar in a trace is the danger ink, whose contrast is measured above.
      const danger = await read("var(--tone-danger-ink)");
      assert.deepEqual(await style(".trace [data-status='error'] .ui-trace-waterfall-track > span", "backgroundColor"), danger, "failed span bar");
      assert.notDeepEqual(await style(".trace [data-status='ok'] .ui-trace-waterfall-track > span", "backgroundColor"), danger, "a span that did not fail is not the danger ink");
      const tabFaces = await page.evaluate(() => ["var(--ink-face-top)", "var(--ink-face-bottom)"].map(face => window.paint(face, ".tabs")));
      for (const face of tabFaces) {
        const ratio = contrast(accentOn, face);
        lowest = Math.min(lowest, ratio);
        assert.ok(ratio >= MIN, `${mode} chosen tab words on the accent indicator: ${ratio.toFixed(2)}:1`);
      }

      // The accent button, at rest, hovered and pressed: its words on every face stop.
      const words = await style("#button", "color");
      assert.deepEqual(words, accentOn, "accent button words");
      const faces = await page.evaluate(() => ["top", "bottom", "top-hover", "bottom-hover", "top-press", "bottom-press"].map(stop => window.paint(`var(--ink-face-${stop})`, "#button")));
      let button = Infinity;
      for (const face of faces) button = Math.min(button, contrast(words, face));
      assert.ok(button >= MIN, `${mode} accent button words on its faces: ${button.toFixed(2)}:1`);
      t.diagnostic(`${mode} accent button: lowest words on face ${button.toFixed(2)}`);
    }
    t.diagnostic(`Lowest contrast held: ${lowest.toFixed(2)}:1`);
    await page.close();
  } finally {
    await browser.close();
  }
});

test("the surface stack, the deprecated ground and the art tokens resolve in both modes", { timeout: 30000 }, async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await open(browser, "vic-ui.css");
    const seen = {};
    for (const mode of ["light", "dark"]) {
      await page.evaluate(mode => { document.documentElement.dataset.mode = mode; }, mode);
      const read = expression => page.evaluate(expression => window.paint(expression), expression);
      assert.deepEqual(await read("var(--bg-frame)"), await read(mode === "light" ? "oklch(0.962 0 0)" : "oklch(0.09 0 0)"), `${mode} frame`);
      assert.notDeepEqual(await read("var(--bg-frame)"), await read("var(--bg-canvas)"), `${mode}: the frame is not the canvas`);
      assert.equal((await read("var(--bg-elevated)"))[3], 255, "the deprecated ground still resolves until 0.4");
      seen[mode] = await Promise.all([1, 2, 3, 4].map(n => read(`var(--art-${n})`)));
      assert.equal(new Set(seen[mode].map(String)).size, 4, `${mode}: four art hues`);
      const grain = await page.evaluate(() => Number(getComputedStyle(document.documentElement).getPropertyValue("--art-grain")));
      assert.ok(grain > 0 && grain < 1, "the grain is an alpha");
    }
    // Pale in light, deep in dark.
    for (let n = 0; n < 4; n++) assert.ok(luminance(seen.light[n]) > 0.5 && luminance(seen.dark[n]) < 0.1, `--art-${n + 1}`);
    await page.close();
  } finally {
    await browser.close();
  }
});

test("the composable sheet keeps shadcn's hover grey apart from vic's accent", { timeout: 30000 }, async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await open(browser, "ui/styles.css");
    for (const mode of ["light", "dark"]) {
      await page.evaluate(mode => { document.documentElement.dataset.mode = mode; }, mode);
      const read = expression => page.evaluate(expression => window.paint(expression), expression);
      assert.deepEqual(await read("var(--accent)"), await read("light-dark(oklch(0.48 0.19 262), oklch(0.76 0.12 258))"), `${mode}: --accent is the brand accent`);
      assert.deepEqual(await page.evaluate(() => window.styleOf("#switch", "backgroundColor")), await read("var(--accent)"));
    }
    await page.close();
  } finally {
    await browser.close();
  }
});
