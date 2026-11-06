import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { Badge } from "../dist/index.js";

/**
 * Every rule whose selector names a badge class anywhere in it: alone, after an ancestor
 * (`.ui-notice .ui-badge`), with an attribute (`.ui-badge[data-x]`) or a pseudo-class
 * (`.ui-badge:hover`), and inside an at-rule. Returns each as its selector and its body.
 */
function badgeRules(css) {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, "");
  return [...text.matchAll(/([^{};]*\.ui-badge[^{};]*)\{([^{}]*)\}/g)].map((match) => ({ selector: match[1].trim(), body: match[2] }));
}

test("the badge rule matcher reaches a badge under any selector", () => {
  const sample = `
    .ui-badge{padding:0}
    .ui-notice .ui-badge {text-transform:uppercase}
    .ui-badge[data-x] {text-transform:capitalize}
    @media (min-width: 40rem) { .ui-badge:hover, .ui-chip { text-transform: lowercase; } }
    .ui-badge-solid>span{color:red}`;
  const found = badgeRules(sample).filter((rule) => /text-transform/.test(rule.body)).map((rule) => rule.selector);
  assert.deepEqual(found, [".ui-notice .ui-badge", ".ui-badge[data-x]", ".ui-badge:hover, .ui-chip"]);
  assert.ok(badgeRules(sample).some((rule) => rule.selector === ".ui-badge-solid>span"));
});

// "Sentence case everywhere" is the author's to keep: a badge draws its words as written, so
// a data word such as "script" or "file" is not turned into "Script" or "File".
test("a badge draws its words as written, with no case forced on them", async () => {
  for (const sheet of ["vic-ui.css", "components.css", "ui/styles.css"]) {
    const css = await readFile(new URL(`../dist/${sheet}`, import.meta.url), "utf8");
    const rules = badgeRules(css);
    assert.ok(rules.length > 0, `${sheet} has badge rules to check`);
    for (const rule of rules) {
      assert.doesNotMatch(rule.selector, /::?first-letter/, `${sheet} forces no first letter on a badge: ${rule.selector}`);
      assert.doesNotMatch(rule.body, /text-transform/, `${sheet}: ${rule.selector}`);
    }
  }
  const html = renderToString(createElement(Badge, {}, "script"));
  assert.match(html, /<span class="ui-badge-words">script<\/span>/);
});
