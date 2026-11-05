import assert from "node:assert/strict";
import test from "node:test";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";

// Exercise the development-only integration through the same CLI developers use.
test("local annotations survive navigation and reload, and download a cross-page review", { timeout: 120000 }, async (t) => {
  const server = spawn(process.execPath, ["--conditions=development", "../node_modules/@react-router/dev/bin.cjs", "dev", "--force", "--host", "127.0.0.1", "--port", "0"], {
    cwd: new URL("../website", import.meta.url), env: { ...process.env, NO_COLOR: "1" }, stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  const diagnostics = [];
  let browser;
  const exited = new Promise(resolve => server.once("exit", resolve));
  try {
    const url = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Dev server did not start: ${output.slice(-1500)}`)), 30000);
      const data = chunk => {
        output += chunk;
        const match = output.match(/http:\/\/127\.0\.0\.1:\d+\/vic-ui\//);
        if (match) { clearTimeout(timer); resolve(match[0]); }
      };
      server.stdout.on("data", data); server.stderr.on("data", data);
      server.once("error", error => { clearTimeout(timer); reject(error); });
      server.once("exit", code => { clearTimeout(timer); reject(new Error(`Dev server exited ${code}: ${output.slice(-1500)}`)); });
    });
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
    page.setDefaultTimeout(15000);
    const external = [];
    page.on("pageerror", error => diagnostics.push(error.message));
    page.on("requestfailed", request => diagnostics.push(`${request.url()}: ${request.failure()?.errorText}`));
    page.on("request", request => { if (/^https?:/.test(request.url()) && new URL(request.url()).origin !== new URL(url).origin) external.push(request.url()); });
    await page.goto(`${url}docs/components/card`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Start feedback mode", exact: true }).click();
    await page.getByRole("heading", { name: "Billing", exact: true }).click();
    await page.getByPlaceholder("What should change?", { exact: true }).fill("Give the card title more space.");
    await page.getByRole("button", { name: "Add", exact: true }).click();
    await page.getByRole("button", { name: "Download review (1)", exact: true }).waitFor();
    await page.getByRole("button", { name: /^Edit annotation 1:/ }).click();
    await page.getByPlaceholder("Edit your feedback...", { exact: true }).fill("The card header needs more breathing room.");
    await page.getByRole("button", { name: "Save", exact: true }).last().click();
    await page.getByRole("button", { name: "Exit", exact: true }).click();
    await page.locator('a[href="/vic-ui/docs/theming"]').first().click();
    await page.getByRole("heading", { name: "Bordered", exact: true }).scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "Start feedback mode", exact: true }).click();
    await page.getByRole("heading", { name: "Bordered", exact: true }).click();
    await page.getByPlaceholder("What should change?", { exact: true }).fill("Make the bordered card title smaller on mobile.");
    await page.getByRole("button", { name: "Add", exact: true }).click();
    await page.getByRole("button", { name: "Download review (2)", exact: true }).waitFor();
    const [activeDownload] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: "Download review (2)", exact: true }).click()]);
    assert.match(await readFile(await activeDownload.path(), "utf8"), /bordered card title smaller on mobile/);
    await page.reload({ waitUntil: "networkidle" });
    const exportButton = page.getByRole("button", { name: "Download review (2)", exact: true });
    await exportButton.waitFor();
    const [download] = await Promise.all([page.waitForEvent("download"), exportButton.click()]);
    const review = await readFile(await download.path(), "utf8");
    assert.equal(download.suggestedFilename(), "vic-ui-review.md");
    for (const text of ["card header needs more breathing room", "bordered card title smaller on mobile", "/vic-ui/docs/components/card", "/vic-ui/docs/theming", ".ui-card-title", "1440 × 1000", "light · bordered"]) assert.ok(review.includes(text), text);
    await page.getByRole("heading", { name: "Bordered", exact: true }).scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "Start feedback mode", exact: true }).click();
    await page.getByRole("button", { name: /^Edit annotation/ }).waitFor();
    assert.equal(await page.getByRole("button", { name: /^Edit annotation/ }).count(), 1, "markers belong to this page");
    await page.getByRole("button", { name: /^Edit annotation/ }).click();
    await page.getByRole("button", { name: "Delete annotation", exact: true }).click();
    await page.getByRole("button", { name: "Download review (1)", exact: true }).waitFor();
    assert.deepEqual(external, [], "reviewing sends no requests to external services");
  } catch (error) {
    t.diagnostic(JSON.stringify({ browser: diagnostics.slice(-12), server: output.slice(-6000) }));
    throw error;
  } finally {
    await browser?.close();
    server.kill("SIGTERM");
    await exited;
  }
});
