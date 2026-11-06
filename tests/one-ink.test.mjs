import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { join, resolve } from "node:path";
import { chromium } from "playwright";
import { build, createServer } from "vite";

// "One ink button per page", as a test: a development build warns once when two ink buttons
// mount in the same main landmark and names both, leaves out a button passed `allowSecond`,
// one in a dialog and any outside a landmark, counts the composable Button's default variant
// as ink, and a production build says nothing.

const ENTRY = "tests/one-ink-client.fixture.mjs";
const html = (src) => `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script type="module" src="${src}"></script></body></html>`;

async function warningsAt(open) {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(10000);
    const warnings = [], errors = [];
    page.on("console", (message) => {
      if (message.type() === "warning") warnings.push(message.text());
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    await open(page);
    await page.getByRole("button", { name: "Add another" }).click();
    await page.getByRole("button", { name: "Publish again" }).waitFor();
    await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))));
    return { warnings: warnings.filter((text) => text.startsWith("vic-ui:")), errors };
  } finally {
    await browser.close();
  }
}

test("a development build warns once about a second ink button in one main landmark", { timeout: 60000 }, async () => {
  const server = await createServer({
    configFile: false,
    logLevel: "error",
    cacheDir: "node_modules/.vite-one-ink-test",
    optimizeDeps: { entries: [ENTRY] },
    server: { host: "127.0.0.1", port: 0 },
    plugins: [{ name: "one-ink-fixture", configureServer: (server) => {
      server.middlewares.use((request, response, next) => {
        if (request.url !== "/") return next();
        response.setHeader("Content-Type", "text/html");
        response.end(html(`/${ENTRY}`));
      });
    } }],
  });
  try {
    await server.listen();
    const { warnings, errors } = await warningsAt((page) => page.goto(server.resolvedUrls.local[0]));
    assert.deepEqual(errors, []);
    assert.equal(warnings.length, 2, warnings.join("\n"));
    assert.match(warnings[0], /two ink buttons in one main landmark, "Save the draft" and "Publish"/);
    assert.match(warnings[0], /allowSecond/);
    assert.match(warnings[1], /two ink buttons in one main landmark, "Reply" and "Reply to all"/);
  } finally {
    await server.close();
  }
});

test("a production build says nothing", { timeout: 90000 }, async () => {
  const out = await mkdtemp(join(resolve("node_modules"), ".one-ink-build-"));
  // The dev server above sets NODE_ENV to development for this process when it is unset; a
  // production build is one run with NODE_ENV set to production, as `vite build` runs.
  const was = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";
  try {
    await build({
      configFile: false,
      logLevel: "error",
      mode: "production",
      build: { outDir: out, emptyOutDir: true, minify: false, rollupOptions: { input: ENTRY, output: { entryFileNames: "fixture.js", chunkFileNames: "[name].js" } } },
    });
    const script = await readFile(join(out, "fixture.js"), "utf8");
    assert.doesNotMatch(script, /process\.env\.NODE_ENV !==/, "the bundler wrote the mode in");
    const { warnings, errors } = await warningsAt(async (page) => {
      await page.route("http://fixture.test/**", (route) => {
        const path = new URL(route.request().url()).pathname;
        if (path === "/") return route.fulfill({ contentType: "text/html", body: html("/fixture.js") });
        return route.fulfill({ contentType: "text/javascript", path: join(out, path) });
      });
      await page.goto("http://fixture.test/");
    });
    assert.deepEqual(errors, []);
    assert.deepEqual(warnings, []);
  } finally {
    if (was === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = was;
    await rm(out, { recursive: true, force: true });
  }
});
