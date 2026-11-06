# Contributing to vic-ui

`MAP.md` is the spec and `README.md` holds the rules every piece keeps. This page is the short version of how the library is written, for a change to it.

## How to add a piece

1. **File.** One component in `src/components/<Piece>.tsx`, exported from `src/index.ts` (raise the root export count in `tests/package.test.mjs` and check the new name there); it takes controlled props, forwards its ref, and keeps `className` for placement only.
2. **Classes and layer.** Every class starts `ui-<piece>`, and its CSS goes in `src/styles/components/*.css` inside `@layer components.parts`, imported from `src/components.css` (which `src/index.css` takes in).
3. **Tokens.** Every colour, corner, shadow, fill, height and size reads a token from `src/styles/tokens.css`; a value the scale lacks is added there first, colours as a `light-dark()` pair in oklch (`npm run check:design` refuses a corner, shadow or grey fill written by hand).
4. **MAP entry and site page.** A `MAP.md` entry with its props table (every default and state), tokens and classes, and a page or section in `website/content/docs/` with examples in `site/src/examples/<piece>/N-name.tsx`, every state in both modes.
5. **Tests.** A test under `tests/` that draws it from the built package, wired into `npm test`, and the piece added to `tests/state-size.test.mjs` if it can be hovered, focused, pressed, chosen or disabled.

Before a change is done, these all pass: `npm run typecheck`, `npm run check:design`, `npm run check:dashes`, `npm run build`, `npm test`, `npm run test:website` and `npm run typecheck:website`.

## House style

These are how the library's own source, comments and docs are written. They are not rules of the system, and an app built with vic-ui need not follow them.

- **No em or en dashes as punctuation**, anywhere in the source, the site or the docs. Use a colon, a comma, parentheses or a new sentence; write a range as "1 to 10". `npm run check:dashes` (`scripts/check-dashes.mjs`) holds it, and leaves the licence texts in `licenses/` alone.
- **Plain, concrete sentences** in comments and docs, in sentence case, saying what a piece does rather than what it is for in general.
