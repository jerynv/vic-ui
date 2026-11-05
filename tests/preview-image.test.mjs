import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { chromium } from "playwright";
import { createServer } from "vite";
import { PreviewImageFixture } from "./preview-image.fixture.mjs";

const geometry = page => page.locator(".ui-preview-image-viewport").evaluate(el => {
  const img = el.querySelector("img"), transform = new DOMMatrix(getComputedStyle(img).transform);
  return { scale: transform.a, x: transform.e, y: transform.f, stageWidth: el.clientWidth, stageHeight: el.clientHeight,
    width: img.offsetWidth, height: img.offsetHeight, src: img.src, naturalWidth: img.naturalWidth };
});
const waitScale = (page, scale) => page.waitForFunction(expected => Math.abs(new DOMMatrix(getComputedStyle(document.querySelector(".ui-preview-image-viewport img")).transform).a - expected) < .0001, scale);
const assertBounds = value => {
  assert.ok(Math.abs(value.x) <= Math.max(0, (value.width * value.scale - value.stageWidth) / 2) + .1, "horizontal pan stays within image bounds");
  assert.ok(Math.abs(value.y) <= Math.max(0, (value.height * value.scale - value.stageHeight) / 2) + .1, "vertical pan stays within image bounds");
};

test("local image previews keep geometry, scoped controls and input lifetimes", { timeout: 90000 }, async () => {
  const html = renderToString(createElement(PreviewImageFixture));
  assert.match(html, /Loading image/);
  assert.doesNotMatch(html, /src="blob:/, "server rendering creates no browser resource");
  const server = await createServer({ configFile: false, cacheDir: "node_modules/.vite-preview-image-test",
    optimizeDeps: { entries: ["tests/preview-image-hydrate.fixture.mjs"] }, server: { host: "127.0.0.1", port: 0 }, plugins: [{
      name: "preview-image-fixture", configureServer(server) { server.middlewares.use((request, response, next) => {
        if (!request.url?.startsWith("/?")) return next();
        const sheet = request.url.includes("composable") ? "ui/styles.css" : "vic-ui.css";
        response.setHeader("Content-Type", "text/html");
        response.end(`<html data-mode="light"><head><link rel="stylesheet" href="/dist/${sheet}"></head><body><div id="root">${html}</div><script type="module" src="/tests/preview-image-hydrate.fixture.mjs"></script></body></html>`);
      }); },
    }] });
  let browser;
  try {
    await server.listen(); browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 900, height: 800 }, reducedMotion: "reduce", hasTouch: true });
    page.setDefaultTimeout(10000);
    const touch = await page.context().newCDPSession(page);
    const pageErrors = [];
    page.on("pageerror", error => pageErrors.push(error.message));
    for (const sheet of ["native", "composable"]) for (const mode of ["light", "dark"]) {
      await page.goto(`${server.resolvedUrls.local[0]}?${sheet}`, { waitUntil: "networkidle" });
      await page.evaluate(mode => { document.documentElement.dataset.mode = mode; }, mode);
      const viewport = page.locator(".ui-preview-image-viewport");
      const zoomIn = page.getByRole("button", { name: "Zoom in", exact: true });
      const fit = page.getByRole("button", { name: "Fit image", exact: true });
      await page.waitForFunction(() => document.querySelector(".ui-preview-image-viewport")?.getAttribute("aria-busy") === "false");
      const initial = await geometry(page);
      assert.equal(initial.scale, 1);
      assert.ok(initial.width <= initial.stageWidth && initial.height <= initial.stageHeight);
      assert.equal(await zoomIn.isDisabled(), false);
      assert.equal(await page.evaluate(() => window.imageScriptExecuted), undefined, "SVG stays an inert img resource");
      assert.ok(await viewport.evaluate(el => parseFloat(getComputedStyle(el.querySelector("img")).transitionDuration) <= .00001), "reduced motion has no visible image easing");
      await zoomIn.click(); await waitScale(page, 1.6);
      const zoomed = await geometry(page);
      assert.equal(zoomed.scale, 1.6);
      assertBounds(zoomed);
      await page.locator("#outside-input").focus(); await page.keyboard.press("+");
      assert.equal((await geometry(page)).scale, zoomed.scale, "keys outside the viewer do not zoom");
      await viewport.focus(); await page.keyboard.press("+"); await waitScale(page, 2.56);
      assert.ok((await geometry(page)).scale > zoomed.scale);
      assert.equal(await viewport.evaluate(el => getComputedStyle(el).outlineWidth), "2px", "keyboard focus is visible");
      await page.keyboard.press("0"); await waitScale(page, 1);
      assert.equal((await geometry(page)).scale, 1);
      const wheelAtFit = await viewport.evaluate(el => {
        const event = new WheelEvent("wheel", { deltaY: 100, bubbles: true, cancelable: true });
        el.dispatchEvent(event); return event.defaultPrevented;
      });
      assert.equal(wheelAtFit, false, "ordinary wheel at fit leaves page scrolling available");
      const rect = await viewport.boundingBox();
      await page.mouse.move(rect.x + rect.width * .65, rect.y + rect.height * .5);
      await page.keyboard.down("Control"); await page.mouse.wheel(0, -50); await page.keyboard.up("Control");
      await page.waitForFunction(() => new DOMMatrix(getComputedStyle(document.querySelector(".ui-preview-image-viewport img")).transform).a > 1);
      assert.ok((await geometry(page)).x < 0, "modifier wheel zoom anchors the pointer");
      await page.mouse.wheel(10000, 10000);
      await page.waitForFunction(() => new DOMMatrix(getComputedStyle(document.querySelector(".ui-preview-image-viewport img")).transform).f < 0);
      assertBounds(await geometry(page));
      await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2);
      await page.mouse.down(); await page.mouse.move(rect.x + rect.width + 500, rect.y + rect.height + 500); await page.mouse.up();
      assertBounds(await geometry(page));
      await fit.click(); await waitScale(page, 1);
      const touchPoint = fraction => ({ x: rect.x + rect.width * fraction, y: rect.y + rect.height / 2 });
      await touch.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ ...touchPoint(.4), id: 1 }, { ...touchPoint(.6), id: 2 }] });
      await touch.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ ...touchPoint(.25), id: 1 }, { ...touchPoint(.75), id: 2 }] });
      await touch.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await page.waitForFunction(() => new DOMMatrix(getComputedStyle(document.querySelector(".ui-preview-image-viewport img")).transform).a > 1);
      assertBounds(await geometry(page));
      await fit.click(); await waitScale(page, 1);
      for (let tap = 0; tap < 2; tap++) {
        await touch.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ ...touchPoint(.5), id: 1 }] });
        await touch.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      }
      await waitScale(page, 2.5);
      await fit.click(); await waitScale(page, 1);
      await viewport.dblclick({ position: { x: rect.width / 2, y: rect.height / 2 } });
      await waitScale(page, 2.5);
      assert.equal((await geometry(page)).scale, 2.5, "double click zooms into the image");
      await page.evaluate(() => { document.getElementById("image-host").style.width = "280px"; });
      await page.waitForFunction(() => document.querySelector(".ui-preview-image-viewport").clientWidth === 280);
      assertBounds(await geometry(page));
      await page.evaluate(() => { document.getElementById("image-host").style.width = "600px"; });
      await page.waitForFunction(() => document.querySelector(".ui-preview-image-viewport").clientWidth === 600);
      assertBounds(await geometry(page));
      await viewport.evaluate(el => { const editor = document.createElement("span"); editor.contentEditable = "true"; editor.id = "inline-editor"; editor.textContent = "Note"; el.append(editor); });
      const beforeEditing = (await geometry(page)).scale;
      await page.locator("#inline-editor").focus(); await page.keyboard.press("+");
      assert.equal((await geometry(page)).scale, beforeEditing, "editable descendants keep their keys");
      await page.locator("#inline-editor").evaluate(el => el.remove());
      await page.getByRole("button", { name: "portrait", exact: true }).click();
      await page.waitForFunction(() => document.querySelector(".ui-preview-image-viewport img")?.naturalWidth === 600);
      await page.waitForFunction(() => new DOMMatrix(getComputedStyle(document.querySelector(".ui-preview-image-viewport img")).transform).a > 1);
      const tall = await geometry(page);
      assert.ok(tall.scale > 1 && tall.y > 0, "a tall image opens at reading width with its top visible");
      assertBounds(tall);
      await page.keyboard.press("+");
      await page.getByRole("button", { name: "view", exact: true }).click();
      await page.waitForFunction(() => document.querySelector(".ui-preview-image-viewport img")?.naturalWidth === 1200);
      assert.equal((await geometry(page)).scale, 1, "input changes reset zoom and preserve a typed-array view's exact bytes");
      const beforeError = await page.evaluate(() => window.imageUrls.length);
      await page.getByRole("button", { name: "invalid", exact: true }).click();
      await page.getByText("Image could not be displayed", { exact: true }).waitFor();
      assert.equal(await zoomIn.isDisabled(), true);
      assert.equal(await page.locator("#errors").textContent(), "1");
      await page.evaluate(() => window.repairImage());
      await page.getByRole("button", { name: "Try again", exact: true }).click();
      await page.waitForFunction(() => document.querySelector(".ui-preview-image-viewport img")?.naturalWidth === 1200);
      assert.ok(await page.evaluate(before => window.imageUrls.length >= before + 2, beforeError), "retry creates a fresh resource and decode attempt");
      assert.equal((await geometry(page)).scale, 1);
      await page.getByRole("button", { name: "Toggle image", exact: true }).click();
      assert.equal(await viewport.count(), 0);
      assert.deepEqual(await page.evaluate(() => ({ active: window.imageUrls.filter(url => !window.imageRevoked.includes(url)), callerRevoked: window.imageRevoked.includes(window.callerUrl) })),
        { active: [], callerRevoked: false }, "replacement/retry/unmount revoke only owned URLs");
    }
    await page.goto(`${server.resolvedUrls.local[0]}?native`, { waitUntil: "networkidle" });
    const urlCount = () => page.evaluate(() => window.imageUrls.length);
    const oversized = page.getByText("Image exceeds preview limit", { exact: true });
    for (const input of ["oversized", "oversizedBlob"]) {
      const before = await urlCount();
      await page.getByRole("button", { name: input, exact: true }).click();
      await oversized.waitFor();
      assert.equal(await urlCount(), before, `${input}: rejected before object URL creation`);
      assert.match(await page.locator("#last-error").textContent(), /20,971,520 encoded bytes/);
      assert.equal(await page.getByRole("button", { name: "Try again", exact: true }).count(), 0, "unchanged oversized input has no ineffective retry");
    }
    const beforeRaised = await urlCount();
    await page.getByRole("button", { name: "Raised budget", exact: true }).click();
    assert.equal(await oversized.count(), 1, "callers cannot raise the hard limit");
    assert.equal(await urlCount(), beforeRaised);
    await page.getByRole("button", { name: "view", exact: true }).click();
    await page.waitForFunction(() => document.querySelector(".ui-preview-image-viewport img")?.naturalWidth === 1200);
    const beforeLower = await urlCount();
    await page.getByRole("button", { name: "Small budget", exact: true }).click();
    await oversized.waitFor();
    assert.equal(await urlCount(), beforeLower, "lower caller budget is checked before copying bytes or creating a URL");
    await page.getByRole("button", { name: "Exact view budget", exact: true }).click();
    await page.waitForFunction(() => document.querySelector(".ui-preview-image-viewport img")?.naturalWidth === 1200);
    assert.equal(await urlCount(), beforeLower + 1, "budget counts view.byteLength, not its larger backing buffer");
    await page.getByRole("button", { name: "Small budget", exact: true }).click();
    await oversized.waitFor();
    await page.getByRole("button", { name: "Invalid budget", exact: true }).click();
    await page.waitForFunction(() => document.querySelector(".ui-preview-image-viewport img")?.naturalWidth === 1200);
    assert.equal(await oversized.count(), 0, "invalid limits fall back to the hard maximum");
    assert.deepEqual(pageErrors, []);
  } finally { await browser?.close(); await server.close(); }
});
