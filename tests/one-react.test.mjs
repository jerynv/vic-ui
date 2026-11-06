import assert from "node:assert/strict";
import test from "node:test";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

// vic-ui takes React as a peer and must share the app's copy. Each case runs in a process of
// its own, since the package records its React once, when it is first imported.
const run = promisify(execFile);
const node = (script) => run(process.execPath, ["--input-type=module", "-e", script], { cwd: process.cwd() });
const KEY = 'Symbol.for("vic-ui.react")';

test("one copy of React, imported through every entry, says nothing", async () => {
  const { stderr } = await node(`
    const errors = []; console.error = (...words) => errors.push(words.join(" "));
    const Vic = await import("./dist/index.js"); await import("./dist/ui.js");
    const React = await import("react");
    if (globalThis[${KEY}].component !== React.Component) throw new Error("React is not recorded");
    const { renderToString } = await import("react-dom/server");
    const html = renderToString(React.createElement(Vic.Button, {}, "Save"));
    if (!html.includes("Save")) throw new Error("Button did not render");
    if (errors.length) throw new Error(errors.join("\\n"));`);
  assert.equal(stderr, "");
});

test("a second, different React recorded first is named in a clear error", async () => {
  const { stdout } = await node(`
    globalThis[${KEY}] = { version: "18.3.1", component: class Other {} };
    const errors = []; console.error = (...words) => errors.push(words.join(" "));
    await import("./dist/index.js");
    process.stdout.write(errors.join("\\n"));`);
  assert.match(stdout, /vic-ui: two copies of React are loaded/);
  assert.match(stdout, /The first is React 18\.3\.1, this one React 19\./);
  assert.match(stdout, /dedupe/);
});

test("a piece rendered by another copy of React throws the reason, not a null hook", async () => {
  const { stdout } = await node(`
    const { Button, TextField } = await import("./dist/index.js");
    const said = [];
    for (const piece of [Button, TextField]) {
      try { piece.render({ children: "Save" }, null); said.push("rendered"); }
      catch (error) { said.push(error.message); }
    }
    process.stdout.write(JSON.stringify(said));`);
  const said = JSON.parse(stdout);
  assert.equal(said.length, 2);
  for (const message of said) assert.match(message, /^vic-ui: two copies of React are loaded/);
});
