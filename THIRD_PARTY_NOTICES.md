# Third-party notices

vic-ui's own code is under the MIT License (`LICENSE`). It includes or adapts the following, each under its own licence, with the full texts in `licenses/`.

## Icons

The icons are copied at build time from these sets by `scripts/gen-icons.mjs` into `src/icons/icons.tsx`, read from the `@iconify-json/tabler` and `@iconify-json/mingcute` packages, so nothing is fetched at run time.

| Set | By | Licence | Text |
| --- | --- | --- | --- |
| Tabler Icons, https://tabler.io/icons | Paweł Kuna | MIT | `licenses/MIT-tabler-icons.txt` |
| IconMCP, https://iconmcp.com/licence | UI8 | MIT | `licenses/MIT-iconmcp.txt` |
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

- **shadcn/ui**, by shadcn. MIT License, `licenses/MIT-shadcn-ui.txt`. The 63 component modules in `src/ui`, their hooks and highlighter are imported with `shadcn@4.23.0 add --all` from the Base UI `base-nova` registry (source snapshot `8a35366`, November 4, 2026). Imports use this package's aliases; radii map to vic tokens; the button press translation is removed; strict optional types are adapted. `components.json` records the registry configuration.
- shadcn's `packages/shadcn/src/tailwind.css` is retained in `src/ui/upstream.css` under the same MIT license. It supplies the state variants, scroll fades, and animation utilities used by the imported components.
- **Base UI**, MIT License, `licenses/MIT-base-ui.txt`. Installed from npm; supplies the accessible behavior of the shadcn components and the existing Button and mobile Sidebar adapters.

- **Tailwind CSS preflight** (`src/styles/preflight.css`), by Tailwind Labs, Inc. MIT License, `licenses/MIT-tailwindcss.txt`. Copied from `tailwindcss@4.3.3` with its theme calls resolved to vic-ui's tokens. Tailwind builds the new component stylesheet; consumers import the compiled CSS.
- **Cult UI's Texture Button**, by Nolly Studio (copyright Jordan Gilliam). MIT License, `licenses/MIT-cult-ui.txt`. The button's construction (a rim round a face, each with its own gradient) and its colours are adapted from `texture-button.tsx`, rewritten as plain CSS on the palette (`src/components/Button.tsx`, the `--ink-*` and `--line-*` tokens).
- **Kibo UI's avatar stack**, by shadcnblocks. MIT License, `licenses/MIT-kibo-ui.txt`. `src/components/AvatarStack.tsx` keeps its cut-out, each face masked by the outline of the one before it, ported onto the library's own classes.

## Dependencies

- **TanStack Table**, MIT License, installed from npm. `src/ui/data-table.tsx` follows shadcn's v9 feature-based table recipe; DatePicker and Typography follow the corresponding shadcn composition examples.

- **Fumadocs**, by Fuma Nama, MIT License, `licenses/MIT-fumadocs.txt`. `website/` ports the official React Router SPA example at `f27c79d`; the Base UI edition supplies documentation layout, navigation, search, and Markdown rendering. Live examples, source snippets, and theme controls use `vic-ui/ui`.
- The component guides and examples in `website/content/docs/components` and `website/app/examples` are ported from shadcn's `apps/v4/content/docs/components/base` and `apps/v4/examples/base`, at `8a35366`. `website/upstream.json` lists sources. Imports use the packaged library; framework links, radii, and toast calls follow this workspace. Data Table, Date Picker, Typography, Direction, and Code Block demonstrate this package's compositions. Backend-dependent demonstrations use upstream static variants.

- **Floating UI** (`@floating-ui/dom`), by the Floating UI contributors. MIT License, `licenses/MIT-floating-ui.txt`. Installed from npm; it positions what floats.
- **React** and **React DOM** are peer dependencies, installed by the consumer under their own MIT License.

IconMCP supplies Archive, Filter, FolderCode and Robot, retrieved through its official MCP endpoint on 2026-11-04. The original SVGs are in `src/icons/iconmcp`; their presentation attributes are preserved by the generator. Fumadocs resolves its icon imports to this same local catalogue at build time.

## Local review tool

Agentation 3.1.2, by Benji Taylor (https://github.com/benjitaylor/agentation), is a development-only dependency under PolyForm Shield 1.0.0 (`licenses/PolyForm-Shield-agentation.txt`). It is excluded from the published library and production website bundles. No endpoint or webhook is configured; annotations remain in the browser until copied or downloaded.

## File preview source transfer

The core modules in `src/components/preview` and their dedicated preview stylesheets adapt first-party V-Client source at commit `2f2713d8744373455d6be2953af26f68ecb37f6f`: `FileView.tsx`, `viewers/Lightbox.tsx`, `viewers/ImageView.tsx`, the text-only portion of `viewers/TextView.tsx`, the CSV portion of `viewers/TableView.tsx`, and selected rules from `styles/app/viewers.css`. The project owner explicitly authorized this transfer into Vic UI. The supplied source repository has no root license; this record does not assert that V-Client was released under MIT.

The verified source archive has SHA256 `35835c7112e44ec753719ff760612a36776cedb44fb3b8b35094f34ebe677906`; its manifest has SHA256 `751334183baaec3949e3972d2af9312eb798e54431ec0a59b1adb51e3465eb80`. This increment uses only the pinned main source, not the separately preserved recovery files. Application loaders, authorization, routes, icons and fonts are excluded; controls and icons come from Vic's existing implementations. No additional runtime dependency or PDF/Office resource is included. These root exports render images, plain text and CSV/TSV. Optional Office/media entry points are described below; PDF and Markdown rendering remain outside this package.

## Optional Office and media previews

The separate `vic-ui/preview/media`, `vic-ui/preview/office` and `vic-ui/preview/docx` entry points additionally adapt V-Client `viewers/MediaView.tsx`, the stored-cell spreadsheet portion of `viewers/TableView.tsx`, `viewers/SlidesView.tsx`, `DocxView.tsx` and `lib/zipread.ts` from the same verified main pin. `licenses/office-preview/source-provenance.json` retains original Git blob and SHA256 identities. This is the same explicitly authorized first-party transfer; no additional upstream MIT grant is asserted. Host loaders, authorization and routes are excluded.

DOCX conversion uses the optional peer `docx-preview` 0.4.1 (Apache-2.0), loaded only when its client renderer is requested. Its JSZip dependency is used under the MIT alternative. The development lock pins JSZip3.10.2. Available notices for docx-preview and its ZIP dependency chain are retained in `licenses/office-preview`; isarray's MIT text is copied from its installed README. Pako's complete notice includes its zlib portion. Dependency implementations are external package dependencies, not copied into Vic source. Native media and XLSX/PPTX extraction require no added runtime library.
