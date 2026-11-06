import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { chromium } from "playwright";
import { createServer } from "vite";

const sheets = [
  ...readdirSync("src/styles").filter((name) => name.endsWith(".css")).map((name) => join("src/styles", name)),
  ...readdirSync("src/styles/components").filter((name) => name.endsWith(".css")).map((name) => join("src/styles/components", name)),
];
const read = (file) => readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

/** Every top-level item of a declaration's value, split on commas outside parentheses. */
function items(value) {
  const out = [];
  let depth = 0, current = "";
  for (const character of value) {
    if (character === "(") depth += 1;
    if (character === ")") depth -= 1;
    if (character === "," && depth === 0) { out.push(current.trim()); current = ""; } else current += character;
  }
  out.push(current.trim());
  return out;
}

test("every transition and animation reads the motion tokens", () => {
  const found = [];
  for (const file of sheets) {
    for (const [, property, value] of read(file).matchAll(/(?<![-\w])((?:transition|animation)(?:-duration|-delay|-timing-function)?)\s*:([^;{}]*)/g)) {
      for (const item of items(value)) {
        // A loop's period is not a motion token, and the checkbox tick keeps its one overshoot.
        if (/\binfinite\b/.test(item)) continue;
        const rest = item.replace("cubic-bezier(0.2, 0.8, 0.2, 1.4)", "").replace(/\b0s\b/g, "");
        if (/\d(ms|s)\b|cubic-bezier|\bease(-in|-out|-in-out)?\b(?!-)|\blinear\b/.test(rest.replace(/var\(--[\w-]+\)/g, ""))) found.push(`${file}: ${property}: ${item}`);
      }
    }
  }
  assert.deepEqual(found, []);
  const sidebar = read("src/styles/components/ui-sidebar.css");
  assert.match(sidebar, /--sidebar-animation-duration: var\(--motion-base\);/);
  assert.match(sidebar, /--sidebar-easing: var\(--ease-track\);/);
});

