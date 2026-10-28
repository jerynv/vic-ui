// No em or en dash as punctuation anywhere in the source, the site or the docs. The licence texts
// under licenses/ are copied verbatim and are not ours to edit, so they are left out.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const SKIP = new Set(["node_modules", "dist", ".git", "licenses"]);
const found = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (/\.(tsx?|mjs|css|md|html|json|ya?ml)$/.test(name) && name !== "package-lock.json") {
      readFileSync(path, "utf8").split("\n").forEach((line, at) => {
        if (/[\u2013\u2014]/.test(line)) found.push(`  ${relative(root, path)}:${at + 1}`);
      });
    }
  }
})(root);
if (found.length) {
  console.error(`${found.length} line${found.length === 1 ? " has" : "s have"} an em or en dash:`);
  console.error(found.join("\n"));
  process.exit(1);
}
console.log("No em or en dashes.");
