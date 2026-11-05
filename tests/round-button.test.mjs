import assert from "node:assert/strict";
import test from "node:test";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { chromium } from "playwright";
import { createServer } from "vite";
import { Button, ButtonLink } from "../dist/index.js";
import { Button as ComposableButton } from "../dist/ui.js";

test("round buttons keep circular rims and faces at rest, hover and press", { timeout: 45000 }, async () => {
  const cases = [];
  for (const size of ["md", "lg"]) for (const [look, variant] of [["quiet", "ghost"], ["line", "outline"], ["ink", "default"]]) {
    for (const [api, Component, props] of [
      ["native", Button, { look, size, square: true }],
      ["link", ButtonLink, { look, size, square: true, href: "#destination" }],
      ["composable", ComposableButton, { variant, size: size === "lg" ? "icon-lg" : "icon" }],
    ]) {
      const id = `${api}-${look}-${size}`;
      cases.push({ id, element: h(Component, { ...props, id, round: true, "aria-label": id }, h("svg", { width: 16, height: 16, "aria-hidden": true })) });
    }
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
        for (const { id } of cases) {
          const button = page.locator(`#${id}`);
          await page.mouse.move(1400, 880);
          for (const state of ["rest", "hover", "press"]) {
            if (state === "hover") await button.hover();
            if (state === "press") await page.mouse.down();
            const shapes = await button.evaluate(el => [el, el.querySelector(".ui-button-face")].map(node => {
              const style = getComputedStyle(node), rect = node.getBoundingClientRect();
              return { width: rect.width, height: rect.height, radii: [style.borderTopLeftRadius, style.borderTopRightRadius, style.borderBottomLeftRadius, style.borderBottomRightRadius].map(parseFloat) };
            }));
            if (state === "press") await page.mouse.up();
            for (const shape of shapes) {
              const label = `${sheet}/${mode}/${id}/${state}`;
              assert.ok(Math.abs(shape.width - shape.height) < 1, `${label}: square bounds`);
              assert.ok(shape.radii.every(radius => radius >= shape.width / 2), `${label}: circular corners, got ${shape.radii}`);
            }
          }
        }
      }
    }
  } finally { await browser?.close(); await server.close(); }
});
