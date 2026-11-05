import assert from "node:assert/strict";
import test from "node:test";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";
import { startFixture } from "./canonical-player-place.server.mjs";
const screenshots = process.env.CANONICAL_PLAYER_PLACE_SCREENSHOTS;
const focused = async locator => assert.ok(await locator.evaluate(el => el === document.activeElement));

async function localVideo(page) {
  await page.evaluate(async () => {
    const canvas = document.createElement("canvas"); canvas.width = 320; canvas.height = 180;
    const stream = canvas.captureStream(12), chunks = [];
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp8" });
    const ended = new Promise(resolve => { recorder.ondataavailable = event => chunks.push(event.data); recorder.onstop = () => resolve(new Blob(chunks, { type: recorder.mimeType })); });
    recorder.start(); const ctx = canvas.getContext("2d");
    for (let n = 0; n < 10; n++) { ctx.fillStyle = n % 2 ? "#24473e" : "#315c50"; ctx.fillRect(0, 0, 320, 180); await new Promise(resolve => setTimeout(resolve, 80)); }
    recorder.stop(); const video = await ended; stream.getTracks().forEach(track => track.stop());
    window.videoURL = URL.createObjectURL(video);
  });
  await page.getByRole("button", { name: "Load generated video", exact: true }).click();
  await page.waitForFunction(() => document.querySelector("video")?.videoWidth === 320);
}

test("PlacePicker honors disabled controls and exposes their reason", { timeout: 30000 }, async () => {
  const server = await startFixture(), browser = await chromium.launch();
  try {
    const page = await browser.newPage(); page.setDefaultTimeout(5000);
    await page.goto(server.resolvedUrls.local[0], { waitUntil: "networkidle" });
    const unavailable = page.getByRole("button", { name: /^Unavailable location:/ });
    assert.equal(await unavailable.isDisabled(), true);
    const explained = page.getByRole("button", { name: /^Explained location:/ });
    await explained.focus();
    assert.equal(await explained.getAttribute("aria-disabled"), "true");
    await page.getByRole("tooltip", { includeHidden: true }).filter({ hasText: "Choose an available workspace first." }).waitFor();
    const description = await explained.getAttribute("aria-describedby");
    assert.ok(description && await page.locator(`[id="${description}"]`).count() === 1);
    await page.keyboard.press("Enter");
    assert.equal(await page.getByRole("dialog").count(), 0);
    await explained.click({ force: true }); assert.equal(await page.getByRole("dialog").count(), 0);
    assert.equal(await page.locator("[data-requests]").textContent(), "0");
  } finally { await browser.close(); await server.close(); }
});

test("PlacePicker supports browsing, search, controlled choices and narrow layouts", { timeout: 120000 }, async t => {
  const server = await startFixture(), browser = await chromium.launch();
  try {
    if (screenshots) await mkdir(screenshots, { recursive: true });
    for (const sheet of ["native", "ui"]) for (const theme of ["light", "dark"]) await t.test(`${sheet}/${theme}`, async () => {
      const page = await browser.newPage({ viewport: { width: 1000, height: 1000 }, reducedMotion: "reduce" }); page.setDefaultTimeout(6000);
      const errors = []; page.on("pageerror", error => errors.push(error.message));
      await page.goto(`${server.resolvedUrls.local[0]}?sheet=${sheet}&theme=${theme}`, { waitUntil: "networkidle" });
      const trigger = page.getByRole("button", { name: /^Location:/ });
      await trigger.click();
      const popup = page.getByRole("dialog", { name: "Location", exact: true });
      const search = popup.getByRole("searchbox", { name: "Find a space or a project", exact: true });
      await focused(search);
      await page.keyboard.press("ArrowDown"); await focused(popup.getByRole("option", { name: "The whole organization", exact: true }));
      await page.keyboard.press("ArrowDown"); await focused(popup.getByRole("option", { name: "Studio 1 project", exact: true }));
      await page.keyboard.press("ArrowRight"); await popup.getByRole("listbox", { name: "In Studio", exact: true }).waitFor();
      await popup.getByRole("option", { name: "Field guide", exact: true }).click();
      await popup.waitFor({ state: "detached" }); await focused(trigger);
      await trigger.click();
      await popup.getByRole("option", { name: "Operations 1 project", exact: true }).click();
      const wholeOperations = popup.getByRole("option", { name: "Operations Only its projects", exact: true });
      assert.equal(await wholeOperations.isDisabled(), true);
      await focused(search);
      await page.keyboard.press("ArrowDown"); await focused(popup.getByRole("option", { name: "Planning", exact: true }));
      await page.keyboard.press("ArrowLeft");
      await popup.getByRole("listbox", { name: "Places", exact: true }).waitFor(); await focused(search);
      await popup.getByRole("option", { name: "Empty space", exact: true }).click();
      await popup.getByText("No projects here.", { exact: true }).waitFor();
      await popup.getByRole("button", { name: "Empty space Back", exact: true }).click(); await focused(search);
      await search.fill("planning");
      await popup.getByRole("option", { name: "Planning Operations", exact: true }).click();
      await popup.waitFor({ state: "detached" }); await focused(trigger);
      assert.equal(await trigger.getAttribute("aria-label"), "Location: Operations / Planning");
      await page.getByRole("button", { name: "Hold location", exact: true }).click();
      await trigger.click(); await popup.getByRole("option", { name: "The whole organization", exact: true }).click();
      assert.equal(await page.locator("[data-location]").textContent(), "operations/planning", "host may decline selection requests");
      await trigger.click(); await search.fill("no-matching-place");
      await popup.getByText("Nothing is called that.", { exact: true }).waitFor();
      await page.keyboard.press("Escape"); assert.equal(await search.inputValue(), "");
      await page.keyboard.press("Escape"); await popup.waitFor({ state: "detached" }); await focused(trigger);
      await page.getByRole("button", { name: /^Empty location:/ }).click();
      await page.getByRole("dialog", { name: "Empty location", exact: true }).getByText("Nowhere to put it.", { exact: true }).waitFor();
      await page.keyboard.press("Escape");
      assert.equal(await page.getByRole("button", { name: /^Retained location:/ }).getAttribute("aria-label"), "Retained location: Retained space / Earlier project");
      const sizes = await page.evaluate(() => [...document.querySelectorAll('.ui-place')].map(el => ({ name: el.querySelector('button')?.getAttribute('aria-label'), height: el.querySelector('.ui-field-box')?.getBoundingClientRect().height })));
      assert.equal(sizes.find(x => x.name.startsWith('Location:')).height, 36);
      assert.equal(sizes.find(x => x.name.startsWith('Retained location:')).height, 32);
      assert.equal(sizes.find(x => x.name.startsWith('Thin location:')).height, 24);
      for (const [width, label] of [[1000, "desktop"], [390, "mobile"], [320, "small"]]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
        await trigger.click(); await popup.waitFor();
        await page.waitForFunction(() => document.documentElement.scrollWidth <= innerWidth);
        await page.waitForFunction(() => { const el = document.querySelector('.ui-place-sheet'), rect = el.getBoundingClientRect(); return Boolean(el.dataset.side) && rect.left >= 8 && rect.right <= innerWidth - 8 && rect.top >= 0; });
        await page.evaluate(async () => Promise.all(document.body.getAnimations({ subtree: true }).map(animation => animation.finished.catch(() => {}))));
        if (screenshots && label !== "small") await page.screenshot({ path: `${screenshots}/${sheet}-${theme}-${label}.png`, fullPage: true });
        await page.keyboard.press("Escape");
      }
      assert.deepEqual(errors, []); await page.close();
    });
  } finally { await browser.close(); await server.close(); }
});

