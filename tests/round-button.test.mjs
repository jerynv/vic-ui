import assert from "node:assert/strict";
import test from "node:test";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { chromium } from "playwright";
import { createServer } from "vite";
import { Button, ButtonLink } from "../dist/index.js";
import { Button as ComposableButton } from "../dist/ui.js";

test("button rims and faces stay concentric across shapes, contexts and states", { timeout: 90000 }, async () => {
  const cases = [];
  for (const size of ["md", "lg"]) for (const [look, variant] of [["quiet", "ghost"], ["line", "outline"], ["ink", "default"]]) {
    for (const [shape, square, round] of [["standard", false, false], ["square", true, false], ["round", true, true], ["pill", false, true]]) {
      for (const [api, Component, props] of [
        ["native", Button, { look, size, square }],
        ["link", ButtonLink, { look, size, square, href: "#destination" }],
        ["composable", ComposableButton, { variant, size: square ? (size === "lg" ? "icon-lg" : "icon") : size }],
      ]) {
        const id = `${api}-${look}-${size}-${shape}`;
        const child = square ? h("svg", { width: 16, height: 16, "aria-hidden": true }) : "Continue";
        cases.push({ id, square, round, element: h(Component, { ...props, id, round, "aria-label": id }, child) });
      }
    }
  }
  for (const context of ["ui-actionbar", "file"]) for (const look of ["ink", "line", "quiet"]) for (const round of [false, true]) {
    const id = `${context}-${look}-${round}`;
    const button = h(Button, { id, look, tone: look === "ink" ? "accent" : undefined, style: { "--button-accent": "oklch(.5 .075 240)", "--button-on-accent": "white" }, square: true, round, className: context === "file" ? "ui-tile-download" : undefined, "aria-label": id }, h("svg", { width: 16, height: 16 }));
    cases.push({ id, square: true, round, element: h("div", { className: context, style: { position: "relative", width: 40, height: 40 } }, button) });
  }
  for (const radius of ["0px", "1px", "4px", "20px"]) {
    const id = `accent-radius-${parseInt(radius)}`;
    cases.push({ id, element: h(Button, { id, tone: "accent", style: { "--radius-button": radius, "--button-accent": "oklch(.5 .075 240)", "--button-on-accent": "white" } }, "Check and save") });
  }
  const html = renderToString(h("main", { style: { display: "flex", gap: 12, padding: 24, flexWrap: "wrap" } }, ...cases.map(c => c.element)));
  const server = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, entries: [] }, server: { host: "127.0.0.1", port: 0 }, plugins: [{
    name: "round-button-fixture", configureServer(server) { server.middlewares.use((request, response, next) => {
      if (!request.url?.startsWith("/?sheet=")) return next();
      const sheet = request.url.includes("sheet=composable") ? "ui/styles.css" : "vic-ui.css";
      response.setHeader("Content-Type", "text/html");
      response.end(`<html><head><link rel="stylesheet" href="/dist/${sheet}"><style>*{transition:none!important}</style></head><body>${html}</body></html>`);
    }); },
  }] });
  let browser;
  try {
    await server.listen(); browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
    for (const sheet of ["native", "composable"]) {
      await page.goto(`${server.resolvedUrls.local[0]}?sheet=${sheet}`);
      for (const mode of ["light", "dark"]) {
        await page.evaluate(mode => { document.documentElement.dataset.mode = mode; }, mode);
        for (const { id, square, round } of cases) {
          const button = page.locator(`#${id}`);
          await page.mouse.move(1400, 880);
          for (const state of ["rest", "hover", "press"]) {
            if (state === "hover") await button.hover();
            if (state === "press") await page.mouse.down();
            const geometry = await button.evaluate(el => {
              const nodes = [el, el.querySelector(".ui-button-face")];
              const shapes = nodes.map(node => {
                const style = getComputedStyle(node), rect = node.getBoundingClientRect();
                return { x: rect.x, y: rect.y, width: rect.width, height: rect.height,
                  radius: Math.min(parseFloat(style.borderTopLeftRadius), rect.width / 2, rect.height / 2),
                  radii: [style.borderTopLeftRadius, style.borderTopRightRadius, style.borderBottomLeftRadius, style.borderBottomRightRadius].map(parseFloat) };
              });
              return { shapes, inset: shapes[1].x - shapes[0].x, color: getComputedStyle(el).color };
            });
            if (state === "press") await page.mouse.up();
            const label = `${sheet}/${mode}/${id}/${state}`;
            if (id.includes("-ink-") && (id.startsWith("ui-actionbar-") || id.startsWith("file-"))) assert.equal(geometry.color, "rgb(255, 255, 255)", `${label}: explicit on-accent foreground`);
            const [rim, face] = geometry.shapes;
            const { inset } = geometry;
            assert.ok(Math.abs(face.y - rim.y - inset) < .1, `${label}: equal horizontal/vertical inset`);
            assert.ok(Math.abs(rim.width - face.width - 2 * inset) < .1, `${label}: face inset on both sides`);
            assert.ok(Math.abs(rim.height - face.height - 2 * inset) < .1, `${label}: face inset top/bottom`);
            assert.ok(Math.abs(face.radius - Math.max(0, rim.radius - inset)) < .1,
              `${label}: concentric corners, outer ${rim.radius}, inner ${face.radius}, actual inset ${inset}`);
            for (const shape of geometry.shapes) {
              assert.ok(shape.radii.every(radius => radius === shape.radii[0]), `${label}: all corners agree`);
              if (square) assert.ok(Math.abs(shape.width - shape.height) < 1, `${label}: square bounds`);
              if (round) assert.ok(shape.radii.every(radius => radius >= Math.min(shape.width, shape.height) / 2), `${label}: round corners`);
            }
          }
        }
      }
    }
  } finally { await browser?.close(); await server.close(); }
});