test("reduced motion is zeroed in one place, and pieces only stop their loops", () => {
  const tokens = read("src/styles/tokens.css");
  for (const name of ["--motion-fast", "--motion-base", "--motion-slow", "--ease-out", "--ease-track", "--ease-out-expo"]) assert.match(tokens, new RegExp(`${name}:`), name);
  assert.match(tokens, /--ease-out-expo: cubic-bezier\(0\.16, 1, 0\.3, 1\);/, "the deprecated curve keeps its own value");
  for (const file of sheets.filter((file) => !file.endsWith("tokens.css"))) assert.doesNotMatch(read(file), /--ease-out-expo/, `${file} reads the deprecated curve`);
  assert.match(tokens, /@media \(prefers-reduced-motion: reduce\) \{\s*:root \{\s*--motion-fast: 0s;\s*--motion-base: 0s;\s*--motion-slow: 0s;\s*\}\s*\}/);
  const queries = [];
  for (const file of sheets.filter((file) => !file.endsWith("tokens.css"))) {
    const text = read(file);
    for (const match of text.matchAll(/@media \(prefers-reduced-motion: reduce\) \{/g)) {
      let depth = 0, end = match.index;
      for (let at = match.index; at < text.length; at += 1) {
        if (text[at] === "{") depth += 1;
        if (text[at] === "}" && --depth === 0) { end = at; break; }
      }
      queries.push({ file, body: text.slice(match.index, end) });
    }
  }
  for (const { file, body } of queries) {
    assert.doesNotMatch(body, /transition/, `${file} turns a transition off; the tokens do that`);
  }
  assert.deepEqual([...new Set(queries.map((query) => query.file))].sort(), [
    "src/styles/components/ui-canonical-focus-panes.css",
    "src/styles/components/ui-code.css",
    "src/styles/components/ui-display.css",
    "src/styles/components/ui-feedback.css",
  ]);
});

test("the tokens set every piece's motion, reduced motion zeroes them, and the toast follows", { timeout: 60000 }, async () => {
  const html = `<html data-mode="light"><head><link rel="stylesheet" href="/dist/vic-ui.css"></head><body>
    <div class="ui-menu" id="menu">Menu</div>
    <svg class="ui-spinner" id="spinner"></svg>
    <div class="ui-sidebar-wrapper"><aside class="ui-sidebar" id="rail"></aside></div>
    <section id="still" style="--motion-fast: 90ms"><div class="ui-menu" id="local-menu">Menu</div></section>
    <div id="root"></div><script type="module" src="/tests/motion-hydrate.fixture.mjs"></script></body></html>`;
  const server = await createServer({ configFile: false, cacheDir: "node_modules/.vite-motion-test", optimizeDeps: { entries: ["tests/motion-hydrate.fixture.mjs"] }, server: { host: "127.0.0.1", port: 0 }, plugins: [{
    name: "motion-fixture",
    configureServer(server) { server.middlewares.use((request, response, next) => {
      if (request.url !== "/" && !request.url?.startsWith("/?")) return next();
      response.setHeader("Content-Type", "text/html");
      response.end(html);
    }); },
  }] });
  let browser;
  try {
    await server.listen();
    browser = await chromium.launch({ headless: true });
    for (const reducedMotion of ["no-preference", "reduce"]) {
      const page = await browser.newPage({ reducedMotion });
      page.setDefaultTimeout(10000);
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(server.resolvedUrls.local[0]);
      await page.waitForFunction(() => window.motionFixture?.ready);
      const read = () => page.evaluate(() => {
        const style = (id) => getComputedStyle(document.getElementById(id));
        const root = getComputedStyle(document.documentElement);
        return {
          fast: root.getPropertyValue("--motion-fast").trim(),
          base: root.getPropertyValue("--motion-base").trim(),
          slow: root.getPropertyValue("--motion-slow").trim(),
          menu: style("menu").animationDuration,
          menuEase: style("menu").animationTimingFunction,
          local: style("local-menu").animationDuration,
          rail: style("rail").transitionDuration,
          railEase: style("rail").transitionTimingFunction,
          spinner: style("spinner").animationName,
        };
      });
      const motion = await read();
      if (reducedMotion === "reduce") {
        assert.deepEqual([motion.fast, motion.base, motion.slow], ["0s", "0s", "0s"]);
        assert.equal(motion.menu, "0s");
        assert.equal(motion.rail, "0s");
        assert.equal(motion.spinner, "none", "a loop stops under reduced motion");
      } else {
        assert.deepEqual([motion.fast, motion.base, motion.slow], ["150ms", "220ms", "300ms"]);
        assert.equal(motion.menu, "0.15s");
        assert.equal(motion.menuEase, "cubic-bezier(0.2, 0.8, 0.2, 1)");
        assert.equal(motion.rail, "0.22s");
        assert.equal(motion.railEase, "cubic-bezier(0.4, 0, 0.2, 1)");
        assert.equal(motion.spinner, "ui-spin");
      }
      assert.equal(motion.local, "0.09s", "a section sets its own motion");

      // A zero duration fires no transitionend; the toast does not wait for one.
      await page.evaluate(() => window.motionFixture.toast("Saved", { id: "one", duration: 0 }));
      await page.locator(".ui-toast").waitFor();
      const started = Date.now();
      await page.evaluate(() => window.motionFixture.toast.dismiss("one"));
      await page.locator(".ui-toast").waitFor({ state: "detached" });
      if (reducedMotion === "reduce") assert.ok(Date.now() - started < 1000, "a still system drops the toast at once");

      // The leave is timed on the toast, so motion set on the Toaster alone still holds it.
      await page.evaluate(() => {
        document.documentElement.style.setProperty("--motion-fast", "0s");
        document.querySelector(".ui-toaster").style.setProperty("--motion-fast", "900ms");
      });
      await page.evaluate(() => window.motionFixture.toast("Saved", { id: "scoped", duration: 0 }));
      await page.locator(".ui-toast").waitFor();
      await page.evaluate(() => window.motionFixture.toast.dismiss("scoped"));
      await page.waitForTimeout(400);
      assert.equal(await page.locator(".ui-toast").count(), 1, "still leaving after 400ms of the Toaster's 900ms leave");
      await page.locator(".ui-toast").waitFor({ state: "detached" });
      await page.evaluate(() => document.querySelector(".ui-toaster").style.removeProperty("--motion-fast"));

      // A slower system is not cut short: the toast stays while it leaves.
      await page.evaluate(() => document.documentElement.style.setProperty("--motion-fast", "900ms"));
      await page.evaluate(() => window.motionFixture.toast("Saved", { id: "two", duration: 0 }));
      await page.locator(".ui-toast").waitFor();
      await page.evaluate(() => window.motionFixture.toast.dismiss("two"));
      await page.waitForTimeout(400);
      assert.equal(await page.locator(".ui-toast").count(), 1, "still leaving after 400ms of a 900ms leave");
      await page.locator(".ui-toast").waitFor({ state: "detached" });
      assert.deepEqual(errors, []);
      await page.close();
    }
  } finally { await browser?.close(); await server.close(); }
});

test("under reduced motion a scroll fade still follows the scroll", { timeout: 60000 }, async () => {
  const css = readFileSync("dist/ui/styles.css", "utf8");
  const browser = await chromium.launch({ headless: true });
  try {
    for (const reducedMotion of ["no-preference", "reduce"]) {
      const page = await browser.newPage({ reducedMotion });
      page.setDefaultTimeout(10000);
      await page.setContent(`<html><head><style>${css}</style></head><body>
        <div id="list" class="data-wrap:scroll-fade-y" data-wrap style="height: 200px; overflow-y: auto"><div style="height: 2000px"></div></div>
        <div style="height: 200px"><div id="probe" style="transition-property: none"></div></div>
        <div id="sheet" class="data-open:animate-in" data-open style="--tw-duration: 300ms">Sheet</div></body></html>`);
      // The fade's edges are lengths against the list's height; a probe as tall as the list
      // turns each into pixels, and does not ease its own height into them.
      await page.evaluate(() => {
        window.fade = (edge) => {
          const probe = document.getElementById("probe");
          probe.style.height = getComputedStyle(document.getElementById("list")).getPropertyValue(`--scroll-fade-${edge}`);
          return probe.getBoundingClientRect().height;
        };
      });
      const fade = () => page.evaluate(() => ({ top: window.fade("t"), bottom: window.fade("b") }));
      // A scroll timeline takes a frame to attach.
      await page.waitForFunction(() => window.fade("b") > 0);
      const atTop = await fade();
      assert.equal(atTop.top, 0, `${reducedMotion}: no fade above at the top`);
      assert.ok(atTop.bottom > 0, `${reducedMotion}: a fade below at the top`);
      await page.evaluate(() => { document.getElementById("list").scrollTop = 900; });
      await page.waitForFunction(() => window.fade("t") > 0);
      const middle = await fade();
      assert.ok(middle.top > 0 && middle.bottom > 0, `${reducedMotion}: fades at both edges in the middle`);
      await page.evaluate(() => { const list = document.getElementById("list"); list.scrollTop = list.scrollHeight; });
      await page.waitForFunction(() => window.fade("b") === 0);
      assert.ok((await fade()).top > 0, `${reducedMotion}: a fade above at the end`);
      // A clock animation is still cut to nothing, so a sheet never paints its first frame.
      const sheet = await page.evaluate(() => getComputedStyle(document.getElementById("sheet")).animationDuration);
      assert.equal(sheet, reducedMotion === "reduce" ? "0s" : "0.3s");
      await page.close();
    }
  } finally { await browser.close(); }
});
