# Third-party notices

vic-ui's own code is under the MIT License (`LICENSE`). It includes or adapts the following, each under its own licence, with the full texts in `licenses/`.

## Icons

The icons are copied at build time from these sets by `scripts/gen-icons.mjs` into `src/icons/icons.tsx`, read from the `@iconify-json/tabler` and `@iconify-json/mingcute` packages, so nothing is fetched at run time.

| Set | By | Licence | Text |
| --- | --- | --- | --- |
| Tabler Icons, https://tabler.io/icons | Paweł Kuna | MIT | `licenses/MIT-tabler-icons.txt` |
| MingCute Icon, https://github.com/Richard9394/MingCute | MingCute Design | Apache License 2.0 | `licenses/Apache-2.0-mingcute.txt` |

MingCute supplies one name, `UsersThreeIcon`, for which Tabler has no filled multi-person shape. The three chevrons in `src/icons/own` are drawn for vic-ui and are under its MIT License.

## Typefaces

Both faces are self-hosted from `src/fonts` and shipped in `dist/fonts`, each under the SIL Open Font License 1.1. Neither licence names a Reserved Font Name. The files are as their projects released them: Cal Sans UI is the variable file from the project's own release, and Space Mono Bold is the Latin subset Fontsource publishes.

| Face | Sets | By | Licence |
| --- | --- | --- | --- |
| Cal Sans UI, https://github.com/calcom/sans-ui | everything; statements at `GEOM 100` | Mark Davis (WORDMARK), commissioned by Cal.com | `licenses/OFL-cal-sans-ui.txt` |
| Space Mono, https://github.com/googlefonts/spacemono | a wordmark, and nothing else | Colophon Foundry, for Google Fonts | `licenses/OFL-space-mono.txt` |

The OFL lets the fonts be bundled and redistributed with software, provided each copy carries the copyright notice and the licence, and the fonts are never sold by themselves.

## Code and constructions

- **Tailwind CSS preflight** (`src/styles/preflight.css`), by Tailwind Labs, Inc. MIT License, `licenses/MIT-tailwindcss.txt`. Copied from `tailwindcss@4.3.3` with its theme calls resolved to vic-ui's tokens; Tailwind itself is not a dependency.
- **Cult UI's Texture Button**, by Nolly Studio (copyright Jordan Gilliam). MIT License, `licenses/MIT-cult-ui.txt`. The button's construction (a rim round a face, each with its own gradient) and its colours are adapted from `texture-button.tsx`, rewritten as plain CSS on the palette (`src/components/Button.tsx`, the `--ink-*` and `--line-*` tokens).
- **Kibo UI's avatar stack**, by shadcnblocks. MIT License, `licenses/MIT-kibo-ui.txt`. `src/components/AvatarStack.tsx` keeps its cut-out, each face masked by the outline of the one before it, ported onto the library's own classes.

## Dependencies

- **Floating UI** (`@floating-ui/dom`), by the Floating UI contributors. MIT License, `licenses/MIT-floating-ui.txt`. Installed from npm; it positions what floats.
- **React** and **React DOM** are peer dependencies, installed by the consumer under their own MIT License.
