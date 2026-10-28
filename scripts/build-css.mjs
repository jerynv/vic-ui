// Writes the package's stylesheets into dist/ from src/index.css: every @import inlined in order,
// nothing transformed, so light-dark(), oklch and the layers reach the browser as written.
//
//   dist/vic-ui.css   fonts, tokens, base and every piece (the one a consumer imports)
//   dist/tokens.css   the tokens alone
//   dist/components.css  the base layer and every piece, without the fonts and the tokens
//   dist/fonts.css    the two @font-face rules alone
//   dist/fonts/       the two font files the stylesheets name
import { copyFileSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const dist = join(root, "dist");

function inline(file, nested = false) {
  let text = readFileSync(file, "utf8");
  if (nested) text = text.replace(/^@layer [^{};]+;\n/gm, "");
  return text.replace(/^@import "([^"]+)";$/gm, (_, path) => `/* ${path.replace(/^\.\//, "")} */\n${inline(join(dirname(file), path), true)}`);
}

/** The source names the fonts from src/styles/; in dist they sit beside the stylesheet. */
const relocate = (css) => css.replaceAll('url("../fonts/', 'url("./fonts/');

mkdirSync(join(dist, "fonts"), { recursive: true });
writeFileSync(join(dist, "vic-ui.css"), relocate(inline(join(root, "src/index.css"))));
writeFileSync(join(dist, "components.css"), inline(join(root, "src/components.css")));
writeFileSync(join(dist, "tokens.css"), readFileSync(join(root, "src/styles/tokens.css"), "utf8"));
writeFileSync(join(dist, "fonts.css"), relocate(readFileSync(join(root, "src/styles/fonts.css"), "utf8")));
for (const font of readdirSync(join(root, "src/fonts"))) copyFileSync(join(root, "src/fonts", font), join(dist, "fonts", font));
console.log("Wrote dist/vic-ui.css, dist/components.css, dist/tokens.css, dist/fonts.css and dist/fonts/.");
