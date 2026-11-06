import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { Badge } from "../dist/index.js";

// "Sentence case everywhere" is the author's to keep: a badge draws its words as written, so
// a data word such as "script" or "file" is not turned into "Script" or "File".
test("a badge draws its words as written, with no case forced on them", async () => {
  for (const sheet of ["vic-ui.css", "components.css", "ui/styles.css"]) {
    const css = await readFile(new URL(`../dist/${sheet}`, import.meta.url), "utf8");
    assert.doesNotMatch(css, /ui-badge[\w-]*::first-letter/, `${sheet} forces no first letter on a badge`);
    for (const rule of css.matchAll(/\.ui-badge[\w-]*\s*\{[^}]*\}/g)) assert.doesNotMatch(rule[0], /text-transform/, `${sheet}: ${rule[0]}`);
  }
  const html = renderToString(createElement(Badge, {}, "script"));
  assert.match(html, /<span class="ui-badge-words">script<\/span>/);
});
