import assert from "node:assert/strict";
import test from "node:test";
import { writeFile } from "node:fs/promises";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { chromium } from "playwright";
import { createServer } from "vite";
import { MediaPreviewFixture } from "./media-preview.fixture.mjs";

const audioReady = page => page.waitForFunction(() => document.querySelector("audio")?.readyState >= 1 && !document.querySelector("#audio [aria-busy=true]"));

test("native media previews decode real audio/video, isolate lifecycle and enforce ready-input budgets", { timeout: 60000 }, async () => {
  const html = renderToString(createElement(MediaPreviewFixture));
  assert.ok(html.includes("Loading audio"), "SSR reserves a native-player loading state");
  const server = await createServer({ configFile: false, cacheDir: "node_modules/.vite-media-preview-test",
    optimizeDeps: { entries: ["tests/media-preview-hydrate.fixture.mjs"] }, server: { host: "127.0.0.1", port: 0 }, plugins: [{
      name: "media-preview-fixture", configureServer(server) { server.middlewares.use((request, response, next) => {
        if (!request.url?.startsWith("/?")) return next();
        const sheet = request.url.includes("composable") ? "ui/styles.css" : "vic-ui.css";
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(`<html><head><link rel="stylesheet" href="/dist/${sheet}"></head><body><div id="root">${html}</div><script type="module" src="/tests/media-preview-hydrate.fixture.mjs"></script></body></html>`);
      }); },
    }] });
  let browser;
  try {
    await server.listen(); browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 960, height: 800 }, reducedMotion: "reduce" });
    page.setDefaultTimeout(5000);
    const errors = []; page.on("pageerror", error => errors.push(error.message));
    await page.addInitScript(() => {
      window.mediaResources = { created: [], revoked: [], lifecycle: [] };
      const create = URL.createObjectURL.bind(URL), revoke = URL.revokeObjectURL.bind(URL);
      URL.createObjectURL = blob => { const url = create(blob); window.mediaResources.created.push({ url, size: blob.size, type: blob.type }); return url; };
      URL.revokeObjectURL = url => { window.mediaResources.revoked.push(url); window.mediaResources.lifecycle.push(["revoke", url]); revoke(url); };
      for (const method of ["pause", "load"]) {
        const original = HTMLMediaElement.prototype[method];
        HTMLMediaElement.prototype[method] = function (...args) { window.mediaResources.lifecycle.push([method, this.getAttribute("src")]); return original.apply(this, args); };
      }
      window.hostMediaUrl = URL.createObjectURL(new Blob(["host-owned"]));
    });
    for (const sheet of ["native", "composable"]) for (const mode of ["light", "dark"]) {
      await page.goto(`${server.resolvedUrls.local[0]}?${sheet}`, { waitUntil: "networkidle" });
      await page.evaluate(mode => { document.documentElement.dataset.mode = mode; }, mode);
      await audioReady(page);
      await page.waitForFunction(() => document.querySelector("video")?.videoWidth === 320 && !document.querySelector("#video [aria-busy=true]"));
      assert.equal(await page.locator("#video-error").textContent(), "");
      assert.equal(await page.getByLabel("Recorded tone", { exact: true }).getAttribute("preload"), "metadata");
      assert.equal(await page.getByLabel("Recorded canvas", { exact: true }).getAttribute("playsinline"), "");
      assert.ok(await page.locator("audio").evaluate(media => media.controls && !media.autoplay && Math.abs(media.duration - 0.6) < 0.01));
      assert.ok(await page.locator("video").evaluate(media => media.controls && !media.autoplay && media.videoHeight === 180));
      await page.locator("#play-audio").click();
      await page.waitForFunction(() => document.querySelector("audio").currentTime > 0.1);
      await page.locator("audio").evaluate(media => { media.pause(); media.currentTime = 0.3; });
      await page.waitForFunction(() => !document.querySelector("audio").seeking && document.querySelector("audio").currentTime >= 0.29);
      await page.locator("#play-video").click();
      await page.waitForFunction(() => document.querySelector("video").currentTime > 0.1);
      await page.locator("video").evaluate(media => { media.pause(); media.currentTime = 0.2; });
      await page.waitForFunction(() => !document.querySelector("video").seeking && document.querySelector("video").currentTime >= 0.19);

      const firstVideo = await page.locator("video").getAttribute("src");
      await page.locator("video").dispatchEvent("error");
      await page.locator("#video").getByRole("alert").waitFor();
      await page.locator("#video").getByRole("button", { name: "Try again" }).click();
      await page.waitForFunction(() => document.querySelector("video")?.videoWidth === 320 && !document.querySelector("#video [aria-busy=true]"));
      assert.notEqual(await page.locator("video").getAttribute("src"), firstVideo);
      assert.ok(await page.locator("video").evaluate(media => document.activeElement === media));

      // A browser failure must reset the same input rather than keeping a stale failed player.
      const first = await page.locator("audio").getAttribute("src");
      await page.locator("audio").dispatchEvent("error");
      await page.locator("#audio").getByRole("alert").waitFor();
      await page.locator("#audio").getByRole("button", { name: "Try again" }).click();
      await audioReady(page);
      assert.notEqual(await page.locator("audio").getAttribute("src"), first);
      assert.ok(await page.locator("audio").evaluate(media => document.activeElement === media), "retry returns focus to the ready player");
      assert.ok(await page.evaluate(url => window.mediaResources.revoked.includes(url), first));

      // The old element cannot report errors against the next ready input.
      await page.evaluate(() => { window.oldAudio = document.querySelector("audio"); });
      await page.locator("#blob").click(); await audioReady(page);
      const errorCount = await page.locator("#errors").textContent();
      await page.evaluate(() => { window.oldAudio.dispatchEvent(new Event("error")); window.oldAudio.dispatchEvent(new Event("loadedmetadata")); });
      assert.equal(await page.locator("#errors").textContent(), errorCount);
      await page.locator("#sniff").click(); await audioReady(page);
      assert.ok(await page.locator("audio").evaluate(media => media.duration > 0));

      for (const trigger of ["html", "svg", "wrong-kind", "small", "oversized"]) {
        const before = await page.evaluate(() => window.mediaResources.created.length);
        await page.locator(`#${trigger}`).click();
        await page.locator("#audio").getByText("Audio preview unavailable", { exact: true }).waitFor();
        assert.equal(await page.locator("#audio audio").count(), 0);
        assert.equal(await page.evaluate(() => window.mediaResources.created.length), before, "invalid inputs never allocate an object URL");
      }
      await page.locator("#exact").click(); await audioReady(page);
      await page.locator("#invalid").click();
      await page.locator("#audio").getByRole("alert").waitFor();
      const priorRetry = await page.evaluate(() => window.mediaResources.created.length);
      await page.locator("#audio").getByRole("button", { name: "Try again" }).click();
      await page.locator("#audio").getByRole("alert").waitFor();
      assert.equal(await page.evaluate(() => window.mediaResources.created.length), priorRetry + 1, "retry rebuilds a fresh native resource");
      await page.locator("#good").click(); await audioReady(page);
      await page.setViewportSize({ width: 360, height: 800 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "native controls fit a narrow viewport");
      await page.setViewportSize({ width: 960, height: 800 });
      await page.locator("#unmount").click();
      const resources = await page.evaluate(() => ({ ...window.mediaResources, host: window.hostMediaUrl }));
      assert.ok(!resources.revoked.includes(resources.host), "host-owned URLs are untouched");
      const own = resources.created.map(value => value.url).filter(url => url !== resources.host);
      assert.deepEqual([...resources.revoked].sort(), own.sort(), "every owned URL is revoked once");
      for (const url of own) {
        const revokeAt = resources.lifecycle.findIndex(event => event[0] === "revoke" && event[1] === url);
        const pauseAt = resources.lifecycle.findIndex(event => event[0] === "pause" && event[1] === url);
        assert.ok(pauseAt >= 0 && pauseAt < revokeAt, "playback stops before its URL is revoked");
        assert.ok(resources.lifecycle.slice(pauseAt + 1, revokeAt).some(event => event[0] === "load" && event[1] === null), "source and decoder are reset before revoke");
      }
    }
    await page.goto(`${server.resolvedUrls.local[0]}?native`, { waitUntil: "networkidle" });
    await audioReady(page); await page.waitForFunction(() => document.querySelector("video")?.videoWidth === 320);
    await writeFile("/tmp/vic-preview-example.webm", Buffer.from(await page.evaluate(async () => Array.from(new Uint8Array(await window.mediaFixtureVideo.arrayBuffer())))));
    await page.screenshot({ path: "/tmp/vic-media-preview.png", fullPage: true });
    assert.deepEqual(errors, []);
  } finally { await browser?.close(); await server.close(); }
});