test("Player retains native URL playback, millisecond callbacks, refs and host-owned resource lifetime", { timeout: 60000 }, async () => {
  const server = await startFixture(), browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 900, height: 1100 } }); page.setDefaultTimeout(7000);
    await page.addInitScript(() => {
      window.mediaRevocations = []; const revoke = URL.revokeObjectURL.bind(URL);
      URL.revokeObjectURL = url => { window.mediaRevocations.push(url); revoke(url); };
    });
    await page.goto(server.resolvedUrls.local[0], { waitUntil: "networkidle" });
    await page.waitForFunction(() => document.querySelector('audio')?.readyState >= 1);
    const audio = page.locator('audio');
    assert.ok(await audio.evaluate(el => el.controls && el.preload === 'metadata' && !el.autoplay && Math.abs(el.duration - 1.2) < 0.01));
    assert.equal(await page.locator('[data-time]').textContent(), '-1', 'initial paused zero does not emit progress');
    await page.getByRole('button', { name: 'Play tone', exact: true }).click();
    await page.waitForFunction(() => Number(document.querySelector('[data-time]').textContent) > 100);
    await audio.evaluate(el => { el.pause(); el.currentTime = 0.4; });
    await page.waitForFunction(() => Math.abs(Number(document.querySelector('[data-time]').textContent) - 400) < 5);
    await localVideo(page);
    assert.ok(await page.locator('video').evaluate(el => el.controls && el.playsInline && el.videoHeight === 180));
    await page.getByRole('button', { name: 'Play video', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('video').currentTime > 0.1);
    await page.locator('video').evaluate(el => el.pause());
    if (screenshots) {
      await mkdir(screenshots, { recursive: true });
      for (const theme of ["light", "dark"]) {
        await page.evaluate(theme => { document.documentElement.dataset.mode = theme; }, theme);
        await page.evaluate(async () => Promise.all(document.body.getAnimations({ subtree: true }).map(animation => animation.finished.catch(() => {}))));
        await page.locator('section[aria-label="Media examples"]').screenshot({ path: `${screenshots}/media-${theme}.png` });
      }
    }
    await page.setViewportSize({ width: 320, height: 800 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.ok(await page.locator('video').evaluate(el => el.getBoundingClientRect().width <= innerWidth && el.getBoundingClientRect().height <= innerHeight * 0.6));
    await page.setViewportSize({ width: 900, height: 1100 });
    await page.getByRole('button', { name: 'Invalid media', exact: true }).click();
    await page.waitForFunction(() => Number(document.querySelector('[data-errors]').textContent) > 0);
    await page.getByRole('button', { name: 'Restore media', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('audio').readyState >= 1 && !document.querySelector('audio').error);
    await page.getByRole('button', { name: 'Play tone', exact: true }).click();
    await page.waitForFunction(() => !document.querySelector('audio').paused);
    await page.getByRole('button', { name: 'Unmount players', exact: true }).click();
    await page.waitForFunction(() => window.lastMedia?.paused === true);
    assert.equal(await audio.count(), 0);
    assert.ok(await page.evaluate(() => !window.mediaRevocations.includes(window.playerURL) && !window.mediaRevocations.includes(window.videoURL)), 'the wrapper never revokes host URLs');
    assert.equal(await page.evaluate(async () => (await fetch(window.playerURL)).status), 200);
    await page.evaluate(() => URL.revokeObjectURL(window.videoURL));
  } finally { await browser.close(); await server.close(); }
});
