import assert from "node:assert/strict";
import test from "node:test";
import { execFile } from "node:child_process";
import { copyFile, mkdtemp, mkdir, readFile, readdir, rm, stat, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
test("packed library preserves historical exports and types in Bundler and NodeNext", { timeout: 90000 }, async () => {
  const root = resolve(".");
  const temporary = await mkdtemp(join(tmpdir(), "vic-package-test-"));
  try {
    // Exercise the real prepare/build lifecycle before browser tests start. npm
    // versions differ in whether lifecycle output contaminates --json output.
    await run("npm", ["pack", "--ignore-scripts=false", "--pack-destination", temporary], { cwd: root });
    const archives = (await readdir(temporary)).filter(name => name.endsWith(".tgz"));
    assert.equal(archives.length, 1);
    const archive = join(temporary, archives[0]);
    await run("tar", ["-xzf", archive, "-C", temporary]);
    const manifest = JSON.parse(await readFile(join(temporary, "package/package.json"), "utf8"));
    for (const entry of Object.values(manifest.exports)) {
      for (const target of typeof entry === "string" ? [entry] : Object.values(entry)) {
        assert.ok((await stat(join(temporary, "package", target))).isFile(), `Packaged entry point ${target}`);
      }
    }
    const modules = join(temporary, "node_modules");
    await mkdir(modules);
    await symlink(join(temporary, "package"), join(modules, "vic-ui"), "dir");
    // Reuse installed dependency versions, but resolve Vic through the tarball's exports map.
    for (const name of [...Object.keys(manifest.dependencies), ...Object.keys(manifest.peerDependencies), "@types"]) {
      await mkdir(dirname(join(modules, name)), { recursive: true });
      await symlink(join(root, "node_modules", name), join(modules, name), "dir");
    }
    await writeFile(join(temporary, "package.json"), JSON.stringify({ private: true, type: "module" }));
    const names = JSON.parse(await readFile(new URL("./historical-exports.json", import.meta.url), "utf8"));
    const baselineNames = JSON.parse(await readFile(new URL("./exports-603c207.json", import.meta.url), "utf8"));
    assert.equal(baselineNames.length, 131);
    const comboboxNames = ["ComboboxRoot", "ComboboxSearch", "ComboboxList", "ComboboxItem", "ComboboxGroup", "ComboboxEmpty"];
    const previewNames = ["FilePreviewStage", "FilePreviewToolbar", "FilePreviewStatus", "FilePreviewDialog", "ImagePreview", "TextPreview", "DelimitedPreview"];
    for (const sheet of ["vic-ui.css", "components.css", "ui/styles.css"]) {
      const css = await readFile(join(temporary, "package/dist", sheet), "utf8");
      for (const name of ["ui-preview-stage", "ui-preview-dialog", "ui-preview-image", "ui-preview-text", "ui-preview-table", "ui-combobox-search", "ui-combobox-list", "ui-combobox-item"]) assert.ok(css.includes(name), `${sheet} contains ${name}`);
    }
    const runtime = `import * as Vic from "vic-ui";
      import * as UI from "vic-ui/ui"; import * as Icons from "vic-ui/icons";
      const missing = ${JSON.stringify([...baselineNames, ...names, ...previewNames, ...comboboxNames])}.filter(name => !(name in Vic));
      if (missing.length) throw new Error("Missing historical exports: " + missing.join(", "));
      if (!UI.Button || !Icons.ArchiveIcon) throw new Error("Broken secondary entry point");`;
    await run(process.execPath, ["--input-type=module", "-e", runtime], { cwd: temporary });
    const consumer = await readFile(new URL("./package-consumer.tsx", import.meta.url), "utf8");
    await writeFile(join(temporary, "consumer.tsx"), `${consumer}\nvoid [${baselineNames.map(name => `Vic.${name}`).join(",")}];\n`);
    for (const resolution of ["Bundler", "NodeNext"]) {
      await writeFile(join(temporary, "tsconfig.json"), JSON.stringify({ compilerOptions: {
        target: "ES2022", module: resolution === "Bundler" ? "ESNext" : "NodeNext", moduleResolution: resolution,
        jsx: "react-jsx", strict: true, noEmit: true, skipLibCheck: false,
      }, files: ["consumer.tsx"] }));
      try { await run(join(root, "node_modules/.bin/tsc"), ["-p", join(temporary, "tsconfig.json")], { cwd: temporary }); }
      catch (error) { assert.fail(`${resolution} packed declarations:\n${error.stdout}\n${error.stderr}`); }
    }
    if (process.env.VIC_UI_PACKAGE_OUT) await copyFile(archive, process.env.VIC_UI_PACKAGE_OUT);
  } finally { await rm(temporary, { recursive: true, force: true }); }
});
