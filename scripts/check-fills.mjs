#!/usr/bin/env node
// Every grey laid under a hovered, chosen or pressed thing is one of the fill tokens in
// src/styles/tokens.css (`--fill-faint`, `--fill-hover`, `--fill-chosen`, `--fill-press`).
// The mid grey they are made of is refused anywhere else, so two lists cannot hover a shade apart.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const files = [];
function walk(at) {
  for (const name of readdirSync(at)) {
    const path = join(at, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (/\.(css|tsx?)$/.test(name)) files.push(path);
  }
}
// The library and the site that documents it.
for (const dir of [join(root, "src"), join(root, "site/src")]) if (existsSync(dir)) walk(dir);

const bad = [];
for (const file of files) {
  if (file.endsWith("styles/tokens.css")) continue;
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, at) => {
      if (/oklch\(\s*0\.5965\s+0\s+0\b/.test(line)) bad.push(`${relative(root, file)}:${at + 1}: ${line.trim()}`);
    });
}
if (bad.length > 0) {
  console.error(`A grey fill written by hand; use --fill-faint, --fill-hover, --fill-chosen or --fill-press:\n${bad.join("\n")}`);
  process.exit(1);
}
console.log("Every grey fill is a token.");
