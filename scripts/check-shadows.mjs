#!/usr/bin/env node
// Every shadow is on the elevation scale in src/styles/tokens.css: a surface has an edge and
// no shadow, and only what floats over the page casts one (`--shadow-raise`, `--shadow-float`).
// A box-shadow may be `none`, a token, a ring or an inset line (`0 0 0 <n>px <colour>` or
// `inset …`, which draw an edge, a focus or a state and cast nothing), or a list of those.
// Anything with a blur or an offset that is not a token is refused.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const files = [];
function walk(at) {
  for (const name of readdirSync(at)) {
    const path = join(at, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (name.endsWith(".css")) files.push(path);
  }
}
// The library and the site that documents it.
for (const dir of [join(root, "src"), join(root, "site/src")]) if (existsSync(dir)) walk(dir);


/** One shadow of a list: a token, an inset line, or a ring that casts nothing. */
function ok(one) {
  const s = one.trim();
  if (s === "none" || s === "") return true;
  if (/^var\(--(edge|edge-float|shadow-raise|shadow-float)\)$/.test(s)) return true;
  if (/^inset\b/.test(s)) return true;
  // A hard line: whatever its offset, no blur, so it draws an edge and casts nothing.
  if (/^-?\d*\.?\d+(px|rem)?\s+-?\d*\.?\d+(px|rem)?\s+0(px)?(\s|$)/.test(s)) return true;
  return false;
}

/** Splits a value on the commas between shadows, not those inside a colour. */
function parts(value) {
  const out = [];
  let depth = 0, from = 0;
  for (let i = 0; i < value.length; i++) {
    if (value[i] === "(") depth++;
    else if (value[i] === ")") depth--;
    else if (value[i] === "," && depth === 0) { out.push(value.slice(from, i)); from = i + 1; }
  }
  out.push(value.slice(from));
  return out;
}

const bad = [];
for (const file of files) {
  const text = readFileSync(file, "utf8");
  for (const match of text.matchAll(/box-shadow:\s*([^;]+);/g)) {
    if (parts(match[1]).every(ok)) continue;
    const line = text.slice(0, match.index).split("\n").length;
    bad.push(`  ${relative(root, file)}:${line}  ${match[0].replace(/\s+/g, " ")}`);
  }
}
if (bad.length) {
  console.log(`${bad.length} shadows are off the elevation scale (src/styles/tokens.css):`);
  console.log(bad.join("\n"));
  process.exit(1);
}
console.log("Every shadow is on the elevation scale.");
