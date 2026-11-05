const { existsSync } = require("node:fs");
const { dirname, join, resolve } = require("node:path");

// tsc-alias already parses import/export and import-type specifiers. Its normal
// full-path option checks runtime files, but Vite bundles those into entry points.
// Resolve our declaration tree instead; NodeNext maps the .js paths back to .d.ts.
module.exports.default = function declarationPaths({ orig, file }) {
  if (!file.endsWith(".d.ts")) return orig;
  return orig.replace(/(["'])(\.{1,2}\/[^"']+)\1/, (quoted, quote, specifier) => {
    if (/\.[a-z]+$/i.test(specifier)) return quoted;
    const target = resolve(dirname(file), specifier);
    const suffix = existsSync(`${target}.d.ts`) ? ".js"
      : existsSync(join(target, "index.d.ts")) ? "/index.js" : undefined;
    if (!suffix) throw new Error(`Unresolved declaration import in ${file}: ${specifier}`);
    return `${quote}${specifier}${suffix}${quote}`;
  });
};
