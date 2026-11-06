# vic-ui: the map

## Changes in 0.2

There is no CHANGELOG.md; changes a consumer has to act on are noted here.

- **`--accent` is vic's brand colour.** It was shadcn's hover grey in the composable sheet (`--accent: var(--fill-hover)`); that declaration is gone, and `--accent` is now the fill of the accent family in `tokens.css` (`tone="accent"` on Badge, Count, Switch, Progress, Tabs, Button and Announcement). A `vic-ui/ui` consumer who set `--accent` the shadcn way to change the hover grey now changes vic's brand accent instead, and the hover no longer moves. Tailwind's `--color-accent` (`bg-accent`, `hover:bg-accent`) reads `--fill-hover` directly: set `--fill-hover` to change the composable hover grey (it is the one fill scale, so vic's own lists and menus move with it), and drop an `--accent` set for hover.
- **`--button-accent` and `--button-on-accent` are read, not declared.** The accent button reads `var(--button-accent, var(--accent))` and `var(--button-on-accent, var(--accent-on))`, so either `--accent` or `--button-accent` set on any section reaches the buttons inside it.
- **`--bg-elevated` is deprecated** and goes in 0.4: use `--surface-lifted` for what sits on top and `--bg-recessed` for what sinks.
- New: the accent family (`--accent`, `--accent-on`, `--accent-ink`, `--accent-tint`, `--accent-edge`, `.tone-accent`), `--bg-frame`, and the art tokens (`--art-1` to `--art-4`, `--art-grain`).

## Canonical controls source sync (active)

Owner-authorized additive source sync from V-Client555625f4 is tracked in [docs/tasks/canonical-controls-sync.md](docs/tasks/canonical-controls-sync.md). Historical extraction and current parity are distinct; preview transfers do not close controls coverage. Preserve released142 root exports and all existing defaults. Implementation isolated on feat/canonical-controls-sync.

## Optional Office/media release

Owned isolated branch `feat/office-media-previews` in `t3-c2cc92d0`, baseline `6deb7fc`. Five additive optional exports: AudioPreview/VideoPreview at `vic-ui/preview/media`, XlsxPreview/PptxPreview at `vic-ui/preview/office`, DocxPreview at `vic-ui/preview/docx`. All require ready Blob/Uint8Array input and title; host retains loading/auth/classification/downloads. Root137 exports unchanged. DOCX alone needs exact optional peer docx-preview0.4.1. No Phaethon/shared checkout edits. Provenance is authorized first-party V-Client pin2f2713d8, with all116 source-pack payload hashes reverified; no invented upstream MIT grant.

Behavior: native media64MiB encoded; Office10MiB encoded/512ZIPparts/8MiB each/32MiB expanded; XML4MiB per part/100k nodes/depth128. XLSX stored values only, bounded sheets/cells/text/display; PPTX extracted text only. DOCX validates/rebuilds ZIP, renders into inert nodes then sanitized sandboxed srcdoc; PNG/JPEG only, budgeted input/output/images and repeated header/footer/note placement before conversion. Additional DOCX limits and supported restrictions are in the File preview guide and /tmp/vic-office-release-api.md. Other root controls/core previews unchanged.

Verification before final freeze: real rendering/playback, focus/retry/stale-input/URL/bitmap/observer cleanup, both themes/styles, all8 website checks, local-review test, both typechecks, design/dashes/reference build/detector passed. npm test passed actual packed strict Bundler/NodeNext skipLibCheck:false with root137 and optional subpaths loadable without DOCX installed, plus24 behavioral checks. Independent review found3 DOCX precursor gaps; fixes now reject relationship-selected non-XML, bounded numbering expansion, and repeated-header work BEFORE dependency/bitmap/FileReader conversion. Eight exact regressions and ordinary list/five-page-header success cases pass. Parent directly inspected matching dependency relationship/numbering/page paths. Delegated bounded recheck task05562e3a failed BEFORE execution with provider safety filter “possible cybersecurity risk”; no independent recheck success claimed or retry attempted. Initial report /tmp/vic-office-independent-review.txt. Final focused suite and final package+24 behavioral/8 website/1 local-review checks pass, both typechecks/design/dashes/reference build pass. A documentation range dash was corrected after the dash check identified it. All native preview workers completed. Final retained artifact destination /tmp/vic-ui-office.kfXWHM; commit/source and archive metadata recorded outside the tarball.

Released b0a29e2c83622487d6b6b126e26ac90ad573c122 (#29); source5d0ff52f tree identical. Retained archive /tmp/vic-ui-office.kfXWHM/vic-ui-0.1.0.tgz SHA256069fdb0eca38a5206e27a6df9eeceb8d73b29395c45d1a3078c7050087b6dd91,220 files/668425bytes. API/manifest/checks beside archive. Delivered same artifact to Phaethon and V-Client owners; neither application upgraded by this thread. Main CI42005789672 and Pages deployment passed. Logs /tmp/vic-office-*.log. No npm publication. Existing release authorization carries.

## Slider/settings release and docs readiness

Owned branch feat/slider-settings-release in t3-c2cc92d0 based on released b0a29e2. Cherry-picked isolated implementation74a690a and parent fixesbeee6fd/94d4d70 (new branch equivalents9b11f8e/caf5abb/242f3a9). Source worktree t3-dff18547 remains clean/preserved. Five new root exports: Slider, SettingsLayout, SettingsSection, SettingsGroup, SettingsRow; expected142 total preserving prior137 and all optional previews. No dependency added. Sidebar/Radio runtime unchanged.

Independent review found touch stepped presses also triggered native touchstart jump and off-grid callback/form discrepancies. Parent fixes suppress only the companion track touch path and normalize every value channel to the min-anchored step grid. Seven source tests pass including real emulated touch tap/move/drag/jump/disabled, value/ARIA/FormData consistency, and Sidebar observer persistence with explicit focus-boundary wrapping. Actual installed BaseUI1.9.0; source note corrected. New user-requested headingProps supports native heading attributes/ref/tabIndex, with titleId precedence; host focus tests pass. Consumer owner received contract, no package upgrade claimed.

Integrated root exports/CSS imports and strict packed consumer assertions; fixtures use built package/styles across native/composable sheets. Canonical Slider ready/composable family and new Settings page/examples bring the alphabetical catalogue to86 pages. All9 focused built checks pass, including both sheets/themes, heading focus, touch, form consistency and Sidebar lifecycle. Earlier composable-sheet test failures came from sampling layout before the global reduced-motion transition settled; assertions now wait for finished transitions/stable bounds, with no unrelated stylesheet changes. Light desktop and dark mobile docs screenshots inspected. Both typechecks, design/dashes, reference build, all9 website checks and local review pass. Final npm test passes: actual packed strict Bundler/NodeNext and142 exports plus33 behavioral checks. With9 website checks and1 local review,44 checks pass. Logs /tmp/vic-controls-final-tests.log and /tmp/vic-controls-*.log. Released7de0c2c (#30), tree-identical to tested36c3305. Archive /tmp/vic-ui-settings.hvwtXn/vic-ui-0.1.0.tgz SHA2562788b337e419101cf4944994b815752a88cc488edc7ec32fa2e11a26524089ce includes222 files/678554bytes and142 root exports. API/manifest/checks beside archive; delivered to Phaethon and Nclusive, no consumer edits/adoption claim. Main CI42009112876 passed library checks but failed new docs focus assertion; deployment skipped. Reproduced by delaying lazy example JavaScript: prerendered Go to button accepted a click before its handler attached. The docs example now disables its buttons/sliders until hydration, with a gated-asset regression before the normal focus flow. This follow-up does not change library source/API or require an archive replacement. Gated-asset regression now passes before and after hydration, as do website build/types and design/dash checks. Its initial prehydration slider-role assertion waited indefinitely because the server-rendered thumb is hidden until layout; native input.disabled establishes the correct prehydration state without requiring an accessible thumb before initialization. All9 website checks pass together after the fix (/tmp/vic-settings-readiness-website.log). Next release the scoped docs correction and confirm CI/deployment. No active delegates or manual fixture servers.

## Inline combobox composition

Six additive root primitives (`ComboboxRoot`, `ComboboxSearch`, `ComboboxList`, `ComboboxItem`, `ComboboxGroup`, `ComboboxEmpty`) support a pinned search, inline list, provider rail and footer. Root controls query, selected string key and open state; the host supplies visible options in rendered order and retains filtering, catalogue data, permissions and popup ownership. Existing root and `vic-ui/ui` Combobox APIs remain intact. All 131 exports from `603c207` are preserved; there are now 137 runtime root exports and no new dependencies.

Arrow keys skip disabled rows and clamp at the ends; Home/End traverse the open list, Enter selects and Escape requests closing. Modified keys and IME composition remain native. Input focus uses stable, safely encoded active-descendant IDs; filtering, provider replacement and reorder cannot retain an absent option. Tab reaches the external rail/footer because the scrollable list is explicitly outside tab order. Scrolling reveals the active row inside its own list after reorder/refocus without moving the surrounding page. Root or search-level disabled states and read-only search prevent both keyboard and pointer selection. Controlled state can decline requests, and selection/closing preserve the query.

The existing Combobox family contains live light/dark examples with a 44px provider rail, pinned search, 32px normal-weight rows and independent footer. T3 layout reference: `7f6f47b27b44456f1c8214d3b566b375c09f629e` (MIT). Application loaders and account logic were not copied. Installed Base UI was evaluated: its permanently expanded inline state and Home/End caret behavior cannot implement this controller contract through public APIs.

Validation covers SSR hydration, both stylesheet entries/themes, keyboard/pointer/IME, dynamic item identity, disabled/read-only changes, controlled refusal, empty results, focus/scroll recovery, mobile overflow and the old Combobox. Strict packed Bundler/NodeNext declarations use `skipLibCheck:false`, check all 131 prior exports and compile the new API. All three stylesheet outputs contain the new styles. Library/package, seven website and local review checks pass, as do both typechecks, design/dash checks and reference build. Independent review found the leaf restriction mismatch; controller-level guards and regressions resolve it. No Phaethon edits or changes to released preview/control behavior.

## Portable file previews

Seven additive root exports adapt the verified V-Client source: FilePreviewStage, FilePreviewToolbar, FilePreviewStatus, FilePreviewDialog, ImagePreview, TextPreview and DelimitedPreview. These render browser-decodable images, plain UTF-8 text and CSV/TSV. No PDF/DOCX/XLSX/PPTX/Markdown/media renderer or new dependency is included. Inputs are ready Blob/Uint8Array values; host applications retain fetch, permissions, classification and download actions. No Phaethon/V-Client source edits are part of this increment.

Image input is capped at 20 MiB before copying or URL creation; the host still owns accepted image dimensions/formats and the browser owns decoding memory. Text is capped at 512 KiB/20,000 lines; delimited data at 1 MiB/1,000 total rows/60 columns. Callers can lower limits. Byte-cut CSV omits incomplete final records. Text/HTML/formula-looking cells remain inert. Local image URLs are revoked on replacement/unmount; stale text reads are ignored and retries actually reset conversion state.

The native dialog restores the opener or explicit return target, wraps Tab including editing hosts, respects nested dialog Escape, and preserves renderer arrow keys. Navigation keys apply to the outer content container; replacing focused file content restores container focus. Docs provide real image/text/CSV previews, download/full-screen actions and light/dark loading/retry/unsupported examples. The 85-page catalogue remains alphabetical.

Source pin `2f2713d8744373455d6be2953af26f68ecb37f6f`; source archive SHA256 `35835c7112e44ec753719ff760612a36776cedb44fb3b8b35094f34ebe677906`; manifest SHA256 `751334183baaec3949e3972d2af9312eb798e54431ec0a59b1adb51e3465eb80`. All 116 payloads were independently checked. Provenance records authorized first-party transfer, not an invented upstream MIT license; only pinned main source was adapted.

Validation: 26 package/control/website/review checks pass, both typechecks, design/dash checks and reference build pass. Website count assertions were updated from 84 to 85 for the new family. All 123 historical exports plus seven preview exports and strict packed Bundler/NodeNext declarations are checked; all three component stylesheet outputs contain preview styles. Real desktop/mobile previews exercised zoom/fit, navigation, focus return, text/CSV display, retry and unsupported actions. Independent review findings on CSV arrow keys, lost focus, contenteditable Tab order and nested Escape were fixed with integration regressions. No new Impeccable detector findings.

Previous control release: `ed35c656c274a3c43261d79a11a0d003588062d2` (#26), all 21 checks and Pages deployment passed. Tested archive `/tmp/vic-ui-controls.dyx6Rs/vic-ui-0.1.0.tgz`, SHA256 `3e3b6d466ec00c430e73d3452b4c9c5bba999f83d5656aa84b248cb0783feb41`. Phaethon owner received the archive/API and CI confirmation; downstream adoption remains their responsibility. Switch supports `look="flat" | "rimmed"`; button faces use concentric inset-derived radii.

## Documentation website

`website/` ports Fumadocs' React Router SPA template. MDX lives in `website/content/docs`;
the static search index and each document are prerendered. `npm run dev:website` starts it;
`npm run build:website` emits `website/build/client`. The `dev:site` and `build:site`
commands now target this website. GitHub Pages runs library and browser tests before deployment.
The shared website theme control and live examples import the actual `vic-ui/ui` API.
86 canonical family pages cover the 50 vic catalogue entries and 66 composable families. `component-families.ts` maps alternate names to one page; old URLs render the canonical document and navigate to it after hydration. Aliases are excluded before Fumadocs builds navigation and search. Shared families use a Ready-made/Composable tab selector with one active example/usage view. Both the sidebar and marketing directory sort by display name; the reference shell sorts within its categories.
Rows support an optional description beneath the title; the file-list example demonstrates independent save actions.
Avatar is a single-person primitive; AvatarStack is the overlapping group composition.
`website/upstream.json` records the imported demos. The original catalogue reuses
`site/src/examples` with root package exports, including the vic-specific compositions.
`/icons` is the standalone SVG browser: collection and text filters, size preview,
React import and raw SVG copying. `/docs/icons` remains the usage and licensing guide.
The marketing page composes actual library fields, switches, buttons, avatars, tabs, and
source blocks around a geometric SVG. The component directory includes every vic component and each added primitive.
Its workspace form is a local interactive demonstration, with no account or service call.
`site/` retains the original catalogue source and reusable examples; `build:reference-site`
builds that reference shell. Both shells use the exported icon-based ColorModeSwitch.

## Local visual review

`npm run dev:website` enables Agentation on every route. Its picker, comments and per-page
markers are upstream; `local-review.tsx` stores a cross-page archive under `vic-ui:review:v1`
and downloads a Markdown review with URL, selector, appearance and viewport context.
Route changes remount the picker so page markers cannot leak into the next document.
The DEV import guard excludes the tool from production. `npm run test:review` exercises
annotation, navigation, reload and the downloaded file against a real dev server.
The test forces dependency optimization from scratch. Vite scans the app, library and
catalogue examples up front so a fresh checkout does not discover their imports late
and interrupt its first page load.

## One-time codes

InputOTP uses the separated cells from v-client's CodeField (`ui-focus.css`), mapped to vic
tokens. The input-otp primitive retains paste, selection and autocomplete. Flat/bordered
surfaces, root-level validation, disabled state and reduced-motion carets are styled together.

## Shared surface styles

`Surface` scopes `surface="flat" | "bordered"` to fields and cards. Native controls and
their composable counterparts also accept an individual `surface` override. CSS variables
carry the setting through the DOM; buttons and floating surfaces keep their own appearance.
Defaults outside a scope remain compatible. The theming guide compares both styles, and
applicable docs pages have a Preview surface selector.

## Current component API

`vic-ui/ui` exports the shadcn Base UI catalogue from `src/ui/index.ts`.
`src/ui/registry.json` records 63 upstream families and the Data Table, Date Picker, and
Typography compositions, along with source revision and registry style.
Their prop contracts come from the component source and emitted declarations. The compiled
`vic-ui/ui/styles.css` maps shadcn semantic colors, radii, and shadows to the existing vic tokens;
consumers do not need Tailwind. `ColorModeSwitch` composes the icon button and radio menu;
`CodeSnippet` composes the code block, copy button, and lazy Shiki highlighter.
Slider also forwards accessible names to its thumbs and supports scalar or range values.
Upstream licensing and the local adaptations are recorded in `THIRD_PARTY_NOTICES.md`.

The reference below describes the primary `vic-ui` root API and `vic-ui/styles.css`.

vic-ui is a React component library and the design system it draws with: about fifty pieces (buttons, fields, lists, rows, overlays, tables, feedback, a sidebar, timeline pieces), one token file, one stylesheet per kind of piece, and the rules the pieces are held to.

It was extracted from the v-client application, where it lived in `web/src/ui` (components), `web/src/styles/tokens.css` and `web/src/styles/components/ui*.css` (styles), and `web/src/components/icons.tsx` (icons). This map was read from the checkout at `/Users/jeryn/Documents/GitHub/.v-client-work/design-system`, branch `design/system`, commit `e7221f50`, brought up to date with v-client's library at commit `8d7c0b2c` (the `ds/dedupe` work), and again at commit `0f17780a`. Every value below is copied from that source.

These things change in vic-ui:

1. **Links come from a provider.** The source imports react-router's `Link` in six places (`ButtonLink`, `Announcement`, `Tabs`, `Trail`, `List`'s `Row` and `RowsMore`, `SidebarMenuButton`); `IconButtonLink` and `DangerButtonLink` draw through `ButtonLink`. vic-ui draws every `to` through the link component supplied by `LinkProvider`, which defaults to a plain `<a href>`. A router passes its own link to the provider.
2. **The icons ship inside the package** at `src/icons`, rather than in the app's `web/src/components/icons.tsx`.
3. **The styles stand alone.** The `@theme` block of `tokens.css` is plain `:root` custom properties (the working type scale, the faces, the easings; the app's Kumo era and front page sizes are left out, since no piece reads them), `@custom-variant dark` is gone, `--head-h` is declared in `tokens.css`, the `[data-hue]` rules that hand on `--hue` and `--hue-ink` are in `tokens.css`, `sr-only` is in `base.css`, and Tailwind's preflight ships as `preflight.css` in `@layer base` because the pieces were drawn on it. The layer order is declared at the top of `src/index.css`. `data-mode="system"` follows the device, as no attribute does. The app's `.appearance-choice` rule is left out.
4. **Three defects of the source at `e7221f50` are fixed** (and v-client has since fixed them the same way). A menu's labelled section is `.ui-menu-section` (it was `.ui-menu-group`, which `ui-inputs.css` styles as a list's heading, so a grouped menu's rows were inset 0.65rem at weight 600). `Select` draws a heading where an option's `group` changes, as `Combobox` does. The `Select` and `DatePicker` triggers, which are buttons, draw the keyboard's focus ring on their box (`0 0 0 2px var(--focus)`), which they did not.

5. **Every class is the library's.** `Trail`'s classes are `ui-trail-*` (the source's are `trail-*`, in its `type.css`), and `IconButtonLink` drops the app's `no-underline` class, which only the app's console reads.

Classes keep the `ui-` prefix. Product names are not part of the library.

## Contents

1. [Conventions every piece shares](#conventions-every-piece-shares)
2. [Components](#components)
3. [Tokens](#tokens)
4. [Rules](#rules)
5. [Fonts](#fonts)

## Conventions every piece shares

From `web/src/ui/README.md`:

- **Controlled, one value.** A piece that holds a choice takes `value` and gives `onValueChange(value)`; one that is on or off takes `checked` and gives `onCheckedChange(checked)`. A native piece still passes `onChange` and every other native attribute through.
- **Lists are `Items`**: a record of value to words, pairs in order, or `Option`s. Every list-shaped piece reads them through `toOptions`.
- **Labelled the same way.** A field has `label` (or `aria-label`) and `hint` on its own line under the box. A short `error` (up to `SHORT_ERROR`, 56 characters) takes the label's place in the danger ink (`FieldHead`); a longer refusal is a `Notice` with `onDismiss` at the top of the form. `name` posts the value with its form, through a hidden input where the piece is not a native control.
- **Sizes.** `size="sm"` is the dense size (`--control-h-sm`, 2rem); the default is `--control-h` (2.25rem). Inside the product the dense size is the norm; the way in uses the default. The one exception is `Button`, whose default is already the dense height and whose `lg` is `--control-h`.
- **Classes.** Every class starts `ui-`. `className` is for placement only, never to restyle a piece.
- **Floating.** Anything that floats opens in the top layer (`popover="manual"`), positioned by `@floating-ui/dom` with `strategy: "fixed"`, on `.ui-menu`'s surface.
- **States.** Every interactive piece has an eased hover, a press and a focus ring, and no state changes the weight or size of its words. A disabled piece is dimmed to 0.55 with a `not-allowed` pointer; one that takes `disabledReason` stays focusable and says the reason on hover and focus.
- **Colour** comes only from the tokens; the hues reach a piece through `data-hue`.

Two internal helpers in `reason.ts` carry the disabled-with-reason behaviour. They are not exported from `index.ts`:

- `useBlocked(disabled, reason, forwardedRef)`: with a reason, returns props that make the control `aria-disabled`, keep it in the tab order, swallow clicks, Enter and Space, and attach the tooltip (`node`); without one, returns `{ disabled, ref }` so the control is natively disabled.
- `useFieldReason(disabled, reason)`: the same for a field that must stay typeable-looking but take no words (`readOnly` plus `aria-disabled`), with the reason hung from the box on pointer rest and focus.

## Components

Every export of `web/src/ui/index.ts`, in the index's order, with each piece's siblings from the same file beside it. "Native attributes" means the rest of the element's own HTML attributes pass through.

### Button

A native button in one of four looks: `ink` (a page's one filled, committing action), `line` (a flat outlined one beside it), `quiet` (words that act on their own) and `link` (words that act inside a sentence). Built after Cult UI's Texture Button (MIT): the button is a rim (a hairline edge round a gradient one pixel deep) and its words sit on a face inside it.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `look` | `"ink" \| "line" \| "quiet" \| "link"` | `"ink"` | Which look. |
| `tone` | `"accent"` | none | On `ink`, fills the button in the accent: the rim and face states are mixed from `--button-accent` (falling back to `--accent`) and the words are `--button-on-accent` (falling back to `--accent-on`). A look, not a state. Also supported by ButtonLink and the composable default Button. |
| `size` | `"md" \| "lg"` | `"md"` | `md` is `--control-h-sm` (2rem); `lg` is `--control-h` (2.25rem), a form's commit. |
| `full` | `boolean` | `false` | Full width. |
| `square` | `boolean` | `false` | An icon alone, as wide as the button is tall; its words go in `aria-label`. |
| `round` | `boolean` | `false` | A circle (`--radius-round`), as a message box's Send is. |
| `icon` | `ReactNode` | none | Drawn before the words inside the face. |
| `busy` | `boolean` | `false` | Held and `aria-busy` while it lasts; a spinner stands where its icon was, or over its words where it has none, the words kept in place unseen, so its width does not change. |
| `disabledReason` | `string \| undefined` | none | With `disabled`, keeps it focusable and says why on hover and focus. |
| `type` | button type | `"button"` | Native type. |
| `ref` | `Ref<HTMLButtonElement>` | none | Forwarded. |
| native attributes | `ButtonHTMLAttributes` | | Passed through. |

States, as `ui.css` implements them:

- Rest: `ink` rim `--ink-rim-top` to `--ink-rim-bottom`, face `--ink-face-top` to `--ink-face-bottom`, words `--ink-words`, edge `--ink-rim-edge`. `line`: edge `--line`, rim and face transparent, words `--fg-strong`. `quiet`: no rim, no face, no border, `height: auto`, words `--fg-subtle`, weight `--weight-quiet`.
- Hover: `ink` face moves to `--ink-face-top-hover` / `--ink-face-bottom-hover`; `line` face fills `--field-fill-hover`; `quiet` words go `--fg-strong` and underline (offset 3px).
- Press (`:active`): `ink` face `--ink-face-top-press` / `--ink-face-bottom-press`; `line` face `--field-fill`. Nothing moves; the face darkens.
- `line` with `aria-pressed="true"` takes the ink rim and face (a held toggle).
- Accent (`ui-button-accent` on `ink`): rim edge `--button-accent` mixed with black 22%, rim top with white 30%, rim bottom with black 12%; face top with white 4%, bottom with black 10%; hover white 6% / white 2%; press black 12% / black 4%; words `--button-on-accent`. The words hold 5.8:1 on every face stop in both modes with the default accent (`colour-contrast.test.mjs`). Set `--button-accent` and `--button-on-accent` on a part of the page to give its buttons another colour without moving `--accent`; set `--accent` on a part of the page and its buttons follow it. Neither button token is declared on the root, so either works at any depth.
- Accent is local to the filled control; semantic danger/caution rules win. It adapts the existing semantic color-mix treatment but retains two distinct stops when pressed. The five-hue example and `accent-button.test.mjs` cover both APIs, both themes and higher-contrast lightness values.
- `link`: no rim, face or padding, `height: auto`; the sentence's own size, weight and line height, wrapping with it (`white-space: normal`); words `--fg-strong`, underlined (offset 0.2em) in `--fg-subtle`, the underline taking `currentColor` on hover (`--motion-fast`).
- Every gradient stop (`--rim-top`, `--rim-bottom`, `--face-top`, `--face-bottom`) is a registered `@property` of syntax `<color>`, so hover and press ease over `--motion-slow` `--ease-track`.
- Focus: `:focus-visible` outline 2px `--focus`, offset 2px (keyboard only).
- Disabled (`:disabled` or `aria-disabled="true"`): opacity 0.55, `cursor: not-allowed`, no hover or press.
- Busy (`aria-busy`): held as disabled is. With no icon, the face is `position: relative`, the words (`ui-button-busy-words`) are `opacity: 0` and the spinner (`ui-button-busy-mark`) is laid over them (`position: absolute; inset: 0; margin: auto`).
- Full (`full`, not `link`): `height: auto`, `min-height: --control-h-sm` (`lg`: `--control-h`), `white-space: normal`; its face has `padding-block: 0.25rem`, line height 1.25 and centred words, so words longer than the column wrap inside the button and one line keeps its height.
- The rim's gradient is painted from the outer edge (`background-origin: border-box`), so it does not repeat under the border as a sliver along the top of a tall button.
- Type: `--text-ui` (13px), weight `--weight-ui`, line height 1, no wrap; `lg` uses `--text-read` (14px).
- Face padding `0 0.875rem` (`lg`: `0 1rem`, `square`: 0), gap 0.5rem, radius `calc(var(--radius-button) - 2px)`.

Tokens: `--control-h-sm`, `--control-h`, `--radius-button`, `--radius-round`, `--text-ui`, `--text-read`, `--focus`, `--ink-rim-edge`, `--ink-rim-top`, `--ink-rim-bottom`, `--ink-face-top`, `--ink-face-bottom`, `--ink-face-top-hover`, `--ink-face-bottom-hover`, `--ink-face-top-press`, `--ink-face-bottom-press`, `--ink-words`, `--line`, `--fg-strong`, `--fg-subtle`, `--fg`, `--field-fill`, `--field-fill-hover`, `--button-accent`, `--button-on-accent`; local slots `--rim-edge`, `--rim-top`, `--rim-bottom`, `--face-top`, `--face-bottom`, `--words`.

CSS: `ui.css`. Classes `ui-button`, `ui-button-face`, `ui-button-ink`, `ui-button-line`, `ui-button-quiet`, `ui-button-link`, `ui-button-accent`, `ui-button-lg`, `ui-button-full`, `ui-button-square`, `ui-button-round`, `ui-button-busy-words`, `ui-button-busy-mark`. The four `@property` rules sit outside the layer at the end of the buttons block.

Dependencies: `reason.ts` (`useBlocked`), which uses `Tooltip`'s `useReason`; `Spinner`.

### ButtonLink

The same looks on a link: to a page of the app by `to`, or anywhere by `href`. In vic-ui `to` renders through `LinkProvider`'s link component.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `to` | `string` | none | A page of the app; drawn by the provider's link. |
| `state` | `unknown` | none | Handed to the link with `to`. |
| `href` | `string` | none | Any other address; drawn as `<a>`. |
| `look` | `"ink" \| "line" \| "quiet" \| "link"` | `"ink"` | As `Button`. |
| `size` | `"md" \| "lg"` | `"md"` | As `Button`. |
| `full` | `boolean` | `false` | Full width. |
| `square` | `boolean` | `false` | Icon alone. |
| `round` | `boolean` | `false` | A circle. |
| `ref` | `Ref<HTMLAnchorElement>` | none | The anchor. |
| `icon` | `ReactNode` | none | Before the words. |
| `newTab` | `boolean` | `false` | With `href`, adds `target="_blank" rel="noreferrer"`. |
| native attributes | `AnchorHTMLAttributes` less `href` | | Passed through. |

States: as `Button`'s looks (hover, press, focus-visible). No disabled state.

Tokens and CSS: as `Button`.

Dependencies: the link from `LinkProvider` (the source used react-router's `Link`).

### FileButton

A button that chooses a file: a label drawn as a `Button` (`line` by default), with the file input inside it and hidden, so the keyboard reaches it as the pointer does and its focus rings the button. A file input keeps its own value, so a caller that sends at once gives it a new `key` to empty it.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `children` | `ReactNode` | required | The button's words. |
| `label` | `string` | required | The input's accessible name. |
| `onChange` | `(event: ChangeEvent<HTMLInputElement>) => void` | required | The files chosen. |
| `accept` | `string` | none | Which files. |
| `multiple` | `boolean` | `false` | Several at once. |
| `name` | `string` | none | Posts the files with the form. |
| `look` | `ButtonLook` | `"line"` | As `Button`. |
| `size` | `"md" \| "lg"` | `"md"` | As `Button`. |
| `icon` | `ReactNode` | none | Before the words. |
| `disabled` | `boolean` | `false` | Without a reason, the input is disabled the native way. |
| `disabledReason` | `string \| undefined` | none | With `disabled`, stays in reach, says why on hover and focus, and choosing does nothing. |
| `className` | `string` | none | Placement. |

States: as `Button`'s look. The keyboard reaching the hidden input draws the ring on the button (`:has(input:focus-visible)`, outline 2px `--focus`, offset 2px).

CSS: `ui.css` (`ui-file-button`) plus the button classes; `sr-only` hides the input.

Dependencies: `useTip`.

### Checkbox

A box to tick with its words beside it: a native checkbox inside its label, drawn as a filled square that fills with ink and a tick.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `label` | `ReactNode` | none | Words beside the box. Without it the box is alone, named by `aria-label`, wrapped in a `span` rather than a `div`. |
| `onCheckedChange` | `(checked: boolean) => void` | none | Handed the new state. |
| `onChange` | change handler | none | Still receives the event. |
| `disabledReason` | `string \| undefined` | none | Keeps it focusable and says why. |
| `id` | `string` | `useId()` | The input's id. |
| `ref` | `Ref<HTMLInputElement>` | none | Forwarded. |
| native attributes | `InputHTMLAttributes` less `type` | | `checked`, `defaultChecked`, `name` and the rest. |

States:

- Rest: 1.125rem square, radius `--radius-mark`, fill `--field-fill`, inset ring `1px light-dark(oklch(0 0 0 / 0.14), oklch(1 0 0 / 0.14))`.
- Hover (unchecked, enabled): `--field-fill-hover`.
- Checked: fill and ring `--ink-face-bottom`; the tick (`CheckIcon` at 13px, stroke width 3, colour `--ink-words`) fades in (`--motion-fast`) and scales from 0.6 to 1 (`--motion-fast`, on the library's one overshooting curve, `cubic-bezier(0.2, 0.8, 0.2, 1.4)`).
- Focus: outline 2px `--focus`, offset 2px, keyboard only.
- Disabled or `aria-disabled`: box opacity 0.55, `not-allowed`; the words go `--fg-subtle` and `not-allowed`.
- Words: `--text-ui`, line height 1.45, `--fg`.

Tokens: `--radius-mark`, `--field-fill`, `--field-fill-hover`, `--ink-face-bottom`, `--ink-words`, `--focus`, `--text-ui`, `--fg`, `--fg-subtle`.

CSS: `ui.css`. Classes `ui-check`, `ui-check-box`, `ui-check-tick`, `ui-check-words`.

Dependencies: `useBlocked`; icon `CheckIcon`.

### Choice

One of a row of choices (a day, a time): a native button that says whether it is chosen, read out as pressed. Unchosen it is the field's fill; chosen it is the ink button.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `chosen` | `boolean` | required | Drawn and announced (`aria-pressed`) as the chosen one. |
| `disabledReason` | `string \| undefined` | none | Keeps it focusable and says why. |
| `type` | button type | `"button"` | Native type. |
| native attributes | `ButtonHTMLAttributes` | | Passed through. |

States:

- Rest: rim edge transparent; rim and face `--field-fill`; words `--fg`; height `--control-h`; `--text-read`, weight 400; face padding `0 0.625rem`.
- Hover (not chosen): rim and face `--field-fill-hover`.
- Chosen (`aria-pressed="true"`): the ink rim and face and `--ink-words`. The change eases through the registered stops (`--motion-slow`).
- Focus and disabled: as `Button` (it carries `ui-button`).

Tokens: `--field-fill`, `--field-fill-hover`, `--fg`, `--control-h`, `--text-read`, the `--ink-*` rim, face and words tokens, plus `Button`'s base tokens.

CSS: `ui.css`. Classes `ui-button`, `ui-choice`, `ui-button-face`.

Dependencies: `useBlocked`.

### ChoiceCards

One of a few as cards: a real radio group (a `fieldset` of labelled radios), so the arrow keys move between them and a reader hears every card, the ones that cannot be chosen disabled with their reason on the card itself.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `legend` | `string` | required | The group's name, for a screen reader alone (`sr-only`). |
| `name` | `string` | required | The radios' name, posted with the form. |
| `value` | `string \| null` | required | The chosen card. |
| `onChange` | `(value: string) => void` | required | Handed the new choice. |
| `onPress` | `(pointer: boolean) => void` | none | Told whether the next choice came from the pointer or the keys. |
| `items` | `readonly ChoiceCardItem[]` | required | `{ value, label, hint?, mark?, end?, off?, held? }`: `mark` leads the card; `end` stands at its end before its dot (a price); `off` is why it cannot be chosen, said in place of its hint; `held` is one that cannot be chosen whose own words already say why (the one in use). |
| `className` | `string` | none | Placement. |

States:

- Card: min height 3.25rem, padding `0.625rem 0.875rem`, radius `--radius-control`, inset ring `1px var(--line)`, `--text-read`, `--fg-strong`. Hover `--field-fill`. Chosen: ring `--fg-strong`, the dot filled (a ring, the canvas and a centre in `--fg-strong`). Focus: outline 2px `--fg-strong`, offset 2px. Off (`data-off`): `--fg-subtle`, `not-allowed`, no hover, no dot.
- Hint `--text-ui` `--fg-subtle`; end `--text-ui`, tabular. Nothing changes weight or size.

CSS: `ui.css`. Classes `ui-choice-cards`, `ui-choice-card`, `ui-choice-card-words`, `ui-choice-card-label`, `ui-choice-card-hint`, `ui-choice-card-end`, `ui-choice-card-dot`.

### DangerButton

The commit of something that removes or ends, filled in the danger ink, on the library's button. `look="line"` is the way in to such an act; `look="quiet"` is the words alone in the danger ink (a row's Void or Refund).

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `look` | `"ink" \| "line" \| "quiet"` | `"ink"` | Filled, outlined in the danger edge, or words alone. |
| every `Button` prop | | | `size`, `full`, `icon`, `disabledReason` and the rest. |

States:

- `ink` (`ui-button-danger`): rim edge `--ink-rim-edge`; rim top `color-mix(in oklab, var(--tone-danger-ink), var(--tone-on) 35%)` to `--tone-danger-ink`; face top `color-mix(in oklab, var(--tone-danger-ink), var(--tone-on) 14%)` to `--tone-danger-ink`; words `--tone-on`.
- Hover: face `color-mix(... 22%)` to `color-mix(... 6%)`.
- Press: face flat `--tone-danger-ink`.
- `line` (`ui-button-danger-line`): edge `--tone-danger-edge`, words `--tone-danger-ink`; hover and press as `line`.
- `quiet` (`ui-button-danger-quiet`): words `--tone-danger-ink`, on hover too.
- Focus and disabled: as `Button`.

Tokens: `--tone-danger-ink`, `--tone-danger-edge`, `--tone-on`, `--ink-rim-edge`, plus `Button`'s.

CSS: `ui.css`. Classes `ui-button-danger`, `ui-button-danger-line`, `ui-button-danger-quiet`.

Dependencies: `Button`.

### DangerButtonLink

The way in to a destructive act on a link: the link to the screen of its own where the act is confirmed. Exported from `DangerButton.tsx`.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `look` | `"ink" \| "line" \| "quiet"` | `"line"` | Outlined in the danger edge by default, or words alone in the danger ink. |
| every `ButtonLink` prop | | | `to`, `href`, `size`, `icon` and the rest. |

States, tokens and CSS: as `DangerButton`'s looks.

Dependencies: `ButtonLink`.

### CautionButton

The commit of a change to terms somebody agreed to, filled in the caution ink. Exported from `DangerButton.tsx`.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| every `Button` prop but `look` | | | Always `look="ink"`. |

States: as the danger `ink` look with `--tone-caution-ink` in place of `--tone-danger-ink` (rim top mix 35%, face top mix 14%; hover 22% and 6%; press flat), words `--tone-on`.

Tokens: `--tone-caution-ink`, `--tone-on`, `--ink-rim-edge`, plus `Button`'s.

CSS: `ui.css`. Class `ui-button-caution`.

Dependencies: `Button`.

### HUES, hueFor, Hue

Not a component: the palette's five hues as a list, and a function that picks one for a seed (an organisation's slug), so a thing named by that seed is always the same colour.

| Export | Type | Meaning |
| --- | --- | --- |
| `HUES` | `readonly ["sky", "sage", "butter", "lilac", "clay"]` | The five hues. |
| `Hue` | `(typeof HUES)[number]` | One of them. |
| `hueFor(seed)` | `(seed: string) => Hue` | FNV-1a over `` `hue:${seed}` `` (offset `0x811c9dc5`, prime `0x01000193`), unsigned, modulo 5. |

Set on an element as `data-hue`. The mapping that turns it into `--hue` and `--hue-ink` lives in `web/src/marketing/shared.css`, lines 47 to 51:

```css
[data-hue="sky"] { --hue: var(--hue-sky); --hue-ink: var(--hue-sky-ink); }
[data-hue="sage"] { --hue: var(--hue-sage); --hue-ink: var(--hue-sage-ink); }
[data-hue="butter"] { --hue: var(--hue-butter); --hue-ink: var(--hue-butter-ink); }
[data-hue="lilac"] { --hue: var(--hue-lilac); --hue-ink: var(--hue-lilac-ink); }
[data-hue="clay"] { --hue: var(--hue-clay); --hue-ink: var(--hue-clay-ink); }
```

(The source rules also set `--mk-hue` and `--mk-hue-ink` for the front page; those are product-only.) vic-ui needs these five rules in its own stylesheet.

### toOptions, textOf, Items, Option

Not components: the one shape every list-shaped piece reads.

```ts
interface Option {
  value: string;
  label: ReactNode;
  text?: string;      // the words search and type-ahead match; `label` when it is a string
  hint?: ReactNode;   // a quieter line under the label
  start?: ReactNode;  // what leads it (a face, an icon, a flag), in the list, on its chip and beside it once chosen
  disabled?: boolean;
  reason?: string;    // why a disabled option cannot be chosen, said on hover
  group?: string;     // options sharing a group are drawn together, groups in first-seen order
}
type Items = Record<string, string> | ReadonlyArray<readonly [string, string]> | ReadonlyArray<Option>;
```

- `toOptions(items)`: turns any of the three shapes into `Option[]`, filling `text` from a string `label` or the `value`.
- `textOf(option)`: `option.text`, else a string `label`, else `value`.

### OrgMark

An organisation drawn as itself: its first letter on a tile in its own hue (`hueFor(slug)`), the letter in the hue's ink, or its logo (`src`) in exactly the letter's box.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `name` | `string` | required | Its first letter, trimmed and upper-cased, is drawn. |
| `slug` | `string` | required | Seeds the hue. |
| `src` | `string \| null \| undefined` | none | A logo's address. It fills the tile contained once it has loaded; the letter stands until then and stays if it fails. |
| `size` | `"sm" \| "lg"` | `"sm"` | `sm` is 2rem, `lg` 3.5rem. |
| `className` | `string` | none | Placement. |

States: none; it is `aria-hidden`. Small: 2rem square, radius `--radius-row`, `--font-display` weight 700 at 0.9375rem, words `--hue-ink` on `--hue`. Large: 3.5rem, radius `--radius-control`, 1.5rem, words `--bg-base` on `--hue-ink` (inverted). The tile is `position: relative` and clips; its logo (`ui-org-logo`) is absolute over the whole tile, `object-fit: contain`, hidden until loaded; once loaded the tile carries `data-logo`, which makes the letter and the tile's colour transparent.

Tokens: `--hue`, `--hue-ink`, `--radius-row`, `--radius-control`, `--font-display`, `--bg-base`.

CSS: `ui.css`. Classes `ui-org-mark`, `ui-org-mark-lg`, `ui-org-logo`. Needs the `[data-hue]` rules.

Dependencies: `hueFor`, `useLogo`.

### useLogo

`useLogo(src)` returns `{ shown, image }`: `image` is the `<img class="ui-org-logo">` to put inside a letter tile and `shown` is whether it has loaded, for the tile's `data-logo`. A logo this page has already loaded is shown at once where it is drawn again. Exported from `OrgMark.tsx`, for a tile of your own drawn the same way.

### RadioGroup

One of a few, all in view: native radios under a legend, each inside its label, drawn as a filled circle whose centre fills with ink. The arrows move between them as a browser's radios do.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `legend` | `ReactNode` | required | The group's name, drawn as a field label. |
| `value` | `string` | required | The chosen value. |
| `onValueChange` | `(value: string) => void` | required | Handed the new value. |
| `items` | `Items` | required | An option's `hint` is a quieter line; `disabled` with `reason` keeps it focusable and says why on hover and focus. |
| `across` | `boolean` | `false` | Lays them in a wrapping row (gap `0.5rem 1.25rem`). |
| `look` | `"card"` | none | Each a filled card (min 12rem columns, gap 0.75rem), the chosen one ringed in ink. |
| `name` | `string` | `useId()` | The radios' shared name. |
| `className` | `string` | none | Placement. |

States:

- Dot rest: 1.125rem circle, `--field-fill`, inset ring `1px light-dark(oklch(0 0 0 / 0.14), oklch(1 0 0 / 0.14))`.
- Dot hover (unchecked): `--field-fill-hover`.
- Checked: fill `--ink-words`, inset ring `0.3125rem` of `--ink-face-bottom`, eased (box-shadow `--motion-base` `--ease-out`).
- Focus: outline 2px `--focus`, offset 2px.
- Disabled: dot opacity 0.55, `not-allowed`; label `not-allowed`, words `--fg-subtle`. Without a `reason` the radio is natively disabled. With one (`useFieldReason`) it is `aria-disabled`, stays in the arrows' reach, choosing it does nothing, and the reason hangs from its row on pointer rest and when the keys reach it.
- Card look: padding 0.75rem, radius `--radius-field`, `--field-fill`; hover `--field-fill-hover`; chosen ring `inset 0 0 0 1.5px var(--ink-face-bottom)`; transitions `--motion-fast` `--ease-track`.
- Words: `--text-read`, `--fg-strong`; hint `--text-ui`, `--fg-subtle`.

Tokens: `--text-read`, `--text-ui`, `--fg-strong`, `--fg-subtle`, `--field-fill`, `--field-fill-hover`, `--ink-words`, `--ink-face-bottom`, `--focus`, `--radius-field`, `--ease-track`.

CSS: `ui.css`. Classes `ui-radios`, `ui-radios-across`, `ui-radios-cards`, `ui-radios-list`, `ui-radio`, `ui-radio-dot`, `ui-radio-words`, `ui-radio-hint`, and `ui-field-label` for the legend.

Dependencies: `toOptions`.

### Select

A choice from a list drawn by the page rather than the browser: the field box `TextField` draws, with the list on the floating surface in the top layer. A combobox whose focus never leaves the field.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `label` | `ReactNode` | none | The field's label. |
| `aria-label` | `string` | none | Its name where there is no label. |
| `items` | `Items` | required | The choices. `start` leads an option; `hint` is a line under it; `disabled` with `reason` sets the row's `title`. `group` draws a heading (`ui-menu-group`) where it changes from the option before, in the given order. |
| `value` | `string` | required | The chosen value. |
| `onValueChange` | `(value: string) => void` | none | Called only when the value changes. |
| `placeholder` | `string` | `""` | Said while nothing is chosen. |
| `hint` | `ReactNode` | none | A line under the box. |
| `error` | `ReactNode` | none | A short error in the label's place. |
| `disabled` | `boolean` | `false` | Natively disabled. |
| `disabledReason` | `string \| undefined` | none | Keeps it focusable and says why. |
| `name` | `string` | none | Posts the value through a hidden input. |
| `id` | `string` | `useId()` | The trigger's id. |
| `size` | `"sm"` | none | The dense height. |
| `className` | `string` | none | Placement. |

Keys: ArrowDown and ArrowUp open on the chosen option or move (clamped, no wrap); Home and End jump while open; Enter or Space opens or chooses; Escape closes (and stops the key); Tab closes; a letter types ahead (700ms window), changing the value directly while closed.

States:

- Box: as `TextField` (fill `--field-fill`, hover `--field-fill-hover`, error ring `inset 0 0 0 1px var(--tone-danger-ink)`).
- Empty (`data-empty`): words `--fg-subtle`.
- Open (`data-open`): box `--field-fill-hover`; the caret (`ChevronDownIcon` 16px, `--fg-subtle`) rotates 180deg over `--motion-fast`.
- Dense (`size="sm"`): the box keeps `padding-right: 2.25rem` (`.ui-field-sm .ui-select`), the room its caret stands in, so a long choice ends before the caret.
- Disabled (`data-disabled`): box opacity 0.55, hover stays `--field-fill`; trigger `not-allowed`.
- Focus: the trigger is a button, so the keyboard reaching it draws a ring on the box, `0 0 0 2px var(--focus)` (with the error ring kept inside it); a pointer press draws none. In the source it drew nothing, a defect fixed in vic-ui.
- List: `ui-menu` surface, placed by `useAnchored` as every list is (`bottom-start`, offset 6, flip and shift with padding 8, at least the box's width, max height `min(LIST_MOST, max(LIST_LEAST, availableHeight))`px, that is 320 and 120), `data-side` set to the side it opened on. The active row (pointer or keys) is `data-active`, fill `--fill-hover`; the chosen row ends in a tick (`CheckIcon` 16px, `--fg-strong`); a disabled row is opacity 0.45 and `not-allowed`. The active row is kept in view.

Tokens: the field tokens (see `TextField`), the list tokens (see `Menu`), `--fg-subtle`, `--fg-strong`.

CSS: `ui.css` (`ui-select`, `ui-select-box`, `ui-select-words`, `ui-select-caret`, `ui-menu`, `ui-menu-item`, `ui-menu-words`, `ui-menu-hint`, `ui-menu-tick`, `ui-field-sm`) and `ui-inputs.css` (`ui-start`). Plus the field classes.

Dependencies: `useAnchored`, `FieldHead`, `FieldHint`, `describedBy`, `toOptions`, `textOf`, `useBlocked`; icons `ChevronDownIcon`, `CheckIcon`.

### SelectField

The labelled choice the way in draws: `Select` with its words given as `options`.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `label` | `ReactNode` | required | The label. |
| `options` | `Items` | required | Passed to `Select` as `items`. |
| every other `Select` prop | | | As `Select`. |

States, tokens, CSS and dependencies: as `Select`.

### Switch

Something on or off, said at once: a native button with the switch role, a track that fills with ink and a knob that slides to the end.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `checked` | `boolean` | required | On or off (`aria-checked`). |
| `onCheckedChange` | `(checked: boolean) => void` | none | Handed the new state on a press. |
| `disabledReason` | `string \| undefined` | none | Keeps it focusable and says why. |
| `look` | `"flat" \| "rimmed"` | `"rimmed"` | `flat` drops the track's inset rim (`ui-switch-flat`). |
| `tone` | `"accent" \| undefined` | none | When on, the track fills with `--accent` rather than ink (`ui-switch-accent`). A look, not a state. The composable `Switch` takes it too. |
| `type` | button type | `"button"` | Native type. |
| native attributes | `ButtonHTMLAttributes` less `onChange` | | Its name is `aria-label` or the words beside it. |

States:

- Off: 2.25rem by 1.375rem track, padding 0.1875rem, radius `--radius-round`, `--field-fill`, inset ring `1px light-dark(oklch(0 0 0 / 0.1), oklch(1 0 0 / 0.1))`. Hover: `--field-fill-hover`.
- On: track `--ink-face-bottom`; hover `--ink-face-top`. With `tone="accent"` those two are `--accent` and `--accent` mixed 14% toward `--bg-canvas`, so the track is the accent and moves toward the canvas under the pointer; off, it is the same as any switch. The knob (1rem circle, `--surface-lifted`, `--shadow-raise`) translates 0.875rem over `--motion-base` `--ease-out`. Track colour eases over `--motion-base`.
- Focus: outline 2px `--focus`, offset 2px.
- Disabled or `aria-disabled`: opacity 0.55, `not-allowed`.

Tokens: `--radius-round`, `--field-fill`, `--field-fill-hover`, `--ink-face-bottom`, `--ink-face-top`, `--accent`, `--bg-canvas`, `--focus`, `--surface-lifted`, `--shadow-raise`.

CSS: `ui.css`. Classes `ui-switch`, `ui-switch-knob`, `ui-switch-accent`; `ui-switch-variants.css` (`ui-switch-flat`).

Dependencies: `useBlocked`.

### TextField

A label, a native input, and what is fixed at its start or end (a currency sign, the rest of a hostname) inside the same box.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `label` | `ReactNode` | none | The label. |
| `aria-label` | `string` | none | Its name where there is no label. |
| `prefix` | `ReactNode` | none | Fixed at the box's start. |
| `suffix` | `ReactNode` | none | Fixed at the box's end. |
| `hint` | `ReactNode` | none | A line under the box. |
| `error` | `ReactNode` | none | A short error in the label's place; rings the box. |
| `size` | `"sm"` | none | The dense height. |
| `disabledReason` | `string \| undefined` | none | With `disabled`, keeps it focusable and says why on hover and focus. |
| `id` | `string` | `useId()` | The input's id. |
| `ref` | `Ref<HTMLInputElement>` | none | Forwarded. |
| native attributes | `InputHTMLAttributes` less `size` and `prefix` | | `type`, `value`, `onChange` and the rest. |

States:

- Box: height `--control-h` (`sm`: `--control-h-sm`), radius `--radius-field`, fill `--field-fill`, no border; box-shadow and background ease over `--motion-fast`.
- Hover (not focused, not disabled): `--field-fill-hover`.
- Focus: nothing is drawn; the caret shows it (`outline: none` on the input).
- Error (`data-invalid`): `inset 0 0 0 1px var(--tone-danger-ink)`; `aria-invalid`; the error takes the label's place (see `FieldHead`).
- Disabled (`:has(:disabled)`): box opacity 0.55, `not-allowed`, no hover.
- Input: padding `0 0.75rem` (`sm`: `0 0.625rem`, `--text-ui`), size `--field-text`, `--fg-strong`; placeholder `--fg-subtle`. Prefix and suffix `--field-text` (`sm`: `--text-ui`), `--fg-subtle`.
- Disabled for a reason (`disabledReason`, `useFieldReason`): the input is `readOnly` and `aria-disabled` rather than disabled, the box carries `data-disabled`, and the reason hangs from the box on pointer rest and focus.

Tokens: `--control-h`, `--control-h-sm`, `--radius-field`, `--field-fill`, `--field-fill-hover`, `--field-text`, `--text-ui`, `--fg-strong`, `--fg-subtle`, `--tone-danger-ink`.

CSS: `ui.css` (`ui-field`, `ui-field-sm`, `ui-field-head`, `ui-field-label`, `ui-field-error`, `ui-field-box`, `ui-field-input`, `ui-field-suffix`, `ui-field-hint`) and `ui-inputs.css` (`ui-field-prefix`, and the `sm` sizes of the input, prefix and suffix).

Dependencies: `FieldHead`, `FieldHint`, `describedBy`, `useFieldReason`.

### TypedConfirm, typedFirst

The field that takes a name, an address or a number typed to confirm something that cannot be taken back. Its label keeps two lines whatever it says (`min-height: 2lh`), so the field stands where it was drawn and never moves when the label wraps. It only collects the words: the commit beside it is held until they match and says why with `typedFirst`, and the server compares them again.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `expect` | `string` | required | What is to be typed; the placeholder too. |
| `value` | `string` | required | What has been typed. |
| `onValueChange` | `(value: string) => void` | none | Handed the words. |
| `label` | `ReactNode` | `Type {expect} to confirm` | The words over the field. |
| every other `TextField` prop | | | `error`, `name`, `size` and the rest. |

`typedFirst(expect)` returns `Type {expect} first.`, the reason a held commit gives.

CSS: `ui.css` (`ui-confirm-label`) plus the field classes.

Dependencies: `TextField`.

### Accordion

Sections that open under their heads. The open items are a list of values, held by the caller or by the accordion.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `value` | `string[]` | none | The open items, when controlled. |
| `defaultValue` | `string[]` | `[]` | The first open items, when it holds them itself. |
| `onValueChange` | `(value: string[]) => void` | none | Handed the next list. |
| `multiple` | `boolean` | `false` | Several may stand open; otherwise opening one closes the rest. |
| `level` | `2 \| 3 \| 4 \| 5 \| 6` | `3` | The heading level of each head. |
| `className` | `string` | none | Placement. |
| `children` | `ReactNode` | required | `AccordionItem`s. |

Keys: ArrowDown and ArrowUp move between heads and wrap; Home and End go to the ends.

Tokens, CSS and states: see `AccordionItem`.

### AccordionItem

One section of an `Accordion`: `title` is its head (a button with `aria-expanded`), the children its panel (a region named by the head). Throws if drawn outside an `Accordion`.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `value` | `string` | required | Its value in the open list. |
| `title` | `ReactNode` | required | The head's words. |
| `disabled` | `boolean` | `false` | Shuts it natively. |
| `disabledReason` | `string \| undefined` | none | Keeps the head focusable and says why. |
| `className` | `string` | none | Placement. |
| `children` | `ReactNode` | required | The panel. |

States:

- Head: min height `--control-h-sm`, margin `0.125rem -0.5rem`, padding `0.375rem 0.5rem`, radius `--radius-row`, `--text-ui` weight `--weight-ui`, `--fg-strong`. Hover `--field-fill`; press `--field-fill-hover` (`--motion-fast` `--ease-out`). Focus outline 2px `--focus`, offset 2px. Disabled opacity 0.55, `not-allowed`.
- Open (`data-open`): the chevron (`ChevronDownIcon` 15px, `--fg-subtle`) rotates 180deg; the panel's grid rows ease from `0fr` to `1fr` over `--motion-base` `--ease-out`. A closed panel is `inert`.
- Items after the first have a top rule `1px solid var(--line)`.
- Content: padding `0.125rem 0 0.75rem`, `--text-ui`, line height 1.5, `--fg`.

Tokens: `--line`, `--control-h-sm`, `--radius-row`, `--text-ui`, `--fg-strong`, `--fg-subtle`, `--fg`, `--field-fill`, `--field-fill-hover`, `--focus`, `--motion-fast`, `--motion-base`, `--ease-out`.

CSS: `ui-display.css`. Classes `ui-accordion`, `ui-accordion-item`, `ui-accordion-head`, `ui-accordion-trigger`, `ui-accordion-title`, `ui-accordion-chevron`, `ui-accordion-panel`, `ui-accordion-clip`, `ui-accordion-content`.

Dependencies: `useBlocked`; icon `ChevronDownIcon`.

### Announcement

The small pill a front page leads with: a tag, the words and an arrow, the whole one link. In vic-ui `to` renders through `LinkProvider`.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `tag` | `ReactNode` | none | A small pill at its start. |
| `to` | `string` | none | A page of the app. |
| `href` | `string` | none | Any other address. |
| `hue` | `Hue` | none | Colours the tag; without it the tag is the field's fill. |
| `tone` | `"accent" \| undefined` | none | Fills the tag in the accent (`--accent-on` on `--accent`), as a "New" pill is; it outranks `hue`. A look, not a state. |
| `className` | `string` | none | Placement. |
| `children` | `ReactNode` | required | The words. |

States:

- Rest: height 1.75rem, radius `--radius-round`, `--text-ui` weight `--weight-ui`, `--fg-strong` on `--surface-lifted`, `--edge`. Padding `0 0.625rem 0 0.1875rem` (`0.625rem` on the left without a tag).
- Hover: the arrow (`ArrowRightIcon` 13px) goes from `--fg-subtle` to `--fg-strong` (`--motion-base`).
- Press: `--field-fill` with a `0 0 0 1px var(--line)` ring.
- Focus: outline 2px `--focus`, offset 2px.
- Tag: 1.375rem tall, `--text-tag` weight 600, `--fg-strong` on `--field-fill`; with `data-hue`, `--hue-ink` on `--hue`; with `data-tone="accent"`, `--accent-on` on `--accent`.

Tokens: `--radius-round`, `--text-ui`, `--text-tag`, `--fg-strong`, `--fg-subtle`, `--surface-lifted`, `--edge`, `--field-fill`, `--line`, `--focus`, `--hue`, `--hue-ink`, `--accent`, `--accent-on`.

CSS: `ui-display.css`. Classes `ui-announcement`, `ui-announcement-tag`, `ui-announcement-words`, `ui-announcement-arrow`. Needs the `[data-hue]` rules.

Dependencies: the provider's link; icon `ArrowRightIcon`.

### AvatarStack

Faces overlapping in a row, the first `most` of them then `+n`. Each face after the first is cut back by the outline of the one before it, grown by `gap`, with a CSS mask, so clear space shows on whatever is behind. Ported from Kibo UI's Avatar Stack (MIT). The sizes are custom properties on the stack (`--stack-size`, `--stack-overlap`, `--stack-gap`), set from the props, and the cut is worked out from them in the stylesheet, so a page that draws its stack smaller on a phone sets them there and the cut follows.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `children` | `ReactNode` | required | Any face nodes. |
| `size` | `number` | `24` | Each face's size in pixels. |
| `overlap` | `number` | `Math.round(size / 3)` | Pixels each face overlaps the one before. |
| `gap` | `number` | `2` | Clear pixels cut round the face before. |
| `most` | `number` | `10` | Faces drawn before `+n`. |
| `total` | `number` | number of children | The whole count, where the children are only the head of it. |
| `shapes` | `Array<string \| undefined>` | none | Each face's outline as an image whose opaque part is the face; a circle where not given. |
| `label` | `string` | none | Makes it a named `group`. |
| `className` | `string` | none | Placement. |

States: none. The `+n` face is round (`--radius-round`), weight 600, tabular numerals, `--fg-strong` on `--field-fill`, at `--text-tag` under 28px and `--text-meta` from 28px; it reads "and n more" to a screen reader.

Tokens: `--radius-round`, `--fg-strong`, `--field-fill`, `--text-tag`, `--text-meta`.

CSS: `ui-display.css`. Classes `ui-avatar-stack`, `ui-avatar-stack-face`, `ui-avatar-stack-more`; each face is `--stack-size` square, and each after the first takes `margin-left: calc(-1 * var(--stack-overlap))` and the mask's position and size from the three properties. Uses an `sr-only` class for the words a screen reader hears; in the source that is Tailwind's utility, not a rule of the library's own stylesheets.

Dependencies: none beyond React.

### Badge

A state said in a word or two. Hairline in its tone is a standing state; `solid` fills it with the tone's ink, asking for a hand now; `soft` sets the tone's ink on its tint, asking less. It always carries words, and lower-case data reads as a sentence: its first letter is raised.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `tone` | `ToneOrAccent` | none (neutral) | `danger`, `caution`, `settled`, `moving` or `neutral`, or `accent`: the brand accent as a look ("New", "Beta"), which says no state. |
| `solid` | `boolean` | `false` | Filled in the tone's ink (or ink with no tone). |
| `soft` | `boolean` | `false` | The tone's ink on its tint, no ring (`--fg-strong` on `--fill-chosen` with no tone). `solid` outranks it. |
| `dot` | `boolean` | `false` | A 0.375rem dot in `currentColor` leads the words. |
| `icon` | `ReactNode` | none | Leads the words (drawn 0.75rem) when there is no dot. |
| `count` | `number` | none | A number after the words, tabular, at opacity 0.75. |
| `children` | `ReactNode` | required | The words. |
| native attributes | `HTMLAttributes<HTMLSpanElement>` | | Passed through. |

States: none interactive. Hairline: height 1.25rem, max width 100%, padding `0 0.4375rem`, radius `--radius-round`, `--text-tag` weight 600, words `var(--tone-ink, var(--fg-strong))`, inset ring `1px var(--tone-edge, var(--line))`. Solid: words `var(--tone-fill-on, var(--ink-words))` on `var(--tone-ink, var(--ink-face-bottom))`, no ring. The badge clears `--tone-ink`, `--tone-edge` and `--tone-fill-on` on itself first, so a badge inside a toned notice is not toned by accident. The words are an item of their own (`ui-badge-words`, line height 1.35), cut with an ellipsis where the row gives less room, their first letter uppercased by `::first-letter`.

Tokens: `--tone-ink`, `--tone-edge`, `--tone-fill-on` (set by `.tone-*`), `--fg-strong`, `--line`, `--ink-words`, `--ink-face-bottom`, `--radius-row`, `--radius-round`, `--text-tag`.

CSS: `ui-display.css` (`ui-badge`, `ui-badge-words`, `ui-badge-solid`, `ui-badge-soft`, `ui-badge-dot`, `ui-badge-icon`, `ui-badge-count`) and `tokens.css` (`tone-danger`, `tone-caution`, `tone-settled`, `tone-moving`, `tone-accent`).

Dependencies: `toneClass`.

### Count

How many are waiting somewhere, as a number on a filled ground (an unread count). Exported from `Badge.tsx`.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `value` | `number` | required | The number. |
| `label` | `string` | required | What a screen reader hears ("3 unread"). |
| `max` | `number` | `99` | Past it, reads `max+`. |
| `tone` | `ToneOrAccent` | none | Fills in that tone's ink; `accent` fills in `--accent-ink` with `--accent-on` words, a look rather than a state. |
| `soft` | `boolean` | `false` | The tone's ink on its tint instead of a fill (`ui-count-soft`). |
| `className` | `string` | none | Placement. |

States: none. Min width and height 1.125rem, padding `0 0.3125rem`, radius `--radius-round`, `--text-tag` weight 600, tabular, words `var(--tone-fill-on, var(--ink-words))` on `var(--tone-ink, var(--ink-face-bottom))`. Soft: words `var(--tone-ink, var(--fg-strong))` on `var(--tone-tint, var(--fill-chosen))`, the same box, so turning soft moves nothing; every tone ink holds 5.8:1 on its own tint.

Tokens: `--tone-ink`, `--tone-fill-on`, `--tone-tint`, `--ink-words`, `--ink-face-bottom`, `--fg-strong`, `--fill-chosen`, `--radius-round`, `--text-tag`.

CSS: `ui-display.css` (`ui-count`, `ui-count-soft`), `tokens.css` (`tone-*`). Uses `sr-only`.

### HeadCount

How many a heading holds, as a quiet number after its words ("Comments 4"). It is read with the heading, so it needs no words of its own. A count waiting for somebody is `Count`, and a tab's is the tab's own. Exported from `Badge.tsx`.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `value` | `ReactNode` | required | The number. |
| `className` | `string` | none | Placement. |

States: none. `--text-tag`, tabular, `--fg-subtle`, in the heading's weight.

CSS: `ui-display.css` (`ui-head-count`).

### toneClass, Tone

Not components. `Tone` is `"danger" | "caution" | "settled" | "moving" | "neutral"`. `ToneOrAccent` is `Tone | "accent"`, taken by the pieces that may be drawn in the accent (Badge, Count); pieces that say a state (Notice, Toast) keep `Tone`, because the accent is a look and never a fifth tone. `toneClass(tone)` returns `` `tone-${tone}` `` for the four tones and `accent`, and `""` for `neutral` or none; the class hands a part `--tone-ink`, `--tone-tint`, `--tone-edge` and `--tone-fill-on` (`tokens.css`). `tone-accent` sets them to `--accent-ink`, `--accent-tint`, `--accent-edge` and `--accent-on`.

### Card

The one surface on the page: `lifted` sits on the page on the lifted surface with an edge and no shadow; `recessed` sinks into it on the field's fill; `tone="danger"` draws the edge in the danger edge, for a danger zone. A head and a foot are drawn only when given.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `as` | `"div" \| "section" \| "form"` | `"div"` | The element it is drawn as. |
| `look` | `"lifted" \| "recessed"` | `"lifted"` | Which surface. |
| `tone` | `"danger" \| undefined` | none | The edge in `--tone-danger-edge`. |
| `plain` | `boolean` | `false` | The children in the card itself, padded `0.75rem 0.875rem`, for a card that lays them out; no head, body or foot. |
| `flush` | `boolean` | `false` | The body has no padding, for rows that run to its edges. |
| `title` | `ReactNode` | none | The head's title (an `h3` unless `level` says otherwise). |
| `level` | `2 \| 3 \| 4 \| 5 \| 6` | `3` | The title's heading level, so a card under a page's `h1` heads with an `h2`. |
| `description` | `ReactNode` | none | Under the title. |
| `actions` | `ReactNode` | none | At the head's end. |
| `foot` | `ReactNode` | none | A foot under a rule. |
| `children` | `ReactNode` | none | The body. |
| native attributes | `HTMLAttributes<HTMLElement>` less `title` | | Passed through (a form's `onSubmit`). |

States: none interactive. Radius `--radius-panel`, `--text-ui`, `--fg`. Lifted: `--surface-lifted` with `--edge`. Recessed: `--field-fill`, its foot's rule `--bone`. Danger (`data-tone="danger"`): `box-shadow: 0 0 0 1px var(--tone-danger-edge)`. Head padding `1rem 1rem 0` (alone or above flush content, padded 1rem below); body `1rem` (`flush` 0); foot `0.75rem 1rem` with a top rule `1px solid var(--line)`. Title `--text-read` weight 600, line height 1.35, `--fg-strong`; description `--fg-subtle`.

Tokens: `--radius-panel`, `--text-ui`, `--text-read`, `--fg`, `--fg-strong`, `--fg-subtle`, `--surface-lifted`, `--edge`, `--field-fill`, `--line`, `--bone`, `--tone-danger-edge`.

CSS: `ui-display.css`. Classes `ui-card`, `ui-card-lifted`, `ui-card-recessed`, `ui-card-plain`, `ui-card-head`, `ui-card-heading`, `ui-card-title`, `ui-card-description`, `ui-card-actions`, `ui-card-body`, `ui-card-flush`, `ui-card-foot`.

### Kbd

A key name drawn as a key. Several keys pressed together are several `Kbd`s side by side.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `children` | `ReactNode` | required | What is drawn (a word or a symbol). |
| `name` | `string` | none | What a screen reader hears where the key is a symbol (`↵` as "Enter"). |
| `className` | `string` | none | Placement. |

States: none. Min width and height 1.25rem, padding `0 0.3125rem`, radius `--radius-mark`, `--font-sans` `--text-tag` weight `--weight-ui`, flat (no bevel, no shadow): `--fg-subtle` on `var(--kbd-fill, color-mix(in oklab, currentColor 12%, transparent))`, its own colour at a low strength so it reads on any ground; a surface that wants another fill sets `--kbd-fill`. A key after a key has 0.1875rem before it.

Tokens: `--radius-mark`, `--font-sans`, `--text-tag`, `--fg-subtle`; local slot `--kbd-fill`.

CSS: `ui-display.css`. Class `ui-kbd`. Uses `sr-only`.

### Notice

Something to read before going on: a rounded tint of its tone led by a short rounded bar and the tone's mark, then the title and words at one size, and any action under them in the same column.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `tone` | `Tone` | `"neutral"` | Its tone. Danger is announced (`role="alert"`) and draws its words in the danger ink. |
| `title` | `ReactNode` | none | Bold first line, same size as the words. |
| `icon` | `ReactNode` | the tone's mark | Overrides the mark. |
| `action` | `ReactNode` | none | Under the words. |
| `onDismiss` | `() => void` | none | Adds a close button at its end. |
| `dismissLabel` | `string` | `"Dismiss"` | The close button's name. |
| `children` | `ReactNode` | none | The words. |
| native attributes | `HTMLAttributes<HTMLDivElement>` less `title` | | Passed through. |

Marks per tone: danger `AlertCircleIcon`, caution `AlertTriangleIcon`, settled `CheckCircleIcon`, moving `ClockIcon`, neutral `InfoCircleIcon`, drawn 1rem in `var(--tone-ink, var(--fg-strong))`.

States:

- Ground `var(--tone-tint, var(--field-fill))`, radius `--radius-field`, padding `0.625rem 0.75rem 0.625rem 0.5rem`, gap 0.625rem, `--text-ui` line height 1.45, words `--fg-strong` (danger: `--tone-danger-ink`). The words stay strong on every tint.
- Bar: 3px wide, round, `var(--tone-ink, var(--fg-strong))`, as tall as the words.
- Dismiss: 1.5rem square, radius `--radius-row`, `currentColor`; hover `color-mix(in oklab, currentColor 10%, transparent)`, press 16%; focus outline 2px `--focus`, offset 2px. Icon `XIcon` 14px.

Tokens: `--tone-ink`, `--tone-tint` (cleared on itself, then set by `.tone-*`), `--field-fill`, `--fg-strong`, `--tone-danger-ink`, `--radius-field`, `--radius-round`, `--radius-row`, `--text-ui`, `--focus`.

CSS: `ui-display.css` (`ui-notice`, `ui-notice-danger`, `ui-notice-bar`, `ui-notice-icon`, `ui-notice-body`, `ui-notice-title`, `ui-notice-words`, `ui-notice-action`, `ui-notice-dismiss`) and `tokens.css` (`tone-*`).

Dependencies: `toneClass`; icons `AlertCircleIcon`, `AlertTriangleIcon`, `CheckCircleIcon`, `ClockIcon`, `InfoCircleIcon`, `XIcon`.

### Problem

A refusal or a failure said in a line of its own, beside what met it: the words in the danger ink at the working size, with no box, announced as they arrive (`role="alert"`). It says what to do next. A refusal at a dialog's foot is `FootProblem`; one too long for a line, or one that stands for a whole page, is a danger `Notice`.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `as` | `"p" \| "span" \| "div"` | `"p"` | `span` inside a line of words, `div` for several lines. |
| native attributes | `HTMLAttributes<HTMLElement>` | | Passed through. |

States: none. No margin, `--text-ui`, `--tone-danger-ink`.

CSS: `ui-display.css` (`ui-problem`).

### Textarea

Words over several lines, in the box `TextField` draws. Optionally grows with its words; optionally counts them.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `label` | `ReactNode` | none | The label. |
| `aria-label` | `string` | none | Its name where there is no label. |
| `hint` | `ReactNode` | none | Under the box. |
| `error` | `ReactNode` | none | A short error in the label's place. |
| `onValueChange` | `(value: string) => void` | none | Handed the words; native `onChange` still runs. |
| `grow` | `boolean` | `false` | Grows with what is typed between `rows` and `maxRows`, then scrolls. |
| `rows` | `number` | `3` | Its height in lines (the least, with `grow`). |
| `maxRows` | `number` | `8` | The most lines with `grow`. |
| `maxLength` | `number` | none | Adds "n of max" at the end of the line under it, which is then always drawn. |
| `size` | `"sm"` | none | The dense padding. |
| `disabled` | `boolean` | `false` | Natively disabled. |
| `disabledReason` | `string \| undefined` | none | Focusable, takes no words (`readOnly`, `aria-disabled`), says why. |
| `ref` | `Ref<HTMLTextAreaElement>` | none | Forwarded. |
| native attributes | `TextareaHTMLAttributes` less `size` | | Passed through. |

States:

- Box: height auto, stretches; textarea padding `0.5rem 0.75rem` (`sm`: `0.375rem 0.625rem`), line height 1.5, `resize: vertical` (none with `grow`).
- Hover, error and disabled: as `TextField`; disabled or held also sets `data-disabled` on the box (opacity 0.55, `not-allowed`, hover stays `--field-fill`). A held field that takes focus draws `0 0 0 2px var(--focus)` round the box.
- Count: `--text-ui`, tabular, `--fg-subtle`; at the limit (`data-full`) `--tone-caution-ink` (`--motion-fast`). The foot line keeps `calc(var(--text-ui) * 1.45)` height.

Tokens: the field tokens, `--tone-caution-ink`, `--focus`.

CSS: `ui-inputs.css` (`ui-textarea-box`, `ui-textarea`, `ui-field-foot`, `ui-field-count`, `ui-field-box[data-disabled]`) plus the field classes in `ui.css`.

Dependencies: `FieldHead`, `FieldHint`, `describedBy`, `useFieldReason`.

### Combobox

A field typed into to find a choice in a list: the field box, the list on the floating surface in the top layer. One choice (`value`) or several (`values`, each a chip with an x). Focus never leaves the field.

Shared props:

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `label` | `ReactNode` | none | The label. |
| `aria-label` | `string` | none | Its name where there is no label. |
| `items` | `Items` | required | The options; `group` draws headings in first-seen order. |
| `placeholder` | `string` | none | Said while nothing is typed; open, a single field says its choice instead. |
| `hint` | `ReactNode` | none | Under the box. |
| `error` | `ReactNode` | none | A short error in the label's place. |
| `empty` | `ReactNode` | none | Said when nothing matches; without it an empty list stays shut. |
| `footer` | `ReactNode` | none | At the foot of the open list, under a rule. |
| `query` | `string` | held inside | What is typed, when held by the page (a server search). |
| `onQueryChange` | `(query: string) => void` | none | Handed what is typed. |
| `filter` | `false \| (option, query) => boolean` | substring match on `textOf`, case-insensitive | `false` filters nothing (the server narrowed it). |
| `chosenItems` | `Items` | none | Draws chosen values the current `items` no longer carry. |
| `steady` | `boolean` | `false` | The open list keeps one height from opening, on the side with more room. |
| `onOpenChange` | `(open: boolean) => void` | none | Told when it opens and closes. |
| `disabled` | `boolean` | `false` | Natively disabled. |
| `disabledReason` | `string \| undefined` | none | Focusable, takes no words, says why. |
| `name` | `string` | none | Posts each chosen value through a hidden input. |
| `id` | `string` | `useId()` | The input's id. |
| `size` | `"sm"` | none | The dense height. |
| `className` | `string` | none | Placement. |

One choice (`One`): `value: string | null` (required), `onValueChange?: (value: string) => void`. Emptying what was typed never unchooses it.

Several (`Many`): `values: string[]` (required), `onValuesChange?: (values: string[]) => void`, `chip?: (value, option) => ReactNode` (a chip's words; the label by default), `chipLabel?: (value, option) => string` (the x's name; `` `Take ${words} off` `` by default), `chipEnd?: (value) => ReactNode` (a word at a chip's end saying how it stands: Sending, Sent, Not sent; a `status` region), `chipTone?: (value) => Tone | undefined` (a chip whose state is not fine, as an address the server refused) and `chipFixed?: (value) => boolean` (a chip that cannot be taken off yet: no x, and Backspace passes it by). Choosing keeps the list open; choosing a chosen one takes it off; Backspace in an empty field takes off the last.

`ComboboxProps` is `One | Many`.

Keys: ArrowDown and ArrowUp open or move (skipping disabled, no wrap); Enter chooses the active option; Escape closes (keeping the choice); Tab closes; Backspace as above. Closing empties what was typed.

States:

- Box: as `TextField`, `cursor: text`; open `--field-fill-hover`; a press on the box beyond the input focuses the input and toggles the list.
- Input: a chosen name longer than the field ends in an ellipsis (`text-overflow: ellipsis`).
- Several: the box wraps (gap 0.25rem, padding 0.25rem, min height `--control-h`; `sm` padding 0.1875rem, min `--control-h-sm`); the input is `flex: 1 0 6rem` at `calc(var(--control-h) - 0.5rem)`.
- Chip: `calc(var(--control-h) - 0.5rem)` tall (`sm`: `calc(var(--control-h-sm) - 0.375rem)`), radius `--radius-row`, `--surface-lifted`, ring `0 0 0 1px var(--tone-edge, var(--line-soft))`, `--text-ui`, words `var(--tone-ink, var(--fg-strong))`; the chip clears `--tone-ink` and `--tone-edge` on itself first, so only a tone named on it colours it. Its end word: `--text-meta`, `var(--tone-ink, var(--fg-subtle))`, padding-inline `0.375rem 0.25rem`. Its x is 1.25rem, radius `calc(var(--radius-row) - 0.25rem)`, `--fg-subtle`; hover `--fill-chosen` and `--fg-strong`, press `--fill-press`. Disabled chips have no x.
- List: as `Select`'s (`ui-menu`, offset 6, flip, shift, min width of the box, max height `min(LIST_MOST, max(LIST_LEAST, availableHeight))`px, and with `steady` that height fixed). Active row `data-active`; press on a row `--fill-press`; chosen rows end in a tick; group headings `--text-meta` weight 600 `--fg-subtle`; empty and foot `--text-ui` `--fg-subtle`, the foot under `1px solid light-dark(oklch(0 0 0 / 0.06), oklch(1 0 0 / 0.08))`.
- Disabled and held: as `Textarea`.

Tokens: the field tokens, the list tokens, `--surface-lifted`, `--radius-row`, `--radius-mark`, `--text-meta`, `--control-h`, `--control-h-sm`.

CSS: `ui-inputs.css` (`ui-combo-box`, `ui-combo-input`, `ui-combo-chip`, `ui-combo-chip-words`, `ui-combo-chip-state`, `ui-combo-chip-x`, `ui-combo-start`, `ui-combo-menu`, `ui-menu-group`, `ui-menu-empty`, `ui-menu-foot`, `ui-start`) plus `ui-menu`, `ui-menu-item` and the field classes in `ui.css`.

Dependencies: `@floating-ui/dom` (used directly), `LIST_MOST`, `LIST_LEAST`, `toneClass`, `FieldHead`, `FieldHint`, `describedBy`, `toOptions`, `textOf`, `useFieldReason`; icons `CheckIcon`, `XIcon`.

### SearchField

A search: the field's box with a glass at its start and, once it has words, a clear button at its end. Escape empties it while it has words, and only then, so the key otherwise reaches the dialog around it. The wrapper has `role="search"`, but for a `bare` one.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `value` | `string` | required | The words. |
| `onValueChange` | `(value: string) => void` | required | Handed the words. |
| `label` | `ReactNode` | none | The label. |
| `aria-label` | `string` | none | Its name where there is no label. |
| `hint` | `ReactNode` | none | Under the box. |
| `error` | `ReactNode` | none | A short error in the label's place. |
| `clearLabel` | `string` | `"Clear the search"` | The clear button's name. |
| `size` | `"sm"` | none | The dense height a page header carries. |
| `bare` | `boolean` | `false` | No fill or edge of its own, for a search that is one part of a box a page draws around it; no `search` role. |
| `disabled` | `boolean` | `false` | Natively disabled. |
| `disabledReason` | `string \| undefined` | none | Focusable, takes no words, says why. |
| `ref` | `Ref<HTMLInputElement>` | none | Forwarded. |
| native attributes | `InputHTMLAttributes` less `size`, `value`, `onChange`, `type` | | Passed through. |

States:

- Glass: `MagnifyingGlassIcon` 16px (`sm` 14px), margin-left 0.75rem (`sm` 0.625rem), `--fg-subtle`; `--fg-strong` while the box has focus (`--motion-fast`).
- Clear: shown while it has words and is not disabled or held; 1.5rem square (`sm` 1.375rem), radius `--radius-row`, `--fg-subtle`; hover `--fill-chosen` and `--fg-strong`; press `--fill-press`; focus outline 2px `--focus`, offset 2px. Icon `XIcon` 14px (`sm` 13px). A press empties it and puts the focus back.
- The browser's own cancel button and decoration are hidden.
- Box, error, disabled and held: as `Textarea`.

Tokens: the field tokens, `--radius-row`, `--focus`.

CSS: `ui-inputs.css` (`ui-search-box`, `ui-search-glass`, `ui-search`, `ui-search-clear`, `ui-search-bare`) plus the field classes.

Dependencies: `FieldHead`, `FieldHint`, `describedBy`, `useFieldReason`; icons `MagnifyingGlassIcon`, `XIcon`.

### NumberField

A number typed as words: the field's box with what is fixed before and after it inside, the decimal keyboard on a phone, and the text handed whole to `onValueChange`, so the page decides what it accepts. Digits are tabular.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `value` | `string` | required | The text. |
| `onValueChange` | `(value: string) => void` | required | Handed the text, never while held. |
| `label` | `ReactNode` | none | The label. |
| `aria-label` | `string` | none | Its name where there is no label. |
| `prefix` | `ReactNode` | none | Before the number (a `$`); hidden from a screen reader. |
| `suffix` | `ReactNode` | none | After it ("per hour"). |
| `hint` | `ReactNode` | none | Under the box. |
| `error` | `ReactNode` | none | A short error in the label's place. |
| `whole` | `boolean` | `false` | `inputMode="numeric"` rather than `"decimal"`. |
| `size` | `"sm"` | none | The dense height. |
| `disabled` | `boolean` | `false` | Natively disabled. |
| `disabledReason` | `string \| undefined` | none | Focusable, takes no words, says why. |
| `ref` | `Ref<HTMLInputElement>` | none | Forwarded. |
| native attributes | `InputHTMLAttributes` less `size`, `value`, `onChange`, `type`, `prefix` | | Passed through. |

States: as `Textarea`'s box states. The input is `type="text"`, `autoComplete="off"`, tabular numerals; with a prefix its left padding is 0.3rem.

Tokens: the field tokens, `--focus`.

CSS: `ui-inputs.css` (`ui-number-box`, `ui-number`, `ui-field-prefix`) plus the field classes.

Dependencies: `FieldHead`, `FieldHint`, `describedBy`, `useFieldReason`.

### Dialog

A dialog on the browser's own `<dialog>`, opened with `showModal`, so it sits in the top layer, holds the focus and gives it back on closing. Escape and a press on the veil close it; on a phone it rises from the bottom edge.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `open` | `boolean` | required | Whether it is up. |
| `onOpenChange` | `(open: boolean) => void` | required | Called with `false` on Escape and on a press on the veil. |
| `title` | `ReactNode` | required | The heading (`h2`), its `aria-labelledby`. |
| `description` | `ReactNode` | none | Under the title, its `aria-describedby`. |
| `children` | `ReactNode` | none | The body. |
| `foot` | `ReactNode` | none | The actions, under a rule. |
| `problem` | `ReactNode` | none | A refusal at the foot's start (`FootProblem`). |
| `onSubmit` | `(event: FormEvent<HTMLFormElement>) => void` | none | Makes the body and foot one form. |
| `size` | `"sm" \| "lg"` | none | Width `min(25rem, ...)` or `min(36rem, ...)`; default `min(30rem, calc(100vw - 2rem))`. |
| `role` | `"dialog" \| "alertdialog"` | `"dialog"` | `alertdialog` for a question and its answers. |
| `still` | `boolean` | `false` | Holds a phone's sheet at full height (88dvh). |
| `bare` | `boolean` | `false` | Children go straight into the frame under the head. |
| `className` | `string` | none | Placement. |
| `ref` | `Ref<HTMLDialogElement>` | none | The `<dialog>`. |

States:

- Up: `--surface-lifted`, radius `--radius-panel`, `--shadow-float`, max height `calc(100dvh - 2rem)`, scrolls inside; enters with `ui-dialog-in` (opacity 0 and scale 0.98, `--motion-base` `--ease-out`, `backwards`).
- Veil: `light-dark(oklch(0.209 0 0 / 0.28), oklch(0 0 0 / 0.62))` with `blur(3px)`, fading in over `--motion-base`.
- Focus: the dialog itself draws no outline.
- Head padding `1.25rem 1.25rem 0`; title `--font-display` 700 at 1.25rem, line height 1.15, letter spacing -0.02em, balanced, `--fg-strong`; description `--text-read`, line height 1.5, max 46ch, `--fg-subtle`.
- Body: grid gap 1rem, padding `1rem 1.25rem 1.25rem`. Foot: flex end, gap 0.5rem, padding `0.75rem 1.25rem`, top rule `1px solid var(--line)`, ground `--fill-faint`; directly under the head it has 1.25rem above.
- Problem: `--text-ui`, line height 1.4, `--tone-danger-ink`, `role="alert"`.
- Below 640px: full width, max height 88dvh, at the bottom, top corners `--radius-panel`, entering with `ui-sheet-in` (from `translate: 0 100%`, `--motion-base`).
- Reduced motion: no entrance animation.

Tokens: `--surface-lifted`, `--radius-panel`, `--shadow-float`, `--fg`, `--fg-strong`, `--fg-subtle`, `--font-display`, `--text-read`, `--text-ui`, `--line`, `--tone-danger-ink`.

CSS: `ui-overlays.css`. Classes `ui-dialog`, `ui-dialog-sm`, `ui-dialog-lg`, `ui-dialog-still`, `ui-dialog-frame`, `ui-dialog-form`, `ui-dialog-head`, `ui-dialog-title`, `ui-dialog-description`, `ui-dialog-body`, `ui-dialog-foot`, `ui-dialog-problem`; keyframes `ui-dialog-in`, `ui-sheet-in`, `ui-veil-in`.

Dependencies: `FootProblem`. A `Select`, `Menu` or `Combobox` inside opens in the top layer above it.

### FootProblem

A refusal in a dialog's foot: at its start, in the danger ink, announced, on the row of the buttons it answers. Draws nothing while there is none.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `children` | `ReactNode` | none | The refusal. |

Tokens, CSS: as `Dialog` (`ui-dialog-problem`).

### Menu

A list of actions opened from a trigger, or at a point (for the right button), on the floating surface in the top layer. Worked as a menu: arrows move and wrap, Home and End go to the ends, Enter or Space chooses, a letter jumps (700ms type-ahead), Escape or a choice closes it and puts the focus back.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `items` | `MenuItem[]` | required | Actions, rows holding a control, rules, group headings and a head. |
| `aria-label` | `string` | none | The menu's name. |
| `placement` | `Placement` | `"bottom-start"` | Where it opens. |
| `className` | `string` | none | Placement. |
| `trigger` | `(props: MenuTriggerProps) => ReactElement` | one of `trigger` or `at` | Draws the opener and spreads the props on it. |
| `at` | `{ x: number; y: number }` | | Opens at a point; then `open` and `onOpenChange` are required. |
| `open` | `boolean` | held inside | Controlled open state. |
| `onOpenChange` | `(open: boolean) => void` | none | Told of each change. |

```ts
interface MenuAction { label: ReactNode; text?: string; icon?: ReactNode; hint?: ReactNode; end?: ReactNode;
  onSelect: () => void; danger?: boolean; disabled?: boolean; disabledReason?: string | undefined; }
interface MenuControl { label: ReactNode; text?: string; icon?: ReactNode; control: ReactNode; }
type MenuItem = MenuAction | MenuControl | { separator: true } | { group: ReactNode } | { head: ReactNode };
interface MenuTriggerProps { ref; "aria-haspopup": "menu"; "aria-expanded": boolean; "aria-controls": string;
  onClick: (event: { detail: number }) => void; onKeyDown: (event) => void; }
```

`end` is a quiet word at an action's end ("Done", "3 of 5"). A `MenuControl` row holds a control of its own at its end (a switch, a switcher): the arrows reach it as they reach an action, the focus goes into the control (its chosen or checked part, else its first button or input), and while it is there only ArrowDown, ArrowUp, Escape and Tab are the menu's, so the control's own keys work it; it is never chosen. A `head` stands over every row (your name and role) and the keys pass over it.

A click from the keys (Enter or Space, `detail === 0`) opens on the first action; a pointer press opens on none; ArrowDown or ArrowUp on the trigger opens on the first or last.

States:

- Surface: `ui-menu` (see below) plus min width 11rem, max width `min(20rem, calc(100vw - 1rem))`; no outline on the menu or its items.
- Item: min height 2.125rem, padding `0.4rem 0.65rem`, radius `calc(var(--radius-float) - 0.3rem)`, `--text-read`, `--fg-strong`. Active (`data-active`, pointer or keys): `--fill-hover`; the icon (1rem slot, `--fg-subtle`) goes `--fg-strong`. Press: `--fill-press`. Background eases over `--motion-fast`.
- Danger: words and icon `--tone-danger-ink`; active ground `--tone-danger-tint`.
- Disabled with no reason: opacity 0.55, `not-allowed`, passed over by the keys.
- Disabled with a reason: still reached by the keys; active ground `--fill-faint`; the reason shows in a tooltip to the right while it is active.
- Rule: 1px `--line`, margin `0.3rem 0.4rem`. Group label: `--text-meta` weight 600 `--fg-subtle`, padding `0.35rem 0.65rem 0.2rem`.
- Hint: `--text-meta`, `--fg-subtle`, wraps.
- End word: `--text-meta`, `--fg-subtle`, not shrinking.
- Control row (`data-control`): `cursor: default`; the control sits at the end with `margin-block: -0.25rem`, so the row keeps its height.
- Head: flex, gap 0.625rem, padding `0.4rem 0.65rem 0.5rem`, margin-bottom 0.3rem, a bottom rule `1px solid var(--line)`, `--fg-strong`.

Tokens: `--radius-float`, `--surface-lifted`, `--shadow-float`, `--fg`, `--fg-strong`, `--fg-subtle`, `--text-read`, `--text-meta`, `--tone-danger-ink`, `--tone-danger-tint`, `--line`.

CSS: `ui.css` (`ui-menu`, `ui-menu-item`, `ui-menu-words`, `ui-menu-hint`, `ui-menu-end`, `ui-menu-control`, `ui-menu-head`, keyframes `ui-menu-in`) and `ui-overlays.css` (`ui-menu-actions`, `ui-menu-icon`, `ui-menu-rule`, `ui-menu-section`, `ui-menu-label`). Note that `.ui-menu-group` is also styled in `ui-inputs.css` as a combobox's heading (padding, `--text-meta`, weight 600, `--fg-subtle`), and in the source a menu's group wrapper carried that class too, so a grouped menu's rows were inset 0.65rem and inherited weight 600. That was a defect in the source at `e7221f50`, since fixed there too. A menu's section is `.ui-menu-section`, with the same `margin-top: 0.3rem` after a section or an item, and `.ui-menu-group` stays the list's heading alone.

Dependencies: `useAnchored`, `usePressAway`, `atPoint`, `useTip`.

### Popover

Free content hung from a trigger, on the floating surface in the top layer. A dialog that does not hold the page: a press outside, Escape, or the focus leaving it and its trigger closes it; Escape puts the focus back on the trigger. On opening the focus goes to its first control, or to it.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `open` | `boolean` | required | Whether it is up. |
| `onOpenChange` | `(open: boolean) => void` | required | Asked to change. |
| `trigger` | `(props: PopoverTriggerProps) => ReactElement` | required | Draws the opener. |
| `children` | `ReactNode` | required | The content. |
| `placement` | `Placement` | `"bottom-start"` | Where it opens. |
| `aria-label` | `string` | none | Its name (`role="dialog"`). |
| `className` | `string` | none | Placement or a piece built on it. |

`PopoverTriggerProps` is `{ ref, "aria-haspopup": "dialog", "aria-expanded": boolean, "aria-controls": string, onClick }`.

States: `ui-menu` surface plus width `max-content`, max width `min(22rem, calc(100vw - 1rem))`, padding 0.875rem, `--text-ui`, line height 1.5; no focus outline on the surface. Not height-capped (`fit: false`).

Tokens: the `ui-menu` tokens and `--text-ui`.

CSS: `ui.css` (`ui-menu`) and `ui-overlays.css` (`ui-popover`).

Dependencies: `useAnchored`, `usePressAway`.

### LIST_MOST, LIST_LEAST

`320` and `120`: the tallest any floating list stands and the shortest it is squeezed to before it flips. `useAnchored`'s `fit`, `Select` and `Combobox` all read them. Exported from `Popover.tsx`.

### atPoint

`atPoint(x, y)` returns a `VirtualElement` (a zero-size rectangle at the point) for `useAnchored` or `Menu`'s `at`. `Anchor` is `Element | VirtualElement`.

### useAnchored

The hook every floating piece but `Combobox` is placed by. While `open`, it calls `showPopover()` on the floating element, positions it with `computePosition` (`strategy: "fixed"`, middleware `offset(gap)`, `flip({ padding: 8, fallbackAxisSideDirection: "end" })` (so one set beside its trigger with no room on either side goes above or below rather than off the window), `shift({ padding: 8 })`, and `size({ padding: 8 })` when `fit` or `matchWidth`), resets to `0,0` before each measure, writes `left`, `top` and `data-side`, and keeps it there with `autoUpdate` (an element anchor) or on window resize (a point). On close it hides the popover.

| Argument | Type | Default | Meaning |
| --- | --- | --- | --- |
| `open` | `boolean` | required | Whether to show it. |
| `anchor` | `() => Anchor \| null` | required | Read when it opens and when `track` changes. |
| `floating` | `RefObject<HTMLElement \| null>` | required | The element to place. |
| `how.placement` | `Placement` | `"bottom-start"` | Side and alignment. |
| `how.gap` | `number` | `6` | Offset in pixels. |
| `how.fit` | `boolean` | `true` | Caps max height to `min(LIST_MOST, max(LIST_LEAST, availableHeight))`px (320 and 120). |
| `how.matchWidth` | `boolean` | `false` | Min width of the anchor. |
| `how.track` | `unknown` | none | Places it again when this changes. |

Dependencies: `@floating-ui/dom`.

### usePressAway

`usePressAway(open, inside, away)`: while `open`, a `pointerdown` (capture phase) anywhere outside every element `inside()` returns calls `away()`.

### Tooltip

A word or two in ink beside a control: shown after the pointer rests or at once on keyboard focus, never on touch; hidden on leaving, on a press and on Escape. In the top layer, portalled to the body.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `content` | `ReactNode` | required | The words. Empty, `false`, `null` or `undefined` draws nothing. |
| `children` | `ReactElement` | required | The one element it describes; given the handlers, a ref and `aria-describedby` beside its own. |
| `placement` | `Placement` | `"top"` | Its side. |
| `delay` | `number` | `TIP_DELAY_MS` (500) | Rest before it shows. |

States: once one tooltip has shown, the next shows at once for 400ms after it hides ("warm"). Placed with gap 6 and no height cap. Surface: width `max-content`, max `min(18rem, calc(100vw - 16px))`, padding `0.3rem 0.6rem`, radius `--radius-float`, `--text-meta` weight `--weight-ui`, line height 1.35, `--fg-inverse` on `--bg-contrast`, `--shadow-raise`, `pointer-events: none`, fading in over `--motion-fast`. The tooltip element is `aria-hidden`; a hidden span with the same words carries the `aria-describedby` id.

Tokens: `--radius-float`, `--text-meta`, `--fg-inverse`, `--bg-contrast`, `--shadow-raise`.

CSS: `ui-overlays.css`. Class `ui-tooltip`, keyframes `ui-tip-in`, and the rule `[data-reason][aria-disabled="true"] { cursor: not-allowed; }`.

Dependencies: `react-dom` (`createPortal`), `useAnchored`.

### useReason

`useReason(reason?, { placement? })`: for any control that cannot be used and knows why. With a reason it returns `props` to spread on the control last (`ref`, `aria-disabled: true`, `aria-describedby`, `data-reason`, the tooltip's handlers, a click that is swallowed, and Enter and Space prevented) and `node` (the tooltip) to render beside it. Without a reason, `props` is `{}` and `node` is `null`, so the control is disabled the native way.

### useTip

`useTip(content, { placement?, delay? })`: the tooltip engine `Tooltip` and `useReason` share. Returns `{ id, anchor, open, show(now?), hide(), node, handlers, has }`. `handlers` are `onPointerEnter` (not touch), `onPointerLeave`, `onPointerDown`, `onFocus` (only when `:focus-visible`, shown at once), `onBlur`, `onKeyDown` (Escape hides it and stops the key). `show` and `hide` are for a piece that moves its own focus.

### TIP_DELAY_MS

`500`: how long the pointer rests before a tooltip shows.

### Tabs

The one switcher between views: a row of tabs on the field's fill with an ink indicator under the chosen one, which eases from tab to tab. The chosen tab is told by the indicator and its words' colour, never their weight.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `items` | `Items \| ReadonlyArray<TabOption>` | required | The tabs. |
| `value` | `string` | required | The chosen tab. |
| `onValueChange` | `(value: string) => void` | none | Called when a tab is chosen. |
| `aria-label` | `string` | none | The row's name. |
| `idPrefix` | `string` | `useId()` | Each tab is `${idPrefix}-${value}`; with it given, each controls `${idPrefix}-${value}-panel`. |
| `size` | `"sm"` | none | The dense height. |
| `tone` | `"accent" \| undefined` | none | The indicator in the accent and the chosen tab's words in `--accent-on` (`ui-tabs-accent`). A look, not a state. |
| `className` | `string` | none | Placement. |

`TabOption` is `Option` plus `count?: number | string` (after the words, tabular, two digits wide), `disabledReason?: string` (stays focusable and says why), `to?: string` (drawn as a link through `LinkProvider`; chosen from the keys, it is followed) and `apart?: boolean` (a hairline before it, starting a second group).

Keys: ArrowRight and ArrowLeft move and choose as they go (wrapping, skipping disabled tabs without a reason); Home and End go to the ends. Only the chosen tab is in the tab order.

States:

- Track: inline flex, height `--control-h` (`sm`: `--control-h-sm`), padding 2px, radius `--radius-field`, `--field-fill`, scrolls sideways with no scrollbar.
- Indicator, accent (`tone="accent"`): the track sets `--ink-face-top` to `--accent` mixed with white 4%, `--ink-face-bottom` with black 10%, `--ink-rim-edge` with black 22%, and `--ink-words` to `--accent-on`, which hold 5.8:1 in both modes.
- Indicator: `linear-gradient(var(--ink-face-top), var(--ink-face-bottom))` with a `0 0 0 1px var(--ink-rim-edge)` ring, radius `calc(var(--radius-field) - 2px)`, measured onto the chosen tab (and again on any resize); the first placing is drawn where it lands, every move after eases `translate` and `width` over `--motion-base` `--ease-track`.
- Tab: padding `0 0.75rem`, `--text-ui` weight `--weight-ui`, `--fg-subtle`. Hover (not chosen, not disabled): `--fg-strong` on `--field-fill-hover`. Press: `--bone`. Chosen: `--ink-words`. Focus: outline 2px `--focus`, offset 2px. Disabled or `aria-disabled`: opacity 0.55, `not-allowed`.
- Rule: 1px by 1rem, `--line`, margin 0.25rem each side.
- Count: min width 2ch, `--text-tag`, tabular, opacity 0.65.

Tokens: `--control-h`, `--control-h-sm`, `--radius-field`, `--field-fill`, `--field-fill-hover`, `--ink-face-top`, `--ink-face-bottom`, `--ink-rim-edge`, `--ink-words`, `--accent`, `--accent-on`, `--ease-track`, `--text-ui`, `--text-tag`, `--fg-subtle`, `--fg-strong`, `--bone`, `--focus`, `--line`.

CSS: `ui-data.css`. Classes `ui-tabs`, `ui-tabs-sm`, `ui-tabs-accent`, `ui-tabs-mark`, `ui-tab`, `ui-tabs-rule`, `ui-tab-count`.

Dependencies: `toOptions`, `useReason`, the provider's link.

### Table

The one table: dense rows, a head pinned to the top of its scroller, every number in tabular numerals. Columns and rows are data; sorting is the caller's.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `columns` | `ReadonlyArray<TableColumn>` | required | The columns. |
| `rows` | `ReadonlyArray<Row>` | required | The rows. |
| `rowKey` | `(row: Row) => string` | required | Each row's key. |
| `cell` | `(row, column) => ReactNode` | `row[column.key]` | Draws a cell. |
| `sort` | `TableSort \| null` | none | The current sort. |
| `onSortChange` | `(sort: TableSort) => void` | none | A sortable head asks for its column ascending, then descending. |
| `onRowPress` | `(row: Row) => void` | none | Makes each row pressable by pointer and by Enter or Space. |
| `rowPressable` | `(row: Row) => boolean` | every row | Which rows `onRowPress` opens, where not every row goes somewhere; a row that is not lights nothing and takes no focus. |
| `after` | `(row: Row) => ReactNode` | none | A line under a row across every column, for what is wrong with it or still to do, read as part of it. |
| `currentKey` | `string \| null` | none | The row drawn as the one open beside it (`aria-current`). |
| `empty` | `ReactNode` | `"Nothing here yet."` | Fills the body with no rows. |
| `aria-label` | `string` | none | The table's name. |
| `height` | `string` | none | Caps the scroller so the head pins inside it; without it the head pins to the page's scroller. |
| `className` | `string` | none | On the scroller. |
| `rowProps` | `(row) => HTMLAttributes & data attributes` | none | Added to each row, after its own. |
| `tableProps` | `TableHTMLAttributes` | none | Added to the table. |
| `tableRef` | `Ref<HTMLTableElement>` | none | The table. |
| `caption` | `ReactNode` | none | A `caption` as the table's first child, at `--text-ui` in `--fg-subtle`, start-aligned. It names the table only when `aria-label` is not set. |
| `rowHeaderKey` | `string` | none | That column's cells are `th scope="row"`, so each row is named by it. They read as body cells: the body's weight, and the roster look and the line under a row apply to them too. |
| `cellProps` | `(row, column) => HTMLAttributes & data attributes` | none | Added to each body cell; its `className` joins the column's. |

`TableColumn` is `{ key: string; label: ReactNode; align?: "start" | "center" | "end"; width?: string | number; sort?: boolean; className?: string }`. `TableSort` is `{ key: string; direction: "asc" | "desc" }`.

States:

- Scroller: `--ui-table-ground: var(--bg-base)`, `overflow-x: clip`; with a height, `overflow: auto`.
- Cells: padding `0.5rem 0.75rem`, bottom rule `1px solid var(--line-soft)`, `--text-read`, `--fg`; `data-align` end and center.
- Head: sticky at top, padding-block 0.4rem, `--text-ui` weight 600, `--fg-subtle` on `--ui-table-ground`, rule `--line`.
- Sort button: radius `--radius-row`; hover `--fg-strong` on `--field-fill`; press `--field-fill-hover`; focus outline 2px `--focus`, offset 2px; sorted `--fg-strong`. Its arrow (`ArrowDownIcon` 12px) always holds its room: opacity 0, 0.4 on hover, 1 when sorted; ascending rotates 180deg.
- Pressable row: `cursor: pointer`; hover `--field-fill`; press `--field-fill-hover`; focus outline 2px `--focus`, offset -2px. Current row `--field-fill-hover`. Background eases over `--motion-fast`.
- After: a row of its own (`ui-table-after`) with one cell spanning the columns, no top padding, and the row above it loses its rule, so the two read as one.
- Empty: padding-block 2rem, centred, `--fg-subtle`.

Tokens: `--bg-base`, `--line-soft`, `--line`, `--text-read`, `--text-ui`, `--fg`, `--fg-subtle`, `--fg-strong`, `--radius-row`, `--field-fill`, `--field-fill-hover`, `--focus`.

CSS: `ui-data.css`. Classes `ui-table-scroll`, `ui-table`, `ui-table-sort`, `ui-table-sort-mark`, `ui-table-after`, `ui-table-empty`. There is no toolbar piece: filters above a table are the page's own row of fields.

Dependencies: icon `ArrowDownIcon`.

### RowGroup, Rows, Row, RowsMore

Groups of rows with an optional secondary `description` (`List.tsx`): a group's head is a small mark in its hue, a short heading, its count and where the rest is; its rows each carry a mark, the words, where and when, and one action at the end. A row lights under the pointer only where pressing it goes somewhere.

`RowGroup`:

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `title` | `ReactNode` | required | The heading (an `h2`). |
| `label` | `string` | the title's words | The section's name where the title is not words. |
| `icon` | `Icon \| null` | none | The head's mark at 14px; `null` keeps its room empty, for a placeholder. |
| `hue` | `Hue` | none | The mark's colour (`data-hue`). |
| `count` | `ReactNode` | none | After the heading, usually a `HeadCount`. |
| `more` | `ReactNode` | none | At the head's end, usually a `RowsMore`. |
| `children` | `ReactNode` | none | `Rows`, or an `EmptyLine` in their place. |
| native attributes | `HTMLAttributes<HTMLElement>` less `title` | | On the section. |

`Rows` is the `ul` (`children`, `className`, `aria-hidden`). `RowsMore` is `{ to, children }`: quiet words drawn through the provider's link. `Row`:

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `mark` | `ReactNode` | required | At the start, 1.5rem wide. |
| `words` | `ReactNode` | required | The row's words, one line, cut short. |
| `to` | `string` | none | A link over the whole row (through the provider), which is when it lights. |
| `state` | `unknown` | none | Handed to the link. |
| `title` | `string` | none | The words' title, for words cut short. |
| `place` | `ReactNode` | none | Where it is, quiet, at most 16rem. |
| `when` | `ReactNode` | none | When, quiet, tabular, right-aligned, at least 4.5rem. |
| `end` | `ReactNode` | none | The one action, above the row's link so it is pressed on its own. |
| `after` | `ReactNode` | none | Under the row inside its item, for a refusal that belongs to it. |
| `quiet` | `boolean` | `false` | Words in `--fg-subtle`, saying something in place of a row. |

States:

- Head: height 2rem, `--text-ui`; mark `var(--hue-ink, var(--fg-subtle))`; title weight 600 `--fg-strong`; count tabular `--fg-subtle`; more `--fg-subtle`, `--fg-strong` on hover, focus outline 2px `--focus`. Head and rows hang 0.5rem past the column, so the words line up with what is above them.
- Row: minimum height 2.75rem, padding 0.625rem 0.5rem, gap 0.75rem, radius `--radius-row`, `--text-ui`; words `--fg-strong`. With a link: hover `--field-fill`, press `--field-fill-hover`, the link's focus ringing the row (outline 2px `--focus`, offset -2px). The end is at least 3.75rem.
- Under 640px: a place that is not a link goes, and when goes from a row with an action.

Tokens: `--text-ui`, `--fg-strong`, `--fg-subtle`, `--hue-ink`, `--radius-row`, `--field-fill`, `--field-fill-hover`, `--focus`.

CSS: `ui-data.css`. Classes `ui-list`, `ui-list-head`, `ui-list-mark`, `ui-list-mark-room`, `ui-list-title`, `ui-list-count`, `ui-list-more`, `ui-list-more-link`, `ui-list-rows`, `ui-list-row`, `ui-list-row-mark`, `ui-list-row-words`, `ui-list-row-link`, `ui-list-row-place`, `ui-list-row-when`, `ui-list-row-end`, `ui-list-face`.

Dependencies: the provider's link, `Hue`, the `Icon` type.

### Pagination

A numbered pager: where this page sits in words, then previous, the pages and next. Past seven pages it always draws seven slots (first, last, the pages round this one, and a gap), so it keeps one width.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `page` | `number` | required | The page, from 1 (clamped). |
| `onPageChange` | `(page: number) => void` | required | Asked for another page. |
| `pageSize` | `number` | required | Rows a page. |
| `total` | `number` | required | Rows in all. |
| `noun` | `string` | none | Said after the range ("calls"). |
| `words` | `boolean` | `true` | `false` leaves the words out. |
| `className` | `string` | none | Placement. |

States:

- Page and step buttons: min width and height `--control-h-sm`, padding `0 0.375rem`, radius `--radius-control`, weight `--weight-ui`, tabular, `--fg`. Hover `--fg-strong` on `--field-fill`; press `--field-fill-hover`; focus outline 2px `--focus`, offset 2px.
- Current page (`aria-current="page"`): `--ink-words` on `--ink-face-bottom`, `cursor: default`.
- Steps at an end: held with the reasons "This is the first page" and "This is the last page" (opacity 0.55, `not-allowed`, the reason in a tooltip).
- Gap: `…` in `--fg-subtle`. Words: tabular, `--fg-subtle`, `aria-live="polite"`.

Tokens: `--text-ui`, `--fg`, `--fg-subtle`, `--fg-strong`, `--control-h-sm`, `--radius-control`, `--field-fill`, `--field-fill-hover`, `--ink-words`, `--ink-face-bottom`, `--focus`.

CSS: `ui-data.css`. Classes `ui-pages`, `ui-pages-words`, `ui-pages-steps`, `ui-page`, `ui-page-step`, `ui-page-back`, `ui-page-gap`.

Dependencies: `useBlocked`, `rangeWords`; icon `ChevronRightIcon` (turned 180deg for previous).

### CursorPagination

A pager that knows only what comes before and after: where this page sits in words, then previous and next.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `from` | `number` | required | First row shown, from 1. |
| `to` | `number` | required | Last row shown. |
| `total` | `number` | none | Left out where the server does not count. |
| `noun` | `string` | none | Said after the range. |
| `hasPrevious` | `boolean` | required | Whether previous can be pressed. |
| `hasNext` | `boolean` | required | Whether next can be pressed. |
| `onPrevious` | `() => void` | required | Pressed previous. |
| `onNext` | `() => void` | required | Pressed next. |
| `previousReason` | `string` | none | Why previous cannot be pressed. |
| `nextReason` | `string` | none | Why next cannot be pressed. |
| `className` | `string` | none | Placement. |

States, tokens and CSS: as `Pagination`'s steps and words.

### rangeWords

`rangeWords(from, to, total, noun?)`: "1 to 50 of 312 calls"; "1 to 50 calls" with no total; "No calls" (or "None" with no noun) when `total === 0` or `to < from`.

### Spinner

Something on its way: a small turning arc in the colour of the words around it. Still under reduced motion.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `size` | `number` | `16` | Width and height in pixels. |
| `label` | `string` | none | With it, `role="status"` and named; without, `aria-hidden`. |
| `className` | `string` | none | Placement. |

States: a 16 by 16 viewBox, a full circle (r 6.25, stroke 1.75, opacity 0.2) and a quarter arc (round cap), both `currentColor`; spins with `ui-spin` (700ms linear, infinite).

CSS: `ui-feedback.css`. Class `ui-spinner`, keyframes `ui-spin`.

### Progress

How far something has got: its words, how far in words, and a bar under them. Left without a value, the bar says only that it is under way.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `label` | `ReactNode` | required | What is under way. |
| `value` | `number` | none | How far; without it the bar sweeps. |
| `max` | `number` | `100` | The end. |
| `valueText` | `string` | the rounded percentage | The words for how far ("3 of 8 files"). |
| `tone` | `"danger" \| "caution" \| "settled" \| "moving" \| "accent"` | none | Colours the bar; the words still say the state. `accent` draws it in `--accent`, a look that says no state. |
| `size` | `"sm"` | none | A 0.25rem track rather than 0.375rem. |
| `className` | `string` | none | Placement. |

States:

- Head: `--text-ui`; label weight 600 `--fg-strong`, clipped; value tabular `--fg-subtle`.
- Track: radius `--radius-round`, `--field-fill`. Fill: `--progress-fill` (default `--ink-face-bottom`, the tone's ink, or `--accent`), width eases over `--motion-slow` `--ease-track`.
- Unknown (`data-unknown`): a 35% stretch sweeps with `ui-progress-sweep` (1.4s `--ease-track`, infinite, from `translate: -100% 0` to `300% 0`). Still under reduced motion.

Tokens: `--ink-face-bottom`, `--tone-danger-ink`, `--tone-caution-ink`, `--tone-settled-ink`, `--tone-moving-ink`, `--accent`, `--text-ui`, `--fg-strong`, `--fg-subtle`, `--radius-round`, `--field-fill`, `--ease-track`.

CSS: `ui-feedback.css`. Classes `ui-progress`, `ui-progress-sm`, `ui-progress-head`, `ui-progress-label`, `ui-progress-value`, `ui-progress-track`, `ui-progress-fill`; keyframes `ui-progress-sweep`.

### toast

`toast(message, options?)` puts a toast up from anywhere and returns its id; `toast.dismiss(id)` takes it down (a `--motion-fast` leave, timed on the toast's own computed transition so a slower system or section is not cut short). At most 4 stand; putting one up under an existing id replaces it and restarts its time.

`ToastOptions`:

| Option | Type | Default | Meaning |
| --- | --- | --- | --- |
| `description` | `ReactNode` | none | A quieter second line. |
| `tone` | `ToastTone` | none | Draws it as a notice in that tone. |
| `duration` | `number` | `5000` | Milliseconds; `0` keeps it until dismissed. |
| `action` | `{ label: string; onPress: () => void }` | none | One press, which also dismisses it. |
| `id` | `string` | `toast-n` | Replaces a toast with the same id. |

`ToastTone` is `"danger" | "caution" | "settled" | "moving"`.

### Toaster

Where toasts are drawn: mounted once, in the top layer (`popover="manual"`), raised again over anything opened since whenever a new toast arrives. A `region` named "Notifications".

Props: none.

States:

- Stack: fixed at the bottom right, inset `auto 1rem 1rem auto`, width `min(24rem, calc(100vw - 2rem))`, gap 0.5rem, passes the pointer; below 640px it spans `1rem` from each side. Shown only while open.
- Toast, plain: `--ink-words` on `--ink-face-bottom`, radius `--radius-float`, `--shadow-float`, `--text-read`, padding `0.625rem 0.5rem 0.625rem 0.875rem`; enters with `ui-toast-in` (from opacity 0 and 8px down, `--motion-base`).
- Toast, toned: `--fg-strong` on the tone's tint, its icon in the tone's ink (danger and caution `FlagIcon`, settled `CheckCircleIcon`, moving `ClockIcon`, 16px).
- Hover or focus inside holds its time (at least 1000ms remain when it runs again).
- Leaving: opacity 0 and 4px down over `--motion-fast`.
- Action: underlined (offset 3px), `--text-ui` weight 600, 1.75rem tall, radius `--radius-row`. Close: 1.75rem square, `XIcon` 14px, quieter words. Hover `--toast-press`; press mixes 10% words into it; focus outline 2px `--focus`, offset 2px.
- Reduced motion: no entrance and no leaving transition.

Tokens: `--ink-face-bottom`, `--ink-words`, `--fg-strong`, `--fg-subtle`, the four tones' ink and tint, `--radius-float`, `--radius-row`, `--shadow-float`, `--text-read`, `--text-ui`, `--focus`; local `--toast-ground`, `--toast-words`, `--toast-quiet`, `--toast-press`, `--tone-ink`, `--tone-tint`.

CSS: `ui-feedback.css`. Classes `ui-toaster`, `ui-toast`, `ui-toast-icon`, `ui-toast-words`, `ui-toast-message`, `ui-toast-description`, `ui-toast-action`, `ui-toast-close`; keyframes `ui-toast-in`.

Dependencies: `useSyncExternalStore`; icons `FlagIcon`, `CheckCircleIcon`, `ClockIcon`, `XIcon`.

### FieldHead

The line above every field: its label and, in the same grid cell, the short error that takes the label's place in the danger ink, so an error arriving or going moves nothing below. The label stays the field's name to a screen reader; the error is announced (`role="alert"`). A field named by `aria-label` alone reserves the line only when `error` is passed (even empty).

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `field` | `string` | required | The field's id; the error is `${field}-error`. |
| `label` | `ReactNode` | none | The label. |
| `labelId` | `string` | none | The label's id, for a list to be labelled by. |
| `error` | `ReactNode` | none | The short error. |

States:

- Label: `--text-ui` weight 600, line height 1.45, `--fg-strong`.
- Error arriving (`data-error`): the label fades (`--motion-fast`) and slides down 45% (`--motion-base` `--ease-out`); the error slides in from 45% above with `ui-field-error-in` (`--motion-base`, `backwards`), weight 600, one line with an ellipsis, `--tone-danger-ink`, passing the pointer to the label. The last words are kept so they leave with `ui-field-error-out` (`--motion-base`) rather than vanish.
- Reduced motion: no transition, animation or transform.

Tokens: `--text-ui`, `--fg-strong`, `--fg-subtle`, `--tone-danger-ink`.

CSS: `ui.css`. Classes `ui-field-head`, `ui-field-label`, `ui-field-error`; keyframes `ui-field-error-in`, `ui-field-error-out`.

### FieldHint

The line under a field that helps, drawn whenever there is a hint.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `field` | `string` | required | The field's id; the hint is `${field}-hint`. |
| `hint` | `ReactNode` | none | The words. Nothing is drawn without them. |

States: `--text-ui`, line height 1.45, `--fg-subtle`. CSS: `ui.css`, class `ui-field-hint`.

### describedBy, isShortError, SHORT_ERROR

- `describedBy(field, error, hint, reason?)`: the ids a field's `aria-describedby` names (`${field}-error`, `${field}-hint`, the reason's id), joined, or `undefined`.
- `SHORT_ERROR`: `56`, the longest error the label's line holds.
- `isShortError(words)`: whether words are non-empty and at most 56 characters, so a page can say a refusal in place or in a notice.

### Empty

What a place shows while it holds nothing: a faint preview of what will fill it, one title, at most one short line, and the one thing to do with a quieter second beside it, all centred. Without a preview, an icon on a small tile. `drop` draws it as a well that takes files.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `preview` | `EmptyPreview` | none | `rows`, `people`, `table`, `tree`, `chat`, `board`, `files` or `worklist`. |
| `size` | `EmptySize` | `"pane"` | `page` (the room under a header), `pane` or `card`. |
| `icon` | `ReactNode` | none | On a tile, when there is no preview. |
| `art` | `ReactNode` | none | A drawing of its own in the tile's or preview's place. |
| `title` | `ReactNode` | required | The one title. |
| `line` | `ReactNode` | none | One short line. |
| `action` | `ReactNode` | none | The one thing to do. |
| `secondary` | `ReactNode` | none | A quieter second. |
| `hue` | `Hue` | none | The tile's colour, and the preview's first item on hover. |
| `drop` | `boolean` | `false` | A dashed well that takes files (the caller handles the drop). |
| `dropping` | `boolean` | `false` | Something is held over it. |
| native attributes | `HTMLAttributes<HTMLDivElement>` less `title` | | Passed through (the drop handlers). |

States:

- Layout: grid centred, width `min(24rem, 100%)`, padding `2rem 1rem`; `page` min height `calc(100dvh - var(--head-h) - 6rem)` and padding-block `2rem 6rem`; `card` padding `1.25rem 0.75rem`, title `--text-ui`.
- Tile: 2.25rem, radius `--radius-row`, `var(--hue-ink, var(--fg-subtle))` on `var(--hue, var(--field-fill))`, icon 1.125rem.
- Title `--text-read` weight 600 `--fg-strong`; line `--text-ui`, line height 1.5, `--fg-subtle`, always two lines tall; actions gap 0.5rem, 0.75rem above.
- Preview: one height (7.125rem; `card` 5rem), masked to fade toward its foot; bars `--line` and `--line-hairline`, marks `--field-fill`, scaled to 0.88 at rest.
- Hover or focus within: bars draw out to full length (twice `--motion-slow`, `--ease-out`, staggered by 0.4, 0.8 and 1.2 times `--motion-fast`); the first item's mark takes `--hue` and its bar `--hue-ink`. Still under reduced motion.
- Drop well: `1px dashed var(--line)`, radius `--radius-panel`; two sheets behind the tile at plus and minus 12deg. Dropping: border `var(--hue-ink, var(--fg-strong))`, ground `color-mix(in oklab, var(--hue, var(--field-fill)) 40%, transparent)`, the tile lifts 0.25rem and the sheets fan to 22deg.

Tokens: `--head-h` (the page header's height, `calc(2.5rem - 1px)`, declared in vic-ui's `tokens.css`; in the source it was the app's `frame.css`), `--radius-row`, `--radius-round`, `--radius-mark`, `--radius-panel`, `--hue`, `--hue-ink`, `--fg-subtle`, `--fg-strong`, `--field-fill`, `--text-read`, `--text-ui`, `--line`, `--line-hairline`, `--motion-fast`, `--motion-base`, `--motion-slow`, `--ease-out`, `--ease-track`.

CSS: `ui-display.css`. Classes `ui-empty`, `ui-empty-mark`, `ui-empty-title`, `ui-empty-line`, `ui-empty-actions` and the preview's `ui-empty-art`, `ui-empty-art-row`, `ui-empty-art-mark`, `ui-empty-art-words`, `ui-empty-art-pill`, `ui-empty-art-head`, `ui-empty-art-cells`, `ui-empty-art-card`, `ui-empty-art-lane`, `ui-empty-art-node`, `ui-empty-art-root`, `ui-empty-art-branch`, `ui-empty-art-level`, `ui-empty-art-turn`, `ui-empty-bar`, `ui-empty-bar-soft`. Needs the `[data-hue]` rules.

Dependencies: `EmptyArt`.

### EmptyArt

The faint drawing of what a place fills with, in the page's own shapes, hidden from a screen reader. Exported so a placeholder can draw the same.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `shape` | `EmptyPreview` | required | Which drawing. |

Tokens and CSS: as `Empty`'s preview.

### EmptyLine

A list, a section of one or a part of a dialog with nothing in it, said in one quiet line where its rows would start, at a row's height and with no box ("Nothing pinned"). A place that holds nothing at all is an `Empty`. Exported from `Empty.tsx`.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| native attributes | `HTMLAttributes<HTMLParagraphElement>` | | The words and the rest. |

States: none. No margin, padding `0.25rem 0.5rem`, `--text-ui`, line height 1.25rem, `--fg-subtle`.

CSS: `ui-display.css` (`ui-list-empty`).

### CommandPalette

A search over the page that finds something to open: a field at its head and the options under it in their groups, on the browser's own `<dialog>`, so the focus is held inside it. The focus stays in the field.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `open` | `boolean` | required | Whether it is up. |
| `onOpenChange` | `(open: boolean) => void` | required | Escape and a press on the veil ask to close. |
| `query` | `string` | required | What is typed. |
| `onQueryChange` | `(query: string) => void` | required | Handed what is typed. |
| `items` | `Items \| ReadonlyArray<PaletteOption>` | required | `PaletteOption` adds `crumb`, the place it sits in, drawn before its words with a chevron. |
| `onSelect` | `(value, { newTab }) => void` | required | Enter or a press; with Cmd or Ctrl, `newTab: true`. |
| `filter` | `false \| (option, query) => boolean` | substring match | `false` takes the server's narrowing. |
| `highlight` | `string` | `query` | Words marked in each string label. |
| `loading` | `boolean` | `false` | A spinner ("Looking") in place of the list. |
| `empty` | `ReactNode` | none | Said when nothing is there. |
| `label` | `string` | `"Search"` | The field's and list's name. |
| `placeholder` | `string` | `label` or `"Search"` | The field's placeholder. |
| `foot` | `ReactNode \| false` | the keys | Replaces the keys at the foot; `false` leaves it off. |
| `onEmptyBackspace` | `() => void` | none | Backspace with nothing typed. |
| `className` | `string` | none | Placement. |

Keys: ArrowDown and ArrowUp move round (wrapping, skipping disabled); Enter opens the lit option, or the first when none is lit; Escape closes outright. An option is lit only while the pointer is on it or the keys chose it, and only for the list it was lit in.

States:

- Dialog: `ui-dialog` plus width `min(42rem, calc(100vw - 2rem))`, 10vh from the top, no overflow; below 640px `calc(100vw - 1rem)` at 0.5rem from the top, radius `--radius-float`, entering as a dialog (not a sheet).
- List: one height from opening, `min(26rem, calc(60dvh - 7.5rem))`, padding `0.375rem 0.625rem 0.5rem`, scrolls; the lit option is kept in view.
- Row: as `Menu`'s item; lit `--fill-hover` with the arrow (`ArrowRightIcon` 14px) shown; press `--fill-press`. Start slot `--fg-subtle`. Crumb `--fg`, at most 45%; chevron (`ChevronRightIcon` 12px) `--fg-subtle`; title at least 4rem; hint `--text-ui` `--fg-subtle`. A crumb gives way first, then the title.
- Marked words: radius `--radius-mark`, ground `--tone-caution-tint`, words inherited.
- State (loading, empty): centred, padding `2rem 1rem`, `--text-read`, `--fg-subtle`.
- Foot: `--text-meta`, `--fg-subtle`, top rule `--line`, ground `--fill-faint`; the default keys (Up and Down "Move", Enter "Open", Esc "Close") are hidden on a coarse pointer.

Tokens: the `Dialog` and `Menu` tokens, `--radius-mark`, `--tone-caution-tint`, `--text-meta`.

CSS: `ui-overlays.css` (`ui-palette`, `ui-palette-head`, `ui-palette-list`, `ui-palette-state`, `ui-palette-item`, `ui-palette-line`, `ui-palette-crumb`, `ui-palette-title`, `ui-palette-chevron`, `ui-palette-hint`, `ui-palette-mark`, `ui-palette-go`, `ui-palette-foot`, `ui-palette-keys`) plus `ui-dialog`, `ui-dialog-frame`, `ui-menu-item`, `ui-menu-group`, `ui-start`.

Dependencies: `SearchField`, `Kbd`, `Spinner`, `toOptions`, `textOf`; icons `ArrowRightIcon`, `ChevronRightIcon` (and `SearchField`'s).

### Flow

A tree drawn left to right: each box, then what follows from it in a column beside it, joined by hairlines from the middle of each box. The lines are CSS edges, so a box that grows keeps its lines with nothing measured.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `nodes` | `FlowNode[]` | required | The roots, in a column at the start. |
| `className` | `string` | none | Placement. |
| `aria-label` | `string` | none | The group's name. |

`FlowNode` is `{ id: string; content: ReactNode; children?: FlowNode[] }`.

States: none. Local `--flow-gap: 1.5rem`, `--flow-row: 0.75rem`, `--flow-line: var(--line)`; width `max-content`, min 100%, centred, padding 2rem.

Tokens: `--line`.

CSS: `ui-display.css`. Classes `ui-flow`, `ui-flow-column`, `ui-flow-branch`, `ui-flow-node`, `ui-flow-next`.

### Trail

Where a page sits: each step above it a link back, then the page's own name. Every name is one the page has already read for its reader. A step gives way before the page's name does: on a page it is cut short and the name wraps, and on a phone every step but the nearest folds into one link back to the first, titled with the steps it folds. A step cut short is named in full on hover. It takes its size from where it is set. In vic-ui each `to` renders through `LinkProvider`.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `steps` | `readonly TrailStep[]` | required | `{ to: string; label: ReactNode; text?: string; state?: unknown }`, top first; `text` is the words where `label` is not words. |
| `here` | `ReactNode` | required | The page's own name. |
| `heading` | `boolean` | `true` | The name is an `h1`; `false` draws it as a span, where the page's heading is somewhere else. |
| `line` | `boolean` | `false` | Keeps it to one line, for a bar: a step stays whole and the name is cut. |
| `className` | `string` | none | Placement. |
| `hereClassName` | `string` | none | On the name. |

States: a flex row on the baseline. A step is at most `min(16em, 40vw)` (none with `line`), `--fg-subtle`, `--fg-strong` on hover, followed by a `/` in `--fg-inactive` (silent to a screen reader), margin-inline 0.4em. The name is weight 600, `--fg-strong`, wrapping anywhere (with `line`, one line with an ellipsis). Under 40rem the steps before the nearest (`ui-trail-far`) are hidden and the folded link (`ui-trail-more`, an ellipsis) shows. The nav is named "Where you are"; the name is `aria-current="page"`.

Tokens: `--fg-subtle`, `--fg-strong`, `--fg-inactive`.

CSS: `ui-display.css`. Classes `ui-trail`, `ui-trail-line`, `ui-trail-step`, `ui-trail-far`, `ui-trail-more`, `ui-trail-here`.

Dependencies: the provider's link.

### DatePicker

One calendar date chosen from a month: the field `Select` draws, saying the date in words ("Mon 3 Oct 2026"), and a month grid on the floating surface. Values are `YYYY-MM-DD` strings, never instants.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `label` | `ReactNode` | none | The label. |
| `aria-label` | `string` | none | Its name, with the chosen date appended. |
| `value` | `string \| null` | required | `YYYY-MM-DD` or nothing. |
| `onValueChange` | `(value: string) => void` | none | Called when another day is chosen. |
| `min` | `string \| undefined` | none | First day that can be chosen. |
| `max` | `string \| undefined` | none | Last day that can be chosen. |
| `placeholder` | `string` | `""` | Said while nothing is chosen. |
| `format` | `(value: string) => string` | weekday, day, short month, year | Says the date another way in the field. |
| `hint` | `ReactNode` | none | Under the box. |
| `error` | `ReactNode` | none | A short error in the label's place. |
| `disabled` | `boolean` | `false` | Natively disabled. |
| `disabledReason` | `string \| undefined` | none | Focusable, says why. |
| `name` | `string` | none | Posts the date through a hidden input. |
| `id` | `string` | `useId()` | The trigger's id. |
| `size` | `"sm"` | none | The dense height. |
| `className` | `string` | none | Placement. |

Keys in the grid: arrows a day or a week; Page Up and Page Down a month (with Shift a year); Home and End the start and end of the week (weeks start on Monday); Enter or Space choose; Escape closes and returns the focus; Tab closes. ArrowDown on the field opens it. Moves are clamped to `min` and `max`.

States:

- Field: as `Select`'s, with a calendar mark (`CalendarEventIcon` 16px) in place of the caret, which does not rotate.
- Grid surface: `ui-menu` with padding 0.5rem, placed `bottom-start`, not height-capped, placed again as the month changes. Always six weeks, so it keeps one height.
- Head: month and year `--text-ui` weight 600, tabular, `--fg-strong`, `aria-live`; steps 1.75rem (`ChevronRightIcon` 15px, the back one turned 180deg), held at the bounds (opacity 0.55, `not-allowed`).
- Weekday heads: two letters, 1.5rem tall, `--text-tag` weight 400, `--fg-subtle`.
- Day: 2rem square, radius `--radius-row`, `--text-ui`, tabular, `--fg`. Hover (not chosen) `--field-fill-hover`; press `--field-fill`; focus outline 2px `--focus`, offset 2px. Outside the month `--fg-subtle`. Today: ring `inset 0 0 0 1px var(--fg-subtle)`. Chosen: `--ink-words` on `--ink-face-bottom`. Out of bounds (`aria-disabled`): opacity 0.55, `not-allowed`, no hover. Transitions `--motion-fast`. No state changes the type.

Focus on the field: the trigger is a button and draws the keyboard's ring on its box, as `Select`'s does (fixed in vic-ui; the source drew none).

Tokens: the field tokens, the `ui-menu` tokens, `--text-ui`, `--text-tag`, `--fg`, `--fg-strong`, `--fg-subtle`, `--radius-row`, `--field-fill`, `--field-fill-hover`, `--focus`, `--ink-face-bottom`, `--ink-words`.

CSS: `ui-overlays.css` (`ui-date`, `ui-date-mark`, `ui-date-pop`, `ui-date-head`, `ui-date-month`, `ui-date-step`, `ui-date-back`, `ui-date-grid`, `ui-date-weekday`, `ui-date-day`) plus `ui-select-box`, `ui-select`, `ui-select-words`, `ui-select-caret`, `ui-menu` and the field classes.

Dependencies: `useAnchored`, `usePressAway`, `useBlocked`, `FieldHead`, `FieldHint`, `describedBy`; icons `CalendarEventIcon`, `ChevronRightIcon`.

### MonthGrid

The month `DatePicker` opens, standing on its own: a head with the month and its steps, the weekdays and six weeks of days, worked by the keys as a grid is. Exported from `DatePicker.tsx`; `DatePicker` draws it inside its popover.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `focus` | `string` | required | The day the keys are on, `YYYY-MM-DD`; its month is the one shown. |
| `onFocusChange` | `(day: string) => void` | required | Handed the day the keys or the steps move to. |
| `value` | `string \| null` | required | The chosen day. |
| `onChoose` | `(day: string) => void` | required | A day chosen by a press, Enter or Space. |
| `today` | `string` | required | The day drawn as today. |
| `min`, `max` | `string \| undefined` | none | The bounds; moves are clamped to them and days past them are held. |
| `className` | `string` | none | Placement. |

Keys and states: as `DatePicker`'s grid (arrows a day or a week, Page Up and Page Down a month, with Shift a year, Home and End the week's ends, Enter or Space choose).

CSS: as `DatePicker`'s grid (`ui-date-head`, `ui-date-month`, `ui-date-step`, `ui-date-grid`, `ui-date-weekday`, `ui-date-day`).

### TableOfContents

A list of the places on a page, each a link, grouped under quiet headings over one track. The entry open is marked by one bar that slides along the track to it and by its words taking the strong ink; its weight never changes.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `groups` | `TocGroup[]` | required | `{ heading?: ReactNode; entries: TocEntry[] }`; `TocEntry` is `{ href: string; label: ReactNode }`. |
| `current` | `string \| null \| undefined` | none | The open entry's `href`. |
| `onNavigate` | `(href, event) => void` | none | Each press, for a router to take. |
| `head` | `ReactNode` | none | Above the list, inside the same landmark. |
| `aria-label` | `string` | `"Table of contents"` | The nav's name. |
| `className` | `string` | none | Placement. |

States:

- Track: left border `2px solid var(--line-soft)`, gap 0.5rem.
- Heading: `--text-ui` weight `--weight-ui`, line height 1.25rem, `--fg-subtle`, padding-left 1rem.
- Entry: `--text-ui` weight 400, `--fg-subtle`, padding-left 1rem (1.75rem under a heading), one line with an ellipsis, right corners `--radius-row`. Hover `--fg` on `--field-fill`; press `--field-fill-hover`; current (`aria-current="page"`) `--fg-strong`; focus outline 2px `--focus`, offset 2px. Colour and ground ease over `--motion-fast` `--ease-track`.
- Bar: 2px, round, `--brand`, set by its top and bottom so each end eases on its own (`--motion-base` `--ease-track`) once it has been placed. Still under reduced motion.

Tokens: `--line-soft`, `--text-ui`, `--fg-subtle`, `--fg`, `--fg-strong`, `--radius-row`, `--radius-round`, `--field-fill`, `--field-fill-hover`, `--focus`, `--brand`, `--ease-track`.

CSS: `ui-display.css`. Classes `ui-toc-track`, `ui-toc-group`, `ui-toc-list`, `ui-toc-heading`, `ui-toc-entry`, `ui-toc-bar` (`ui-toc` itself has no rule).

### IconButton

An icon alone that acts: a square `Button` whose words are its accessible name and its tooltip. `quiet` by default.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `label` | `string` | required | Its `aria-label`, and the tooltip unless `tip` is given. |
| `icon` | `ReactNode` | required | The icon. |
| `tip` | `ReactNode` | `label` | What the tooltip says, where it says more (a shortcut). |
| `busy` | `boolean` | `false` | Swaps the icon for a `Spinner`, sets `aria-busy` and holds the press. |
| `placement` | `Placement` | `"top"` | The tooltip's side. |
| `keepFocus` | `boolean` | `false` | A press keeps the focus where it was (its mouse down is prevented), as an editor's formatting does, so the selection it acts on is not lost. |
| `look` | `"ink" \| "line" \| "quiet"` | `"quiet"` | `line` where it stands beside fields in a header. |
| `disabledReason` | `string \| undefined` | none | Says the reason in place of its words. |
| every other `Button` prop but `square`, `children`, `icon`, `aria-label` | | | `size`, `onClick`, `aria-pressed` and the rest. |

States (`quiet`): height `--control-h-sm` (`lg`: `--control-h`), square, radius `--radius-button`, `--fg`. Hover `--fg-strong` on `--field-fill-hover`, no underline. Press, `aria-pressed="true"`, or an open popup trigger (`aria-haspopup` with `aria-expanded="true"`): `--fg-strong` on `--field-fill`. Background and colour ease over `--motion-fast`. Focus and disabled as `Button`. `line` and `ink` looks as `Button`.

Tokens: `Button`'s, chiefly `--control-h-sm`, `--control-h`, `--radius-button`, `--fg`, `--fg-strong`, `--field-fill`, `--field-fill-hover`.

CSS: `ui.css` (`ui-button-quiet.ui-button-square` and the rest of the button classes).

Dependencies: `Button`, `Spinner`, `Tooltip`.

### IconButtonLink

The same icon alone on a link: to a page of the app by `to` (with `state`), or anywhere by `href` (a download names its file with `download`). Its words are its accessible name and its tooltip. Exported from `IconButton.tsx`.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `label` | `string` | required | Its `aria-label`, and the tooltip unless `tip` is given. |
| `icon` | `ReactNode` | required | The icon. |
| `tip` | `ReactNode` | `label` | What the tooltip says. |
| `busy` | `boolean` | `false` | A `Spinner` in place of the icon, and `aria-busy`. |
| `placement` | `Placement` | `"top"` | The tooltip's side. |
| `look` | `ButtonLook` | `"quiet"` | As `IconButton`. |
| every other `ButtonLink` prop but `square`, `children`, `icon`, `aria-label` | | | `to`, `href`, `download` and the rest. |

States, tokens and CSS: as `IconButton`'s.

Dependencies: `ButtonLink`, `Spinner`, `Tooltip`.

### SlidingViews

Two or more surfaces sharing one pane, the one named by `active` in view and the others slid out to its sides, so changing which slides rather than jumps. A view out of sight is `inert` and hidden from a screen reader.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `active` | `string` | required | The `value` of the view in sight. |
| `children` | `ReactNode` | required | `SlidingView`s. |
| native attributes | `HTMLAttributes<HTMLDivElement>` | | Passed through. |

States: the track translates by `-100%` per view over `--motion-base` `--ease-track`; in place under reduced motion. The pane is `overflow: clip`, never scrolled.

CSS: `ui-display.css`. Classes `ui-sliding`, `ui-sliding-track`.

### SlidingView

One surface of `SlidingViews`.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `value` | `string` | required | Its name. |
| `children` | `ReactNode` | none | Its content. |
| native attributes | `HTMLAttributes<HTMLDivElement>` | | Passed through. |

States: full width, column flex; out of sight it is `aria-hidden`, `inert` and passes the pointer.

CSS: `ui-display.css`. Class `ui-sliding-view`.

### SidebarProvider

Holds the sidebar's state and draws the row it sits in with the page: a flex row filling its container (`contained`) or the window's height.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `open` | `boolean` | held inside | Whether the rail is open. |
| `defaultOpen` | `boolean` | `true` | The first state when held inside. |
| `onOpenChange` | `(open: boolean) => void` | none | Told of each change. |
| `openMobile` | `boolean` | held inside | Whether the sheet is open on a phone. |
| `onOpenMobileChange` | `(open: boolean) => void` | none | Told of each change. |
| `collapsible` | `"icon" \| "offcanvas" \| "none"` | `"icon"` | Folds to its marks, goes away, or never folds. |
| `mobileBreakpoint` | `number` | `768` | Below this width in pixels it is a sheet; `0` never. |
| `contained` | `boolean` | `false` | The sheet and backdrop cover the container, not the window. |
| `size` | `"sm" \| "md"` | `"md"` | The rail's density: `sm` sets `--sidebar-row-height` to 1.75rem and every heading without its own `size` a step smaller (`data-size="sm"` on the wrapper). |
| `className` | `string` | none | On the wrapper. |
| `style` | `CSSProperties` | none | On the wrapper. |
| `children` | `ReactNode` | required | The `Sidebar` and the page. |

The wrapper carries `data-sidebar-wrapper` and `data-state` (`expanded` or `collapsed`). Local tokens: `--sidebar-width: 15.5rem`, `--sidebar-width-icon: 3rem`, `--sidebar-animation-duration: var(--motion-base)`, `--sidebar-easing: var(--ease-track)`, `--sidebar-bg: var(--bg-base)`, `--sidebar-row-height: 2rem` (1.75rem under `size="sm"`), `--sidebar-group-gap: 0.75rem` (added above each group after the first while the rail is open). Not contained, it is at least `100svh` tall.

CSS: `ui-sidebar.css`. Classes `ui-sidebar-wrapper`, `ui-sidebar-window`.

Dependencies: `useSyncExternalStore` with `matchMedia`.

### Sidebar

The rail itself: an `aside` beside the page, or on a phone a modal `nav` sheet managed by Base UI Dialog. Focus stays inside while open; the background cannot be interacted with. Escape, the close icon, or a backdrop press closes it and restores focus. The portal stays inside the provider so local theme and width tokens apply. Closed sheets unmount after their exit transition.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| native attributes | `HTMLAttributes<HTMLElement>` | | Passed through (`aria-label`). |
| `ref` | `Ref<HTMLElement>` | none | Forwarded. |

States:

- Rail: width `--sidebar-width`, easing `width` over `--sidebar-animation-duration` `--sidebar-easing`; folded (`icon`) `--sidebar-width-icon`; folded (`offcanvas`) 0. Its inner column clips and never wraps, so marks stay where they were. Ground `--sidebar-bg`, words `--fg`.
- Sheet: absolute (fixed when not contained), width `--sidebar-width`, `translate: -100% 0` closed and `0 0` open, eased; z-index 50.
- Backdrop: `--bg-recessed` with `blur(2px)`, opacity 0 closed, 0.8 open; z-index 40.
- Reduced motion: no transitions.
- Parts carry `data-sidebar` (`sidebar`, `header`, `content`, `viewport`, `footer`, `group`, `group-label`, `menu`, `menu-item`, `menu-button`, `menu-badge`, `trigger`) and the rail `data-state`, `data-collapsible`, and `data-mobile` on the sheet.

Tokens: `--sidebar-width`, `--sidebar-width-icon`, `--sidebar-animation-duration`, `--sidebar-easing`, `--sidebar-bg`, `--bg-base`, `--bg-recessed`, `--fg`.

CSS: `ui-sidebar.css`. Classes `ui-sidebar`, `ui-sidebar-inner`, `ui-sidebar-sheet`, `ui-sidebar-backdrop`, `ui-sidebar-portal`, `ui-sidebar-close`.

Dependencies: `useSidebar`, Base UI Dialog, `Button`, `XIcon`.

### SidebarHeader, SidebarFooter

The top of the rail (a mark, a name, a search) and its pinned foot. Both take `HTMLAttributes<HTMLDivElement>` and a forwarded ref.

States: header flex, gap 0.25rem, padding `0.625rem 0.5rem 0.75rem`. Footer column, gap 0.25rem, padding 0.5rem, clips, ground `--sidebar-bg`.

CSS: `ui-sidebar.css`. Classes `ui-sidebar-header`, `ui-sidebar-footer`.

### SidebarContent

The middle of the rail, which scrolls: its edges fade only where there is more to scroll to, and a thin bar of its own shows while it is pointed at or scrolled (600ms after the last scroll), never while the rail is folded.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| native attributes | `HTMLAttributes<HTMLDivElement>` | | Passed through. |
| `ref` | `Ref<HTMLDivElement>` | none | Forwarded. |

States: the viewport hides the native scrollbar, pads 0.5rem inline, and masks its top and bottom with `min(24px, var(--scroll-area-overflow-y-start / -end, 24px))`, which the component writes as it scrolls. The bar is 6px, at least 24px tall, round, `--line`; its track fades in over `--motion-fast`.

Tokens: `--line`, `--radius-round`; local `--scroll-area-overflow-y-start`, `--scroll-area-overflow-y-end`.

CSS: `ui-sidebar.css`. Classes `ui-sidebar-content`, `ui-sidebar-viewport`, `ui-sidebar-list`, `ui-sidebar-scrollbar`, `ui-sidebar-thumb`.

### SidebarGroup

A run of places, with or without a heading. `HTMLAttributes<HTMLDivElement>`, forwarded ref. Column, row gap 1px. Each group after the first sits `--sidebar-group-gap` (0.75rem, the room a folded rail's rule takes) below the one before while the rail is open (or a sheet); folded, the gap is 0 and the label's rule spaces them. The margin eases with the fold.

CSS: `ui-sidebar.css`. Class `ui-sidebar-group`.

### SidebarGroupLabel

A group's heading, which folds into a rule as the rail folds (none above the first group).

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `children` | `ReactNode` | | The heading. |
| `size` | `"sm" \| "md"` | the provider's | `sm` is denser: `--text-tag`, padding-block `0.125rem 0.1875rem`. `md` keeps the full size in a dense rail. Sets `data-size`. |
| native attributes | `HTMLAttributes<HTMLDivElement>` | | Passed through. |

States: words `--text-meta` weight `--weight-quiet`, line height `calc(1 / 0.85)`, `--fg-subtle`, padding `0.25rem 0.5rem 0.375rem` (`sm`, or under a dense provider without a `size` of its own: `--text-tag` and `0.125rem 0.5rem 0.1875rem`), one line. Folded (not a sheet): grid rows to `0fr`, margin-block 0.75rem, bottom rule `--line`, words fade (`--motion-fast`); the first group's label keeps no margin and no rule. In a sheet it does not transition.

Tokens: `--text-meta`, `--fg-subtle`, `--line`, `--sidebar-animation-duration`, `--sidebar-easing`.

CSS: `ui-sidebar.css`. Classes `ui-sidebar-group-label`, `ui-sidebar-group-fold`, `ui-sidebar-group-words`.

### SidebarMenu

A list of places: a `ul` with no bullets, column, row gap 1px. `HTMLAttributes<HTMLUListElement>`, forwarded ref.

CSS: `ui-sidebar.css`. Class `ui-sidebar-menu`.

### SidebarMenuItem

One row of a list, for a row that holds something other than a `SidebarMenuButton` (a menu's trigger); a `SidebarMenuButton` makes its own. `HTMLAttributes<HTMLLIElement>`, forwarded ref. Folded, it clips.

CSS: `ui-sidebar.css`. Class `ui-sidebar-item`.

### SidebarMenuButton

A place: a link by `href` (through `LinkProvider` for a path of the app beginning `/` and not `//`, a plain `<a>` otherwise) or a button. A string child is clipped with an ellipsis; anything else is drawn as it is.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `icon` | `ReactNode` | none | The mark, drawn at 16px, the one thing a folded row shows. |
| `active` | `boolean` | `false` | The place you are in (`data-active="true"`). |
| `tooltip` | `ReactNode` | none | Said beside the mark (to the right) while the rail is folded. |
| `dot` | `string \| undefined` | none | A dot on the mark while folded; the words are for a screen reader. |
| `size` | `"sm" \| "md" \| "lg"` | the provider's | The row's height: 1.75rem, 2rem or 2.5rem, outranking the provider's `--sidebar-row-height`. Sets `data-size`. |
| `count` | `{ value: number; label: string; tone?: Tone; max?: number }` | none | A soft `Count` at the row's end while open (in a `ui-sidebar-badge`), the dot on the mark while folded; `label` is said in either, once. Nothing at 0. An explicit `dot` outranks the count's words. |
| `href` | `string` | none | Makes it a link. |
| `children` | `ReactNode` | none | The words. |
| native attributes | anchor or button attributes | | Passed through. |
| `ref` | `Ref<HTMLElement>` | none | Forwarded. |

`SidebarMenuButtonProps` is the union of the link and button forms.

States:

- Row: `--sidebar-row-height` tall (2rem; `sm` 1.75rem, `lg` 2.5rem; the mark stays 0.5rem in, so a folded rail centres it at any size), padding `0 0.5rem`, gap 0.625rem, radius `--radius-row`, `--text-ui` weight `--weight-quiet`, line height `calc(1 / 0.85)`, `--fg`; its icon `--fg-subtle`. Where you are is the fill and the icon's ink, never a heavier weight. Its reach covers the pixel between rows.
- Hover: `--field-fill`, `--fg-strong`, icon `--fg-strong`.
- Active: `--field-fill-hover`, `--fg-strong`, icon `--fg-strong`.
- Focus: outline 2px `--focus`, offset -2px.
- Dot: 0.3125rem, round, `--bg-contrast`, top right of the mark, shown only while folded.
- Ground and colour ease over `--motion-fast`. No weight change.

Tokens: `--radius-row`, `--radius-round`, `--text-ui`, `--fg`, `--fg-subtle`, `--fg-strong`, `--field-fill`, `--field-fill-hover`, `--focus`, `--bg-contrast`.

CSS: `ui-sidebar.css`. Classes `ui-sidebar-button`, `ui-sidebar-face`, `ui-sidebar-mark`, `ui-sidebar-words`, `ui-sidebar-word`, `ui-sidebar-dot`. Uses `sr-only`.

Dependencies: `useSidebar`, `useTip`, the provider's link.

### SidebarMenuBadge

A quiet count at a row's end, hidden while the rail is folded. `HTMLAttributes<HTMLSpanElement>`, forwarded ref. For a pill, set a `Count` in it: filled for unread, `soft` for a count that asks less. `SidebarMenuButton`'s `count` draws the soft one and its folded dot for you.

States: `--text-meta` weight `--weight-quiet`, tabular, `--fg-subtle`, pushed to the end. Not a pill.

CSS: `ui-sidebar.css`. Class `ui-sidebar-badge`.

### SidebarTrigger

The press that folds or opens the rail, or on a phone opens the sheet: `Button` with `look="quiet"`, `square` and `SidebarIcon` at 16px, calling `toggleSidebar`.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `aria-label` | `string` | what it will do | "Collapse menu" or "Expand menu"; on a phone "Open menu". |
| `look` | `ButtonLook` | `"quiet"` | As `Button`. |
| `onClick` | `MouseEventHandler` | none | Runs first; `preventDefault()` keeps the rail as it is. |
| other `Button` props | | | Passed through, except `children`, `square` and `icon`. |
| `ref` | `Ref<HTMLButtonElement>` | none | Forwarded. |

States: `aria-expanded` is `true` while the rail (or the sheet) is open. Carries `data-sidebar="trigger"`.

Where it goes:

- **In the rail's header** (the usual place): `<SidebarHeader><Brand /><SidebarTrigger /></SidebarHeader>`. It sits at the header's end (`margin-inline-start: auto`). Folded, everything else in that header is hidden and the trigger, 2rem square at the header's 0.5rem inset, sits exactly over the marks. On a phone it draws nothing inside the sheet, which has its own close; the sheet's `padding-inline-end: 3rem` is for that close.
- **In the page's header**: always drawn, except on a wide screen when `collapsible="none"`. Use it there for a phone (`useSidebar().isMobile`), since a closed sheet's header is not on the page.

CSS: `ui.css` through `Button`; `ui-sidebar.css` (`.ui-sidebar-header > .ui-sidebar-trigger`) places it in a header.

Dependencies: `useSidebar`, `Button`, `SidebarIcon`.

### useSidebar

`useSidebar()` returns `SidebarState` from anywhere under `SidebarProvider`; throws outside one.

```ts
interface SidebarState {
  state: "expanded" | "collapsed"; open: boolean; setOpen(open: boolean): void;
  openMobile: boolean; setOpenMobile(open: boolean): void; isMobile: boolean;
  toggleSidebar(): void; collapsible: SidebarCollapsible; contained: boolean;
}
```

`SidebarCollapsible` is `"icon" | "offcanvas" | "none"`.

### EmojiPicker

A choice of emoji in a popover: a search over the words each is found by, and a grid the arrow keys walk. The popover closes after a pick.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `open` | `boolean` | required | Whether it is up. |
| `onOpenChange` | `(open: boolean) => void` | required | Asked to change. |
| `onPick` | `(emoji: string) => void` | required | Handed the emoji as text. |
| `trigger` | `(props: PopoverTriggerProps) => ReactElement` | required | Draws the opener. |
| `placement` | `Placement` | `"top-start"` | Where it opens. |

Keys: in the search, ArrowDown goes into the grid and Enter picks the first match; in the grid, left and right step in reading order, up and down to the nearest emoji in the row above or below.

States: one size from opening (17.5rem by 18rem, padding 0.5rem). Group headings `--text-meta` weight 600 `--fg-subtle`; eight columns; each emoji square, radius `--radius-row`, 1.125rem; hover `--field-fill-hover`, press `--field-fill`, focus outline 2px `--focus`, offset -2px. "No emoji is called that." when nothing matches (`--text-ui`, `--fg-subtle`).

`EMOJI_GROUPS`: four groups, Faces (24), Hands (12), Things (18), Signs (12), each `{ label, emoji: Emoji[] }`; `Emoji` is `{ char: string; name: string }`, the name a space-separated list of search words, matched by word prefix.

Tokens: the `Popover` tokens, `--text-meta`, `--text-ui`, `--fg-subtle`, `--radius-row`, `--field-fill`, `--field-fill-hover`, `--focus`.

CSS: `ui-overlays.css`. Classes `ui-emoji-picker`, `ui-emoji-scroll`, `ui-emoji-group`, `ui-emoji-grid`, `ui-emoji`, `ui-emoji-none`.

Dependencies: `Popover`, `SearchField`.

### FileChip

A file on its way somewhere, as a small card: a picture or icon, its name cut to fit, its size, and a remove button while it can still be taken off. One control's height (1.75rem), so it stands in a row of buttons.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `name` | `string` | required | Its name (and `title`). |
| `size` | `string` | none | Its size in words ("2.4 MB"). |
| `meta` | `string` | none | The card's second line ("PNG, 2.4 MB"); the chip shows `size`. |
| `look` | `"chip" \| "card"` | `"chip"` | `card` is the taller (2.75rem) card a tray lays out. |
| `preview` | `string \| null` | none | A picture's address. |
| `icon` | `ReactNode` | none | Drawn when there is no preview. |
| `sending` | `boolean` | `false` | A bar along its foot; no remove button. |
| `progress` | `number \| null` | none | 0 to 1; unknown sweeps. |
| `onRemove` | `() => void` | none | Adds a remove button. |
| `removeLabel` | `string` | `` `Take ${name} off` `` | The remove button's name. |
| `className` | `string` | none | Placement. |

States: radius `--radius-row`, `--text-meta`, `--fg` on `--surface-lifted` with a `0 0 0 1px var(--line)` ring; thumb 1.375rem (card 2.25rem) on `--field-fill`; name `--fg-strong`; size tabular `--fg-subtle`. Remove: a quiet `IconButton` 1.375rem tall (`XIcon` 14px). Sending: a 2px bar of `--line` with an `--ink-face-bottom` fill easing its width (`--motion-slow` `--ease-track`); unknown progress sweeps with `ui-progress-sweep`, and under reduced motion is a still bar at opacity 0.5.

Tokens: `--radius-row`, `--text-meta`, `--fg`, `--fg-strong`, `--fg-subtle`, `--surface-lifted`, `--line`, `--field-fill`, `--ink-face-bottom`, `--ease-track`.

CSS: `ui-display.css` (`ui-file-chip`, `ui-file-chip-thumb`, `ui-file-chip-name`, `ui-file-chip-size`, `ui-file-chip-words`, `ui-file-chip-x`, `ui-file-chip-bar`). The keyframes `ui-progress-sweep` are in `ui-feedback.css`.

Dependencies: `IconButton`; icon `XIcon`.

### MediaGrid

Pictures and films sent beside words: one at its own shape within 28rem by 20rem, or several in a grid of one width (two side by side, three as one tall and two stacked, four and more two by two with the rest counted on the last). Every box takes its size before its bytes arrive.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `items` | `MediaItem[]` | required | Nothing is drawn when empty. |
| `className` | `string` | none | Placement. |

`MediaItem` is `{ key; kind: "image" | "video"; src; alt; width: number | null; height: number | null; onOpen?: () => void }`. `MEDIA_WIDE` is 448 and `MEDIA_TALL` is 320 (pixels). A single box is its own shape scaled into those bounds (at least 64px wide); unknown shape is 16rem at 4:3 for a picture and 448px at 16:9 for a film. A film's address gets `#t=0.1` for a poster frame.

States: tile radius `--radius-row` (inside a grid `--radius-mark`, the grid's outer corners `--radius-row`) on `--bg-recessed`, with an edge `inset 0 0 0 1px var(--line-soft)` laid over the picture. With `onOpen` the tile is a button (`zoom-in`); hover darkens the picture (`brightness(0.94)`, `--motion-fast`); focus outline 2px `--focus`, offset 2px. A picture or film that fails says so in words ("This picture could not be shown.", "This film could not be played here.") at `--text-meta` `--fg-subtle`. The `+n` cover is `--text-lead` weight 600 white on `oklch(0 0 0 / 0.45)`; a film's ground is `oklch(0 0 0)`.

Tokens: `--radius-row`, `--radius-mark`, `--bg-recessed`, `--line-soft`, `--focus`, `--text-meta`, `--text-lead`, `--fg-subtle`.

CSS: `ui-timeline.css`. Classes `ui-media`, `ui-media-grid`, `ui-media-tile`, `ui-media-failed`, `ui-media-more`.

### FileCard

A file that is not drawn in place: its mark, its name, what it is and how large, opened by a press where it can be and downloaded from its end. A preview sits in a fixed-height box above the name, so the card is its final size either way.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `name` | `string` | required | Its name. |
| `meta` | `ReactNode` | required | "PDF, 2.4 MB". |
| `icon` | `ReactNode` | required | Its mark. |
| `onOpen` | `() => void` | none | Makes the card a button. |
| `download` | `string` | none | An address to download from; the card itself links there when there is no `onOpen`, and a Download button sits at its end when there is. |
| `preview` | `ReactNode` | none | A 7.5rem box above the name (a PDF's first page as a canvas). |
| `pending` | `boolean` | `false` | Quieter (opacity 0.55) and inert. |
| `className` | `string` | none | Placement. |

States: width `min(100%, 20rem)`, radius `--radius-row`, `--field-fill`, hover `--field-fill-hover` (`--motion-fast`). Focus on the open area: outline 2px `--focus`, offset 2px. Mark 2rem on `--surface-lifted` with a `--line-soft` ring; name `--text-ui` weight 600 `--fg-strong`; meta `--text-meta` tabular `--fg-subtle`. Preview ground `--bg-recessed`; a canvas in it is white with radius `--radius-mark`. Download: a quiet square `ButtonLink` (`DownloadSimpleIcon` 16px) with a "Download" tooltip.

Tokens: `--radius-row`, `--radius-mark`, `--field-fill`, `--field-fill-hover`, `--focus`, `--surface-lifted`, `--line-soft`, `--text-ui`, `--text-meta`, `--fg-strong`, `--fg-subtle`, `--bg-recessed`, `--control-h-sm`.

CSS: `ui-timeline.css`. Classes `ui-file`, `is-pending`, `ui-file-open`, `ui-file-preview`, `ui-file-row`, `ui-file-mark`, `ui-file-words`, `ui-file-name`, `ui-file-meta`, `ui-file-download`.

Dependencies: `ButtonLink`, `Tooltip`; icon `DownloadSimpleIcon`.

### FileGrid

Several files together as uniform tiles in one wrapping grid: columns of at least 8.5rem, as many as fit in 33rem, gap 0.375rem.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `children` | `ReactNode` | required | `FileTile`s. |
| `aria-label` | `string` | none | The group's name. |
| `className` | `string` | none | Placement. |

CSS: `ui-timeline.css`. Class `ui-file-grid`.

### FileTile

One file in a `FileGrid`: a preview area of one fixed size (6.5rem tall), its name and its kind and size under it.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `name` | `string` | required | Its name. |
| `meta` | `ReactNode` | required | "PDF, 2.4 MB". |
| `icon` | `ReactNode` | required | The kind's mark, under any preview. |
| `preview` | `ReactNode` | none | Fills the area; an `img` or `video` is cropped to fill; a `.ui-tile-paper` holds a PDF page. |
| `badge` | `ReactNode` | none | A small mark at the preview's lower left (a film's play mark). |
| `onOpen` | `() => void` | none | Opens it on a press. |
| `download` | `string` | none | Downloads it on a press, or with `onOpen` from a button at the words' end. |
| `pending` | `boolean` | `false` | Quieter and inert. |
| `className` | `string` | none | Placement. |

States: radius `--radius-row`, `--field-fill`, hover `--field-fill-hover`; focus outline 2px `--focus`, offset 2px; hovering a button tile darkens its picture. Preview ground `--bg-recessed`, a `--line-soft` line at its foot; mark `--fg-subtle`. Badge 1.375rem, round, white on `oklch(0 0 0 / 0.55)`. Name `--text-meta` weight 600 `--fg-strong`; meta `--text-tag` tabular `--fg-subtle`. Download: a quiet square `ButtonLink` 1.625rem (`DownloadSimpleIcon` 15px). Pending: opacity 0.55.

Tokens: `--radius-row`, `--radius-mark`, `--radius-round`, `--field-fill`, `--field-fill-hover`, `--focus`, `--bg-recessed`, `--line-soft`, `--fg-subtle`, `--fg-strong`, `--text-meta`, `--text-tag`.

CSS: `ui-timeline.css`. Classes `ui-tile`, `is-pending`, `ui-tile-open`, `ui-tile-preview`, `ui-tile-mark`, `ui-tile-paper`, `ui-tile-badge`, `ui-tile-words`, `ui-tile-name`, `ui-tile-meta`, `ui-tile-download`.

Dependencies: `ButtonLink`, `Tooltip`; icon `DownloadSimpleIcon`.

### TimelineDivider

A rule across a timeline with its words on it: a day, centred and quiet, or where the new messages start (`look="new"`), an ink line running to its word at the end.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `children` | `ReactNode` | required | The words (also its `aria-label` when a string). |
| `look` | `"day" \| "new"` | `"day"` | Which rule. |
| `id` | `string` | none | So a page can find it. |
| `className` | `string` | none | Placement. |

States: margin `1rem 0 0.25rem`, gap 0.625rem; words `--text-tag` weight 600, line height 1.3, `--fg-subtle`; lines 1px `--line-soft`. New: the line before is `--fg-strong`, there is no line after, and the words are `--ink-words` on `--ink-face-bottom`, radius `--radius-row`.

Tokens: `--line-soft`, `--text-tag`, `--fg-subtle`, `--fg-strong`, `--ink-words`, `--ink-face-bottom`, `--radius-row`.

CSS: `ui-timeline.css`. Classes `ui-divider`, `ui-divider-day`, `ui-divider-new`, `ui-divider-words`.

### Reaction

Something said back to a message, as a small pill: its mark and how many. Its word and who said it are its accessible name and its tooltip. The reader's own is outlined in ink; pressing says it or takes it back.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `icon` | `ReactNode` | required | Its mark. |
| `label` | `string` | required | Its word ("Seen"). |
| `count` | `number` | required | How many. |
| `pressed` | `boolean` | required | The reader's own (`aria-pressed`). |
| `onPress` | `() => void` | required | Say it or take it back. |
| `tip` | `ReactNode` | `label` | What the tooltip says ("Seen by Ana and you"). |

States: 1.375rem tall, radius `--radius-round`, `--text-tag` weight `--weight-ui`, `--fg-subtle` on `--field-fill`. Hover `--fg` on `--field-fill-hover`. Press: ring `inset 0 0 0 1px var(--fg-subtle)`. Pressed: `--fg-strong` on `--surface-lifted`, ring `inset 0 0 0 1px var(--fg-strong)`. Focus outline 2px `--focus`, offset 2px. Count tabular. Eases over `--motion-fast`.

Tokens: `--radius-round`, `--text-tag`, `--fg-subtle`, `--fg`, `--fg-strong`, `--field-fill`, `--field-fill-hover`, `--surface-lifted`, `--focus`.

CSS: `ui-timeline.css`. Classes `ui-reaction`, `ui-reaction-mark`, `ui-reaction-count`.

Dependencies: `Tooltip`.

### Reactions

A row of reactions under a message: wrapping flex, gap 0.25rem, 0.25rem above. Takes `children`.

CSS: `ui-timeline.css`. Class `ui-reactions`.

### ActionBar

A compact pill of dense icon buttons on the floating surface, laid over the corner of whatever it acts on without moving anything; the caller places it.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `aria-label` | `string` | required | Its name. |
| `children` | `ReactNode` | required | `IconButton`s and `ActionBarRule`s. |
| `role` | `"toolbar" \| "group"` | `"toolbar"` | Its role. |
| `className` | `string` | none | Placement. |

States: padding 0.125rem, radius `--radius-row`, `--surface-lifted`, `--shadow-raise`, fading in over `--motion-fast`. Square buttons inside are 1.625rem with radius `calc(var(--radius-row) - 0.125rem)`, icons 15px, `--fg-subtle` (hover `--fg-strong`); a button with words is 1.625rem at `--text-meta`.

Tokens: `--radius-row`, `--surface-lifted`, `--shadow-raise`, `--fg-subtle`, `--fg-strong`, `--text-meta`.

CSS: `ui-timeline.css`. Class `ui-actionbar`, keyframes `ui-actionbar-in`.

### ActionBarRule

A hairline between groups inside an `ActionBar`: 1px of `--line`, margin `0.3125rem 0.125rem`. No props.

CSS: `ui-timeline.css`. Class `ui-actionbar-rule`.

## Analytics

From `Analytics.tsx` and `TraceWaterfall.tsx`, with their CSS in `ui-analytics.css` and `ui-trace-waterfall.css`. The caller formats every value; the pieces only lay them out.

### WorkspaceHeader

A page's heading with its supporting words and its actions at the end.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `title` | `ReactNode` | required | The page's `h1`. |
| `description` | `ReactNode` | none | A paragraph under it, at most 70ch. |
| `action` | `ReactNode` | none | At the end of the row; under the words below 40rem. |
| `as` | `"header" \| "div"` | `"header"` | The element. |
| native attributes | `HTMLAttributes<HTMLElement>` | | Passed through. |

States: none. Title `calc(var(--text-lead) * 1.5)` weight 600, line height 1.2, tracking -0.025em, `--fg-strong`; description `--text-read`, `--fg-subtle`. Gap 1.25rem, 1.5rem below.

CSS: classes `ui-workspace-header`, `ui-workspace-header-copy`, `ui-workspace-header-title`, `ui-workspace-header-description`, `ui-workspace-header-action`.

### MetricSummary, MetricSummaryItem

A list of headline measures (`section` named by `label`, holding a `dl`), in columns of at least 9rem that wrap.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `items` | `readonly MetricSummaryItem[]` | required | Each `{ label, value, description?, action? }`, every one a `ReactNode` the caller formats. |
| `label` | `string` | `"Summary metrics"` | The section's name. A page with more than one summary gives each its own, or screen readers list several regions by the same name. |
| `bare` | `boolean` | `false` | No rules above and below (`data-bare`). Inside a `Card` the rules are dropped already. |
| native attributes | `HTMLAttributes<HTMLElement>` | | Passed through. |

States: none. Between two `--line` rules with 1rem padding (none when bare or in a card). Label `--text-meta` `--fg-subtle`; value `calc(var(--text-lead) * 1.5)` weight 600, tabular, `--fg-strong`; description `--text-meta` `--fg-subtle`; action 0.5rem below. In a recessed card `--fg-subtle` is remapped to `--fg-subtle-on-fill`, which holds its contrast on the fill.

CSS: classes `ui-metric-summary`, `ui-metric-summary-item`, `ui-metric-summary-value`, `ui-metric-summary-description`, `ui-metric-summary-action`.

### TraceWaterfall, TraceWaterfallSpan

Spans on one shared wall-time track, as an `ol` named by `label`: concurrent spans overlap.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `spans` | `readonly TraceWaterfallSpan[]` | required | Each `{ id, label, detail?, offsetMs, durationMs, status? }`. |
| `extentMs` | `number` | required | The track's full length; 0 or invalid draws no tracks. |
| `renderStatus` | `(status, span) => ReactNode` | the status words | Draws the status at the row's end (a `Badge`, say). |
| `label` | `string` | `"Trace timing"` | The list's name. |
| native attributes | `HTMLAttributes<HTMLOListElement>` | | Passed through to the `ol`. |

States: a span with invalid timing reads "Timing unavailable". Track 0.4375rem, round, on `--line-hairline`; bar `--fg-subtle`, `--tone-danger-ink` when `status` is `error`. Rows split by `--line`; label `--text-ui`, detail `--text-meta` `--fg-subtle`, timing `--text-meta` `--fg`, tabular. Below 40rem the timing takes its own line.

CSS: classes `ui-trace-waterfall`, `ui-trace-waterfall-row`, `ui-trace-waterfall-label`, `ui-trace-waterfall-timing`, `ui-trace-waterfall-track`, `ui-trace-waterfall-status`.

## Tokens

All from `web/src/styles/tokens.css`. Values in the form `light-dark(L, D)` are listed as their light and dark values. The colour tokens and the scales are declared on `:root, [data-mode]` (unlayered), so a section set to the other mode reads them in its own. The type scale, the font tokens and the easings are in Tailwind's `@theme` block.

**The defaults are a starting point.** These values are vic-ui's own interpretation, not a spec a consuming app has to match. An app sets its own brand in one theme stylesheet, imported after vic-ui's and outside any `@layer`, overriding tokens on `:root, [data-mode]` (colours as `light-dark()` pairs) and the font tokens on `:root`, while keeping the `color-scheme` declarations below. Token names, component props and `ui-` class names are the stable contract; the look changes through tokens, never by styling `ui-` classes or restyling through `className`. Behaviour and accessibility hold under any theme: the focus ring, disabled says why, state carries a word, nothing moves, and every tone ink stays at or above 5.8:1 on the canvas, the panel and its own tint in both modes (see [Contrast, measured](#contrast-measured)).

`light-dark()` needs `color-scheme` declared: `:root` is `light`; `:root:not([data-mode])` follows `prefers-color-scheme: dark`; `:root[data-mode="light"]` and `:root[data-mode="dark"]` force one. `:root[data-switching]` turns every transition off for the frame the mode changes in (the one `!important`).

### Neutrals: words

| Token | Light | Dark |
| --- | --- | --- |
| `--fg-strong` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--fg` | `oklch(0.205 0 0)` | `oklch(0.97 0 0)` |
| `--fg-subtle` | `oklch(0.556 0 0)` | `oklch(0.708 0 0)` |
| `--fg-inverse` | `oklch(0.97 0 0)` | `oklch(0.205 0 0)` |
| `--fg-placeholder` | `oklch(0.708 0 0)` | `oklch(0.556 0 0)` |
| `--fg-inactive` | `oklch(0.87 0 0)` | `oklch(0.439 0 0)` |
| `--fg-brand` | `oklch(0.1448 0 0)` | `oklch(0.9702 0 0)` |
| `--fg-link` | `oklch(0.1448 0 0)` | `oklch(0.9702 0 0)` |

### Neutrals: lines and focus

| Token | Light | Dark |
| --- | --- | --- |
| `--line` | `oklch(0.145 0 0 / 0.1)` | `oklch(0.32 0 0)` |
| `--line-hairline` | `oklch(0.935 0 0)` | `oklch(0.269 0 0)` |
| `--line-soft` | `oklch(0 0 0 / 0.07)` | `oklch(1 0 0 / 0.065)` |
| `--focus` | `oklch(0.15 0 0)` | `oklch(0.935 0 0)` |
| `--brand` | `oklch(0.1448 0 0)` | `oklch(0.9702 0 0)` |
| `--brand-hover` | `oklch(0.2686 0 0)` | `oklch(1 0 0)` |

### Surfaces

The surface stack, bottom to top. A surface on the page carries an edge and no shadow; only what floats over it casts one ([Elevation](#elevation)).

| Token | Light | Dark | What sits on it | Edge or shadow |
| --- | --- | --- | --- | --- |
| `--bg-frame` | `oklch(0.962 0 0)` | `oklch(0.09 0 0)` | An application window: the ground round a product's chrome, a step under the canvas, so a frame can be set without moving every canvas-coloured thing. | None. |
| `--bg-canvas` | `oklch(0.9875 0 0)` | `oklch(0.1 0 0)` | The page (`body`). | None. |
| `--bg-base` | `oklch(1 0 0)` | `oklch(0.17 0 0)` | The rail, a table's ground, a panel on the page. | `--edge`. |
| `--bg-tint` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | A tinted ground. | None. |
| `--bg-recessed` | `oklch(0.965 0 0)` | `oklch(0.15 0 0)` | Sunk: previews, a preview well, the sheet's backdrop. | None. |
| `--surface-lifted` | `oklch(1 0 0)` | `oklch(0.1913 0 0)` | Anything that sits on top: cards, chips; menus and dialogs over the page. | `--edge` on the page; `--shadow-float` when it floats. |
| `--bg-contrast` | `oklch(0.12 0 0)` | `oklch(0.985 0 0)` | Tooltips, the rail's dot. | `--shadow-raise`. |

Beside the stack:

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--bg-control` | `oklch(1 0 0)` | `oklch(0.205 0 0)` | A control's ground. |
| `--bg-elevated` | `oklch(0.98 0 0)` | `oklch(0.12 0 0)` | **Deprecated, removed in 0.4.** It sinks in dark rather than lifting: use `--surface-lifted` for what sits on top and `--bg-recessed` for what sinks. The settings dialog's rail still reads it until then. |

### Fields

| Token | Light | Dark |
| --- | --- | --- |
| `--field-fill` | `oklch(0.948 0.002 286)` | `oklch(0.235 0.002 286)` |
| `--field-fill-hover` | `oklch(0.925 0.002 286)` | `oklch(0.265 0.002 286)` |
| `--field-text` | `var(--text-read)` (0.875rem) | same; `1rem` under `(pointer: coarse)`, so iOS does not zoom |
| `--radius-field` | `var(--radius-control)` | same |

### Fills

What lies under a thing the pointer is on, has chosen or is pressing. A mid grey at an alpha, the same in both modes, because it reads as a shade on either canvas. Nothing writes that grey anywhere else (`scripts/check-fills.mjs`, part of `check:design`).

| Token | Both modes | For |
| --- | --- | --- |
| `--fill-faint` | `oklch(0.5965 0 0 / 0.07)` | A faint ground: a dialog's foot, a held menu row. |
| `--fill-hover` | `oklch(0.5965 0 0 / 0.12)` | A list's active row. |
| `--fill-chosen` | `oklch(0.5965 0 0 / 0.14)` | A small button hovered (a chip's x, a search's clear). |
| `--fill-press` | `oklch(0.5965 0 0 / 0.2)` | A press. |

### Buttons: ink (the filled, committing look)

| Token | Light | Dark |
| --- | --- | --- |
| `--ink-rim-edge` | `oklch(0 0 0 / 0.1)` | `oklch(0 0 0)` |
| `--ink-rim-top` | `oklch(0 0 0 / 0.7)` | `oklch(1 0 0)` |
| `--ink-rim-bottom` | `oklch(0 0 0)` | `oklch(1 0 0 / 0.8)` |
| `--ink-face-top` | `oklch(0.269 0 0)` | `oklch(0.922 0 0)` |
| `--ink-face-bottom` | `oklch(0 0 0)` | `oklch(0.985 0 0)` |
| `--ink-face-top-hover` | `oklch(0.268 0.007 34.3)` | `oklch(0.923 0.003 48.7)` |
| `--ink-face-bottom-hover` | `oklch(0.269 0 0 / 0.7)` | `oklch(0.922 0 0)` |
| `--ink-face-top-press` | `oklch(0 0 0)` | `oklch(0.869 0.005 56.4)` |
| `--ink-face-bottom-press` | `oklch(0 0 0)` | `oklch(0.87 0 0)` |
| `--ink-words` | `oklch(1 0 0 / 0.9)` | `oklch(0 0 0 / 0.8)` |

### Buttons: line (rim and face)

These are declared for Texture's minimal look. The library's `ui-button-line` currently draws flat (edge `--line`, rim and face transparent) and does not read them.

| Token | Light | Dark |
| --- | --- | --- |
| `--line-rim-edge` | `oklch(0 0 0 / 0.2)` | `oklch(0.145 0 0)` |
| `--line-rim-top` | `oklch(1 0 0 / 0.5)` | `oklch(0.439 0 0 / 0.8)` |
| `--line-rim-bottom` | `oklch(1 0 0 / 0.5)` | `oklch(0.439 0 0 / 0.8)` |
| `--line-rim-top-hover` | `oklch(1 0 0 / 0.5)` | `oklch(0.439 0 0 / 0.7)` |
| `--line-rim-bottom-hover` | `oklch(0.97 0 0)` | `oklch(0.439 0 0 / 0.5)` |
| `--line-rim-press` | `oklch(0.922 0 0)` | `oklch(0.269 0 0)` |
| `--line-face-top` | `oklch(1 0 0)` | `oklch(0.269 0 0)` |
| `--line-face-bottom` | `oklch(0.985 0 0 / 0.5)` | `oklch(0.371 0 0 / 0.5)` |
| `--line-face-top-hover` | `oklch(0.985 0 0 / 0.5)` | `oklch(0.371 0 0)` |
| `--line-face-bottom-hover` | `oklch(0.97 0 0 / 0.6)` | `oklch(0.371 0 0 / 0.6)` |
| `--line-face-top-press` | `oklch(0.97 0 0 / 0.6)` | `oklch(0.269 0 0)` |
| `--line-face-bottom-press` | `oklch(0.97 0 0 / 0.9)` | `oklch(0.371 0 0)` |

### Tones (meaning)

Each tone is an ink (words and fills), a tint (a notice's ground) and an edge (an outline). `--tone-on` is the words on a solid tone. The class `tone-<name>` hands a part `--tone-ink`, `--tone-tint`, `--tone-edge` and `--tone-fill-on` (`--tone-on`).

| Tone | Token | Light | Dark |
| --- | --- | --- | --- |
| all | `--tone-on` | `oklch(1 0 0)` | `oklch(0.1448 0 0)` |
| danger | `--tone-danger-ink` | `oklch(0.4532 0.118 42.5)` | `oklch(0.8173 0.0863 48.74)` |
| danger | `--tone-danger-tint` | `oklch(0.9146 0.036 53.7)` | `oklch(0.2545 0.0487 41.8)` |
| danger | `--tone-danger-edge` | `oklch(0.4532 0.118 42.5 / 0.45)` | `oklch(0.8173 0.0863 48.74 / 0.45)` |
| caution | `--tone-caution-ink` | `oklch(0.4561 0.0894 84.44)` | `oklch(0.8607 0.1055 90.99)` |
| caution | `--tone-caution-tint` | `oklch(0.93 0.05 80)` | `oklch(0.27 0.035 75)` |
| caution | `--tone-caution-edge` | `oklch(0.4561 0.0894 84.44 / 0.45)` | `oklch(0.8607 0.1055 90.99 / 0.45)` |
| settled | `--tone-settled-ink` | `oklch(0.4263 0.0858 152.47)` | `oklch(0.8344 0.077 153.82)` |
| settled | `--tone-settled-tint` | `oklch(0.9239 0.0301 151.51)` | `oklch(0.2574 0.0384 157.46)` |
| settled | `--tone-settled-edge` | `oklch(0.4263 0.0858 152.47 / 0.45)` | `oklch(0.8344 0.077 153.82 / 0.45)` |
| moving | `--tone-moving-ink` | `oklch(0.4076 0.1033 254.88)` | `oklch(0.8225 0.0698 253.93)` |
| moving | `--tone-moving-tint` | `oklch(0.9237 0.0253 255.56)` | `oklch(0.2582 0.0471 256.62)` |
| moving | `--tone-moving-edge` | `oklch(0.4076 0.1033 254.88 / 0.45)` | `oklch(0.8225 0.0698 253.93 / 0.45)` |

### Hues (look)

Each hue is a block (pale on light, deep on dark) and an ink dark enough for words on its own block and on the page. `[data-hue="x"]` hands one to `--hue` and `--hue-ink`.

| Hue | Token | Light | Dark |
| --- | --- | --- | --- |
| sky | `--hue-sky` | `oklch(0.9104 0.0306 254.32)` | `oklch(0.2582 0.0471 256.62)` |
| sky | `--hue-sky-ink` | `oklch(0.4076 0.1033 254.88)` | `oklch(0.8225 0.0698 253.93)` |
| sage | `--hue-sage` | `oklch(0.9098 0.0336 150.81)` | `oklch(0.2574 0.0384 157.46)` |
| sage | `--hue-sage-ink` | `oklch(0.4263 0.0858 152.47)` | `oklch(0.8344 0.077 153.82)` |
| butter | `--hue-butter` | `oklch(0.9244 0.074 94.04)` | `oklch(0.2717 0.0375 89.83)` |
| butter | `--hue-butter-ink` | `oklch(0.4561 0.0894 84.44)` | `oklch(0.8607 0.1055 90.99)` |
| lilac | `--hue-lilac` | `oklch(0.8978 0.0415 297.75)` | `oklch(0.2465 0.0576 290.43)` |
| lilac | `--hue-lilac-ink` | `oklch(0.4151 0.1445 287.91)` | `oklch(0.8144 0.0833 295.37)` |
| clay | `--hue-clay` | `oklch(0.8948 0.0441 52.62)` | `oklch(0.2522 0.0502 41.12)` |
| clay | `--hue-clay-ink` | `oklch(0.4532 0.118 42.5)` | `oklch(0.8173 0.0863 48.74)` |

The hue inks equal the tone inks they share a colour with: sky is moving, sage is settled, butter is caution, clay is danger.

### Accent (look)

One brand colour for a look, never a meaning: a "New" pill, a chosen mode, a send button, a switch that is on. It is not a fifth tone, says no state and is not moving (a navy ink; this is a clear blue). The class `tone-accent` hands a part `--tone-ink: var(--accent-ink)`, `--tone-tint: var(--accent-tint)`, `--tone-edge: var(--accent-edge)` and `--tone-fill-on: var(--accent-on)`. `tone="accent"` is taken by Badge, Count, Switch, Progress, Tabs (the indicator), Button and Announcement (the tag).

| Token | Light | Dark | For |
| --- | --- | --- | --- |
| `--accent` | `oklch(0.48 0.19 262)` | `oklch(0.76 0.12 258)` | The fill: a switch's track, a bar, a filled button, a tag. |
| `--accent-on` | `oklch(1 0 0)` | `oklch(0.1448 0 0)` | Words on the fill and on the ink. |
| `--accent-ink` | `oklch(0.46 0.17 262)` | `oklch(0.8 0.1 258)` | Words and lines in the accent on the page; a solid badge's and a count's fill. |
| `--accent-tint` | `oklch(0.935 0.03 262)` | `oklch(0.275 0.065 262)` | A pale ground (`soft`). |
| `--accent-edge` | `oklch(0.46 0.17 262 / 0.45)` | `oklch(0.8 0.1 258 / 0.45)` | An outline (a hairline badge). |
| `--button-accent` | unset, read as `var(--button-accent, var(--accent))` | same | The filled button's accent; set it on a part of the page to give its buttons another colour. |
| `--button-on-accent` | unset, read as `var(--button-on-accent, var(--accent-on))` | same | The words on it. |

`--accent` is not shadcn's hover grey: the composable sheet's `--color-accent` (`bg-accent`) reads `--fill-hover`, so set `--fill-hover`, not `--accent`, to change that hover (see Changes in 0.2).

### Art

Four hues and a grain for what is drawn rather than read. Used only inside thumbnails, banners and illustrations; no control reads them, and they carry no words, so they have no contrast floor.

| Token | Light | Dark |
| --- | --- | --- |
| `--art-1` | `oklch(0.9 0.06 25)` | `oklch(0.32 0.08 25)` |
| `--art-2` | `oklch(0.93 0.07 85)` | `oklch(0.34 0.07 75)` |
| `--art-3` | `oklch(0.9 0.05 185)` | `oklch(0.32 0.06 190)` |
| `--art-4` | `oklch(0.88 0.06 285)` | `oklch(0.3 0.09 285)` |
| `--art-grain` | `0.08` | same: the alpha of a dot overlay that keeps a gradient from reading as flat vector. |

### Radius scale

| Token | Value | Tier |
| --- | --- | --- |
| `--radius-panel` | `1.25rem` | A panel: a card, a dialog, a sheet, a drop well. |
| `--radius-float` | `1rem` | What floats over a page: a menu, a popover, a tooltip, a toast; a table's shell. |
| `--radius-control` | `0.75rem` | A control: a button, a field, a choice, tabs, a pager's buttons, a large org mark. |
| `--radius-row` | `0.5rem` | A row or tile inside any of those: badges, list rows, file chips and tiles, sidebar rows, the action bar, a small org mark. |
| `--radius-mark` | `0.25rem` | A mark: a checkbox, a key, an option's start slot, a picture inside a media grid. |
| `--radius-round` | `999px` | A pill and a face: switches, counts, reactions, announcements, dots, progress bars. |
| `--radius-button` | `var(--radius-control)` | Alias for buttons. |
| `--radius-field` | `var(--radius-control)` | Alias for fields. |

A nested corner stays concentric by subtracting its inset: `calc(var(--radius-button) - 2px)` (a button's face), `calc(var(--radius-float) - 0.3rem)` (a menu row), `calc(var(--radius-field) - 2px)` (a tab and its indicator).

### Elevation

| Token | Value | Use |
| --- | --- | --- |
| `--edge` | `0 0 0 1px var(--line)` | A surface on the page: a card, a panel, an announcement. No shadow. |
| `--edge-float` | `0 0 0 1px light-dark(oklch(0 0 0 / 0.08), oklch(1 0 0 / 0.1))` | The edge of what floats; part of both shadows. |
| `--shadow-raise` | `var(--edge-float), 0 4px 12px -6px oklch(0 0 0 / 0.3)` | A small piece raised off what it sits on: a tooltip, an action bar, a switch's knob. |
| `--shadow-float` | `var(--edge-float), 0 18px 44px -18px oklch(0 0 0 / 0.45)` | Anything laid over the page: a menu, a list, a popover, a date grid, a dialog, a palette, a toast. |

### Control heights

| Token | Value | Use |
| --- | --- | --- |
| `--control-h` | `2.25rem` | The default: fields, tabs, choices, `Button size="lg"`. The way in uses it. |
| `--control-h-sm` | `2rem` | The dense height: `Button`'s default, `size="sm"` fields and tabs, pager buttons, icon buttons. The norm inside the product. |

### Type scale

The working scale (everything that is not a statement). Nothing drawn is smaller than 11px.

Two weight tokens sit with the faces on `:root`. `--weight-ui: 500` is the interface's weight: buttons, tabs, rows, labels, toasts, every place the pieces drew 500 before, and in the composable API Tailwind's `font-medium` (`--font-weight-medium` maps to it). `--weight-quiet: var(--weight-ui)` is what sits back (quiet buttons, the sidebar's rows, headings and counts) and follows `--weight-ui` unless set apart. An app that finds Cal Sans UI heavy sets either to 400. No state changes either one.

| Token | Size | Line height |
| --- | --- | --- |
| `--text-tag` | `0.6875rem` (11px) | `1.3` |
| `--text-meta` | `0.75rem` (12px) | `1.4` |
| `--text-ui` | `0.8125rem` (13px) | `1.45` |
| `--text-read` | `0.875rem` (14px) | `1.55` |
| `--text-lead` | `1rem` (16px) | `1.4` |

Also declared in the same block, for older and longer-form text:

| Token | Size | Line height |
| --- | --- | --- |
| `--text-xs` | `12px` | `calc(1 / 0.75)` |
| `--text-sm` | `13px` | `calc(1 / 0.85)` |
| `--text-base` | `14px` | `1.5` |
| `--text-lg` | `16px` | `1.5` |
| `--text-body` | `1.0625rem` | `1.65` (the `body` default) |
| `--text-lede` | `clamp(1.0625rem, 0.95rem + 0.45vw, 1.3125rem)` | `1.55` |
| `--text-display-md` | `clamp(1.75rem, 1.3rem + 1.7vw, 2.625rem)` | `1.08` |
| `--text-display-lg` | `clamp(2.25rem, 1.3rem + 3.6vw, 4.25rem)` | `1.02` |
| `--text-display-xl` | `clamp(2.75rem, 1.1rem + 6.2vw, 6rem)` | `0.98` |
| `--text-display-hero` | `clamp(2.25rem, 1.1rem + 2.6vw, 3.5rem)` | `1.04` |
| `--text-ask` | `clamp(2rem, 1.1rem + 3.4vw, 4rem)` | none set |

Font tokens:

| Token | Value |
| --- | --- |
| `--font-sans` | `"Cal Sans UI", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` |
| `--default-font-family` | `var(--font-sans)` |
| `--font-display` | `"Cal Sans UI", ui-sans-serif, system-ui, sans-serif` |
| `--font-mark` | `var(--font-sans)` (eyebrows, numerals, times, code labels; one face) |
| `--font-wordmark` | `"Space Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` (the logo only) |
| `--font-code` | `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` (an uploaded file's source; no font shipped) |

### Motion

Five tokens on `:root` set every move in the library: three durations and two curves. Every transition and animation in the stylesheets reads them, so a snappier or a stiller system is five values, not forty rules. Longer moves are multiples of `--motion-slow` and staggers are fractions of `--motion-fast`, so they follow too.

| Token | Value | Use |
| --- | --- | --- |
| `--motion-fast` | `150ms` | A colour, a fill or a fade answering a pointer: hover and press grounds, focus rings, carets, tooltips, menus, a toast leaving. |
| `--motion-base` | `220ms` | Something arriving or folding: dialogs, sheets, toasts arriving, the accordion, the tab indicator, the switch knob, the sidebar. |
| `--motion-slow` | `300ms` | Something travelling far or easing a whole face: the button's gradient stops, progress, the way-in's height. The empty state's bars take twice it and the focus page's art eleven thirds of it. |
| `--ease-out` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Something arriving, and every fade. |
| `--ease-track` | `cubic-bezier(0.4, 0, 0.2, 1)` | Something following a position (tab indicator, contents bar, progress, sliding views, the sidebar), and the button's face. |
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Deprecated, removed in 1.0. The old arrival curve, kept at its own value for anything outside the library that still reads it; no piece reads it now, they read `--ease-out`. |

Under `prefers-reduced-motion: reduce` the three durations are `0s`, set once in `tokens.css`, so every piece lands in its end state at once: entrances, slides, folds and fades alike. Pieces carry no reduced-motion rules of their own except for loops, whose period is not a duration: the spinner and the unknown progress bar stand still, the file chip's unknown bar becomes a still stretch at half strength, and the code field's cursor stops blinking. A system that sets its own durations sets them inside `@media (prefers-reduced-motion: no-preference)`, or the zeroing loses to them; a section can set them for itself the same way.

```css
/* Snappier */
@media (prefers-reduced-motion: no-preference) {
  :root { --motion-fast: 100ms; --motion-base: 150ms; --motion-slow: 200ms; }
}

/* Stiller: nothing moves, for everyone */
:root { --motion-fast: 0s; --motion-base: 0s; --motion-slow: 0s; }
```

Kept literal, because they are not motion: the loop periods (`ui-spin` 700ms, `ui-progress-sweep` 1.4s, the code cursor's 1.28s blink), the checkbox tick's overshooting curve `cubic-bezier(0.2, 0.8, 0.2, 1.4)` (its duration is `--motion-fast`), and the timers in script: the tooltip's `TIP_DELAY_MS` and 400ms warm window, the 700ms type-ahead window, the sidebar scrollbar's 600ms hold, and `FormSteps`, whose motion is drawn by the `motion` library (480ms, its own curve, none under reduced motion). One timer mirrors a duration: a leaving toast stays in the list for the leave transition it is actually drawn with (its computed `transition-duration` plus delay, `--motion-fast` as resolved on the toast, in `s` or `ms`), and one dismissed before it is drawn waits the `--motion-fast` its Toaster region resolves, or nothing when there is no Toaster. A duration of zero fires no `transitionend`, and nothing in the library waits on one: the image preview's eased zoom clears itself when reduced motion is on.

`tokens.css` is unlayered, and Tailwind v4 also names a curve `--ease-out` (`cubic-bezier(0, 0, 0.2, 1)`, in its `theme` layer). An app that loads `vic-ui/styles.css` (`dist/vic-ui.css`) beside its own Tailwind build therefore gets vic-ui's curve under its `ease-out` utility, because an unlayered declaration beats a layered one. To keep Tailwind's curve for the app's own utilities and vic-ui's for the pieces, give the utility another name in the app's theme (`@theme { --ease-tw-out: cubic-bezier(0, 0, 0.2, 1); }`, then `ease-tw-out`) or write `ease-[cubic-bezier(0,0,0.2,1)]`. Setting `:root { --ease-out: cubic-bezier(0, 0, 0.2, 1); }` unlayered after `vic-ui/styles.css` restores it everywhere, the pieces' arrivals included.

In the shadcn catalogue (`vic-ui/ui`), Tailwind's default transition duration and curve are `--motion-fast` and `--ease-track`, its `ease-in-out` is `--ease-track`, and its `ease-out` utility reads this `--ease-out` (they share the name). tw-animate-css's `animate-in` and `animate-out` default to `--motion-fast` and `--ease-out`, and its accordion and collapsible to `--motion-base`. A `duration-*` utility is a literal Tailwind writes, which no token reaches, so that stylesheet keeps its own rule under reduced motion: every animation is cut to `0s`, as the tokens cut them, and every transition to 0.01ms, so anything waiting on `transitionend` still hears it. The `scroll-fade` utilities are left out of the animation cut: their animations run on a scroll timeline, not the clock, so a zero duration would stop the edge fade following the scroll, and a fade that follows the reader's own scroll is not motion the page makes by itself.

### Scrim

A scrim is one colour at many strengths, so it is three numbers, read as `oklch(var(--scrim) / a)`. Declared with the same selectors as `color-scheme`.

| Token | Light | Dark |
| --- | --- | --- |
| `--scrim` | `0.9851 0 0` | `0.1149 0 0` |

### Scroll thumb

| Token | Light | Dark |
| --- | --- | --- |
| `--scroll-thumb` | `oklch(0 0 0 / 0.3)` | `oklch(1 0 0 / 0.28)` |
| `--scroll-thumb-hover` | `oklch(0 0 0 / 0.45)` | `oklch(1 0 0 / 0.45)` |

`base.css` draws one scrollbar for everything: 6px wide and tall, no track, a rounded thumb with a 1px transparent border (`background-clip: padding-box`), min height 2.5rem, filling to `--scroll-thumb-hover` under the pointer. Firefox (recognised by `-moz-appearance: none`) gets `scrollbar-width: thin` and `scrollbar-color: var(--scroll-thumb) transparent` instead.

### Bone (placeholders)

| Token | Light | Dark |
| --- | --- | --- |
| `--bone` | `oklch(0 0 0 / 0.075)` | `oklch(1 0 0 / 0.085)` |
| `--bone-glint` | `oklch(1 0 0 / 0.75)` | `oklch(1 0 0 / 0.07)` |

## Rules

### Corners: one radius scale

- Every corner is a token from the radius scale, or a `calc()` of one for a nested corner kept concentric. Nothing sets a corner of its own.
- Tiers: a panel (card, dialog, sheet) is the roundest; what floats over a page (menu, popover, tooltip) and a table's shell a step less; a control (button, field, choice) less again; a row or tile inside any of those, and a mark, least. A pill and a face are round.
- `scripts/check-radius.mjs` enforces it. It reads every stylesheet under `web/src` except `web/src/marketing/` and accepts a `border-radius` (or any `border-*-radius`) only when every corner is `var(--radius-panel|float|control|row|mark|round|button|field)`, a `calc()` whose only variables are those tokens, `0`, `inherit` or `50%`. It also reads every `.tsx` and accepts a Tailwind `rounded-*` class only as `rounded-none`, `rounded-inherit`, `rounded-[inherit]`, `rounded-[50%]`, `rounded-(--radius-x)`, `rounded-[var(--radius-x)]` or `rounded-[calc(var(--radius-x)...)]`; a bare `rounded-panel` (which draws nothing) is refused. A line within two lines below the comment "The front page's own corner" is exempt. It exits 1 with each offending file and line.

### Elevation: edges on the page, shadows only for what floats

- A surface on the page (a card, a panel, an event) has an edge (`--edge`) and no shadow.
- Only what floats over the page casts one: a small piece raised off what it sits on (tooltip, action bar, knob) uses `--shadow-raise`; anything laid over the page (menu, popover, dialog, toast, tray) uses `--shadow-float`. Both include `--edge-float`.
- Nothing writes a shadow of its own.
- `scripts/check-shadows.mjs` enforces it over every `.css` under `web/src/styles`. Each comma-separated shadow in a `box-shadow` must be `none`, `var(--edge|--edge-float|--shadow-raise|--shadow-float)`, an `inset` line, or a hard line with no blur (`x y 0`, which draws an edge, a ring or a state and casts nothing). Any blur or offset that is not a token is refused, and it exits 1 listing each. The front page keeps its own. `npm run check:design` runs both checks; both must pass.

### State never changes weight or size

No state (focus, hover, press, chosen, selected, active, open, current) changes `font-weight`, `font-size` or letter spacing. A chosen tab keeps `--weight-ui` like the rest; a current contents entry keeps 400; a field's label keeps 600 when focused. Colour, fill, ring or shadow carries the change, because a change of weight reflows the row. Counts are tabular numerals in reserved widths (`min-width: 2ch` on a tab's count) so a number changing moves nothing.

### Disabled says why

- Every interactive piece has an eased hover, a press state and a focus ring.
- A disabled control is dimmed to opacity 0.55, still readable, with `cursor: not-allowed`.
- Where the page knows why, it passes `disabledReason`: the control is then `aria-disabled` rather than natively disabled, stays in the tab order and under the pointer, ignores presses, Enter and Space (a submit is held back too), keeps its keyboard focus ring, and shows the reason in the library's tooltip on pointer rest (500ms) and at once on keyboard focus. A disabled option in a list takes `reason`.
- Tooltips appear only on hover after the delay or on focus: never on load, never on touch, never modal.

### Dense control height

`--control-h-sm` (2rem) is the dense height and the norm inside the product; `--control-h` (2.25rem) is the default and what the way in uses. A header row holds every control at one height and never mixes the two. A control taller than the words beside it gives back the difference with a negative block margin.

### Sentence case everywhere

Every label, eyebrow, caption, table head, placeholder and button is written and drawn in sentence case, never in capitals. Hierarchy is carried by weight (600 for a label, 400 for its value) and by size on the working scale (a label at `text-ui` over a value at `text-lead`), never by `text-transform` or the letter spacing capitals need.

### Focus

- A box to type into draws nothing when it is chosen: its caret says so. `base.css` takes the outline off `input` (except checkboxes, radios, ranges and files), `textarea`, `select`, `[contenteditable="true"]` and `.ProseMirror` on `:focus` and `:focus-visible`, and the library's `.ui-field-input` sets `outline: none`.
- Buttons, tabs, checks, radios, switches, links and rows keep a ring that only the keyboard shows: `:focus-visible` outline 2px `var(--focus)`, offset 2px in the library (3px in `base.css`'s global rule; -2px for rows inside a scroller and emoji cells).
- A field held for a reason, which stays focusable, draws `0 0 0 2px var(--focus)` round its box so the reason has somewhere to point.

### Colour

- Colour comes only from the palette in `tokens.css`, written in oklch or oklab (`color-mix(in oklab, ...)`). The palette is the neutrals, the four tones (meaning), the five hues and the accent (look), and the art hues (drawing only). A colour the palette lacks is added to it, with a light and a dark value, before anything uses it. Nothing writes a colour inline.
- The accent is a look, never a fifth tone: it says no state, so whatever is drawn in it still says what it is in words. The art hues live only inside thumbnails, banners and illustrations; no control reads them.
- The four tones keep their meanings wherever a state is shown: **danger** (clay) for what has gone wrong or is being destroyed, and every action that removes, ends, voids, refunds or suspends; **caution** (butter) for what must be read before going on (a change to agreed terms, a warning, a risk not yet harm); **settled** (sage) for what is done and fine (paid, signed); **moving** (sky) for what is under way and waiting on somebody else (open, due, sent).
- Weight says urgency and the tone says kind: a hairline pill in a tone is a standing state; a solid pill asks for a hand now; a notice is the tone's tint behind a rule in its ink; a destructive commit is filled in the danger ink and its way in is outlined in it; the commit of a change to agreed terms is filled in the caution ink.
- The five hues are for look, handed to a part by `[data-hue]`.
- State carries a word, never only a colour, so a reader who cannot tell clay from butter loses nothing. A refusal or a failure says in words what went wrong and what to do next. A notice leads with a different mark per tone, so it is told by shape as well as colour.
- A tint carries strong words only: muted text on a light tint is 3.65:1 and fails. A tint is 1.19 to 1.38:1 from the canvas, a ground and never the thing that says it.

### Contrast, measured

Copied from the comment in `tokens.css`. WCAG 2 relative luminance, against light canvas `#fbfbfb` and panel `#ffffff`, dark canvas `#030303` and panel `#0f0f0f`, measured on the colours Chromium resolves from the built stylesheet by `tests/colour-contrast.test.mjs` (part of `npm test`), which fails below 5.8:1. No ink falls below 5.8:1 on either canvas, the panel or its own tint, and the words on a solid tone or on the accent likewise.

Ink on canvas / panel / its own tint, and `--tone-on` on the ink (for the accent, `--accent-on` on `--accent` and on `--accent-ink`):

| Tone | Light | Dark |
| --- | --- | --- |
| danger | 7.46 / 7.72 / 5.95, 7.72 | 11.43 / 10.62 / 8.87, 10.97 |
| caution | 7.06 / 7.31 / 5.93, 7.31 | 13.51 / 12.56 / 9.91, 12.97 |
| settled | 7.64 / 7.90 / 6.38, 7.90 | 12.77 / 11.87 / 9.56, 12.26 |
| moving | 8.66 / 8.96 / 7.16, 8.96 | 11.95 / 11.10 / 9.06, 11.47 |
| accent (a look) | 7.09 / 7.33 / 6.05, 6.79 and 7.33 | 11.05 / 10.27 / 7.96, 9.22 and 10.61 |

The same test holds the accent button's words at 5.8:1 on every face stop (rest, hover, press) and the accent Tabs indicator likewise, and checks that `--accent` is not moving's ink.

### Nothing smaller than 11px

`--text-tag` (11px) is the floor. Below that a word is a texture.

### One ink button per page, for committing only

The bevelled ink button (`Button look="ink"`, `DangerButton`, `CautionButton`) is only for a real committing action, and a page has at most one ink button. Navigation, sidebar items, filters and toggles use the flat `look="line"`, `quiet`, square icon buttons or `Tabs`. Only a page's primary action is filled, so the one action that matters is the one that reads solid.

### Fields are filled, with no border

A field is a filled surface a step off the ground (`--field-fill`) with no outline; hover deepens the fill (`--field-fill-hover`). Buttons and fields share the control heights and one corner (`--radius-button`, `--radius-field`). What is typed is `--field-text`, 16px wherever a touch keyboard opens. What is fixed at a field's end (the rest of a hostname) is inside the box, never a sentence under it.

### Errors take the label's place

A short error (up to 56 characters) stands in the label's cell in the danger ink and rings the box with a 1px danger line, so an error arriving or going moves nothing. A field named by `aria-label` alone reserves that line when it may show one. A hint line, and a count line, is drawn whenever it can hold words. A refusal too long for the line is a `Notice` with a dismiss at the top of the form; a refusal in a dialog sits at the foot's start beside the button it answers (`FootProblem`). The browser's own bubbles are off (`noValidate`) where the page says what is wrong in place.

### Floating surfaces are in the top layer

Every list, menu, popover, date grid, tooltip and the toaster opens in the browser's top layer (`popover="manual"` and `showPopover()`), positioned by `@floating-ui/dom` with `strategy: "fixed"`, flipped and shifted 8px inside the window. Dialogs and the palette use `<dialog>` with `showModal()`. So no ancestor's overflow, transform or stacking can clip them, and a list opened in a dialog stays in the dialog's tree, so a press in it is not a press outside the dialog. A floating surface whose content arrives after it opens keeps one height (`steady` on `Combobox`, the palette's fixed list, the emoji picker's fixed size). Entrance animations use `backwards`, never `both`, so no held transform becomes a containing block for what is fixed inside.

### Nothing moves

Loading, choosing and pressing never move what somebody is looking at. Each change is measured with `scripts/measure-shift.mjs` at 1280 and 390 wide; its three numbers (shift, swap, codeSwap) stay under 0.001.

- A placeholder is the page's own shape, built from the page's own layout classes, every size taken from the real element at both widths.
- Fixed words are printed in the placeholder, not barred; a value inside a fixed sentence is a word-sized bone; an empty icon slot is a box the icon's size.
- Nothing waits under a list of unknown length: a placeholder draws the first section only, at the page's own page size, or 18 rows where it is not paged.
- A permission draws its control before the read, disabled until the read lands.
- A page that needs no read to draw its frame draws it at once.
- A page that scrolls has its scrollbar from the start (its placeholder at least `100dvh + 1px`).
- A region whose words change reserves its longest wording (one line with an ellipsis, or every variant stacked in one grid cell with the inactive ones `invisible`, `inert` and `aria-hidden`).
- A page stands from its top: what follows from a choice appears below it. A column is centred vertically only where nothing in it changes size, with `safe center`.
- A floating surface keeps its size from opening; a height cap built on the positioner's variables gives each a fallback.
- A control taller than the words beside it gives back the difference with a negative block margin.
- A sticky label never covers content in a view that opens scrolled to its end.
- A value shown on the first frame is started when its code loads, not in an effect.
- Movement is fixed, never hidden: no opacity, fade or entrance animation stands in for a size that is wrong.
- When a font, a type token or a preload changes, a swap is fixed once with a metric-matched fallback, never per page.

The library builds these in: the tab count's reserved width, the contents bar set by its two ends, the pager's seven fixed slots, the date grid's six weeks, the empty state's fixed preview height and two-line sentence, a picture's box sized before its bytes, the textarea's always-drawn foot line, and the field head's shared cell.

### Least first

Every correction the interface has had has been less: smaller, fewer, one screen not two, half the words. Build the least thing that works, then stop: no container, card, panel, icon tile, numbered list or multi-part composition unless the content has parts or somebody asked. Reuse a pattern before inventing one. Show the plain version before elaborating it. A long comment justifying unrequested furniture is a sign the furniture is the problem. Cutting is not a failure.

### Copy

No em or en dashes as connective punctuation anywhere in source or interface. Declarative register. A refusal says what to do next, not what a validator wanted. State carries a word, never only a colour.

### Icons

Icons are generated by `scripts/gen-icons.mjs` from Tabler Icons (MIT, https://tabler.io/icons), IconMCP (MIT, https://iconmcp.com/licence), MingCute (Apache-2.0, https://github.com/Richard9394/MingCute) and the project's own SVGs (`web/src/icons`, named `own:<file>`, one per file, in `currentColor`; a file with a script, an event handler, a link or a foreign object is refused). Each is made by `makeIcon` in `icon-base.tsx`: an `<svg>` of `fill="currentColor"`, `focusable="false"`, `aria-hidden` unless labelled, sized by `size` (default `1em`), drawing its filled twin when `weight="fill"` and one exists. Add an icon to the generator's list; never import a set directly. In vic-ui they ship in `src/icons`.

The library itself uses fifteen: `AlertCircleIcon` (tabler `alert-circle`), `AlertTriangleIcon` (`alert-triangle`), `ArrowDownIcon` (`arrow-down`), `ArrowRightIcon` (`arrow-right`), `CalendarEventIcon` (`calendar-event`), `CheckCircleIcon` (`circle-check`), `CheckIcon` (`check`), `ChevronDownIcon` (`own:chevron-down`), `ChevronRightIcon` (`own:chevron-right`), `ClockIcon` (`clock`), `DownloadSimpleIcon` (`download`), `FlagIcon` (`flag`), `InfoCircleIcon` (`info-circle`), `MagnifyingGlassIcon` (`search`), `XIcon` (`x`). None of them comes from MingCute; the generated file holds 155 icons in all. The four IconMCP SVGs are in `src/icons/iconmcp`; `src/icons/registry.json` records the source of every glyph. Library components and Fumadocs use this catalogue, without a Lucide runtime.

## Fonts

| Face | Files | Axes and weights | Licence | By | Used for |
| --- | --- | --- | --- | --- | --- |
| Cal Sans UI | `cal-sans-ui-wght-geom.woff2` (one variable file, `woff2-variations`) | `wght` 300 to 700; `GEOM` 0 to 100 | SIL Open Font License 1.1 | Mark Davis (WORDMARK), for Cal.com | Everything: the interface at the default `GEOM`, statements at `GEOM 100`. The axis is set by `font-variation-settings: "GEOM" 100` in the app's `.display` rule (`web/src/styles/components/type.css`); `--font-display` names the face only, so the library's dialog title and large org mark draw at the default `GEOM`. |
| Space Mono Bold | `space-mono-700-latin.woff2` | weight 700 only | SIL Open Font License 1.1 | Colophon Foundry, for Google Fonts | The wordmark, and nothing else (`--font-wordmark`). |

Both are declared in `base.css` with `font-display: swap`. Fallback stacks are the font tokens above: `--font-sans` falls back to `ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`; `--font-display` to `ui-sans-serif, system-ui, sans-serif`; `--font-wordmark` to `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`. `--font-code` ships no font and is the device's own fixed-width face. The `GEOM` axis runs from the flowing, interface-tuned drawing (0) to a geometric one (100); never ask for a weight under 300, which clamps.

`body` sets `--font-sans` at `--text-body` with `-webkit-font-smoothing: antialiased` and `-moz-osx-font-smoothing: grayscale`. Selection is `light-dark(oklch(0.1448 0 0), oklch(0.9702 0 0))` behind `light-dark(oklch(0.9851 0 0), oklch(0.1448 0 0))`.

The composable `vic-ui/ui` controls share the original component styles. Its Button renders the same rim, face, busy state and disabled explanation as `vic-ui`; Input, Textarea, Card and Switch use the existing field, surface and switch classes. Import `vic-ui/ui/styles.css` once for either API.

Composable menus, selectors, popovers, tooltips, badges, tabs, checks, radios, tables, progress and dialog typography reuse the corresponding vic classes. Base UI owns their state and positioning; the existing stylesheet owns their appearance. Tabs use Base UI’s indicator measurements for vic’s moving ink mark.
