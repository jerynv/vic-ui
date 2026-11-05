import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { chromium } from "playwright";
import { createServer } from "vite";
import { AccentFixture } from "./accent-button.fixture.mjs";

// W3C G18's sRGB luminance and contrast calculation, applied to browser-rendered colors.
// https://www.w3.org/WAI/WCAG21/Techniques/general/G18
function luminance(rgb) {
  const linear = rgb.slice(0, 3).map(byte => byte / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  return linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722;
}
function contrast(a, b) { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }
async function appearance(locator) {
  return locator.evaluate(button => {
    const outer = getComputedStyle(button), face = getComputedStyle(button.querySelector(".ui-button-face"));
    const canvas = document.createElement("canvas"); canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const rgba = color => { ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = color; ctx.fillRect(0, 0, 1, 1); return [...ctx.getImageData(0, 0, 1, 1).data]; };
    return { face: ["--face-top", "--face-bottom"].map(key => rgba(face.getPropertyValue(key))),
      rim: ["--rim-top", "--rim-bottom"].map(key => rgba(outer.getPropertyValue(key))),
      edge: rgba(outer.borderTopColor), text: rgba(outer.color) };
  });
}

test("accent buttons preserve texture, contrast and behavior across both APIs and themes", { timeout: 60000 }, async t => {
  const html = renderToString(createElement(AccentFixture));
  const server = await createServer({ configFile: false, cacheDir: "node_modules/.vite-accent-test",
    optimizeDeps: { entries: ["tests/accent-button-hydrate.fixture.mjs"] }, server: { host: "127.0.0.1", port: 0 }, plugins: [{
      name: "accent-fixture", configureServer(server) { server.middlewares.use((request, response, next) => {
        if (request.url !== "/") return next();
        response.setHeader("Content-Type", "text/html");
        response.end(`<html data-mode="light"><head><link rel="stylesheet" href="/dist/ui/styles.css"><style>*{transition:none!important}</style></head><body><div id="root">${html}</div><script type="module" src="/tests/accent-button-hydrate.fixture.mjs"></script></body></html>`);
      }); },
    }] });
  let browser, minimum = Infinity;
  try {
    await server.listen(); browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ reducedMotion: "reduce" });
    const errors = []; page.on("pageerror", error => errors.push(error.message));
    await page.goto(server.resolvedUrls.local[0], { waitUntil: "networkidle" });
    await page.keyboard.press("Tab");
    assert.equal(await page.locator("#native").evaluate(e => e.matches(":focus-visible") && getComputedStyle(e).outlineWidth === "2px"), true);
    for (const mode of ["light", "dark"]) {
      await page.evaluate(mode => { document.documentElement.dataset.mode = mode; }, mode);
      const mono = await appearance(page.locator("#mono"));
      for (const highContrast of [false, true]) for (const hue of [25, 80, 145, 240, 300]) {
        await page.locator("#accent").evaluate((el, { mode, highContrast, hue }) => {
          const l = mode === "light" ? (highContrast ? .43 : .5) : (highContrast ? .82 : .74);
          el.style.setProperty("--button-accent", `oklch(${l} .075 ${hue})`);
          el.style.setProperty("--button-on-accent", `oklch(${mode === "light" ? .97 : .205} 0 0)`);
        }, { mode, highContrast, hue });
        const states = [];
        for (const state of ["rest", "hover", "pressed"]) {
          const results = [];
          for (const id of ["native", "composable"]) {
            const button = page.locator(`#${id}`);
            await page.mouse.move(1200, 700);
            if (state !== "rest") await button.hover();
            if (state === "pressed") await page.mouse.down();
            const style = await appearance(button);
            if (state === "pressed") await page.mouse.up();
            assert.notDeepEqual(style.face[0], style.face[1], `${mode}/${hue}/${state}: distinct face stops`);
            assert.notDeepEqual(style.rim[0], style.rim[1], `${mode}/${hue}/${state}: distinct rim stops`);
            for (const color of [...style.rim, style.edge]) assert.ok(Math.max(...color.slice(0, 3)) - Math.min(...color.slice(0, 3)) > 5, "rim and edge inherit the accent hue");
            assert.equal(style.text[3], 255, "the explicit on-accent foreground is opaque");
            for (const color of style.face) {
              const ratio = contrast(style.text, color); minimum = Math.min(minimum, ratio);
              assert.ok(ratio >= 4.5, `${mode}/${highContrast}/${hue}/${state}: ${ratio.toFixed(2)}:1`);
            }
            results.push(style);
          }
          assert.deepEqual(results[0], results[1], "native and composable appearances agree"); states.push(results[0]);
        }
        assert.notDeepEqual(states[0].face, states[1].face, "hover changes the face");
        assert.notDeepEqual(states[1].face, states[2].face, "press changes the face");
        await page.mouse.move(1200, 700);
        assert.deepEqual(await appearance(page.locator("#mono")), mono, "consumer accent tokens do not recolor the default");
        for (const id of ["link", "variants"]) assert.deepEqual(await appearance(page.locator(`#${id}`)), states[0]);
      }
      for (const id of ["danger", "caution", "destructive", "outline"]) for (const state of ["rest", "hover", "pressed"]) {
        const results = [];
        for (const selector of [`#${id}`, `#${id}-reference`]) {
          await page.mouse.move(1200, 700);
          if (state !== "rest") await page.locator(selector).hover();
          if (state === "pressed") await page.mouse.down();
          results.push(await appearance(page.locator(selector)));
          if (state === "pressed") await page.mouse.up();
        }
        assert.deepEqual(results[0], results[1], `${id}/${state} takes precedence over accent`);
      }
    }
    const count = await page.locator("#result").textContent();
    for (const id of ["disabled", "busy", "held"]) {
      const button = page.locator(`#${id}`), before = await appearance(button);
      await button.hover(); await page.mouse.down(); const pressed = await appearance(button); await page.mouse.up();
      assert.deepEqual(pressed, before); await button.dispatchEvent("click");
      assert.equal(await button.evaluate(e => getComputedStyle(e).opacity), "0.55");
    }
    assert.equal(await page.locator("#result").textContent(), count, "disabled and busy controls cannot activate");
    assert.equal(await page.locator("#busy").getAttribute("aria-busy"), "true");
    assert.equal(await page.locator("#busy .ui-button-busy-mark").count(), 1);
    assert.equal(await page.locator("#held").getAttribute("aria-disabled"), "true");
    await page.locator("#destructive-reference").focus(); await page.keyboard.press("Tab");
    assert.equal(await page.locator("#held").evaluate(e => document.activeElement === e), true);
    await page.locator('[role="tooltip"]:popover-open').waitFor();
    assert.deepEqual(errors, []); t.diagnostic(`Minimum enabled face/text contrast: ${minimum.toFixed(2)}:1`);
  } finally { await browser?.close(); await server.close(); }
});
