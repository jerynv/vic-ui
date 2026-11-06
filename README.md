# vic-ui

A React 19 component library with textured controls, filled fields, clear states, and its own SVG catalogue. Vic’s existing components are the primary API; additional composable controls build on Base UI and shadcn interaction patterns. Both share vic’s palette, type, radius and elevation scales.

The documentation site shows every piece live, in every state it has, with the code that draws it, and every token measured in both modes. Build it with `npm run build:site`.

`MAP.md` is the full spec: every component's props, states, tokens, classes and dependencies, every token family with its values per mode, and the rules.

## Your brand, not ours

The palette, faces, corners and heights vic-ui ships with are one interpretation, a default to start from. An app built on vic-ui is expected to set its own tokens and look like itself, not like vic-ui. Matching the defaults is never required.

**How.** Write one theme stylesheet, import it after vic-ui's, and override tokens there, outside any `@layer`:

```css
/* theme.css, imported after vic-ui/styles.css */
:root,
[data-mode] {
  --bg-canvas: light-dark(oklch(0.985 0.01 250), oklch(0.16 0.02 250));
  --tone-danger-ink: light-dark(oklch(0.5 0.19 25), oklch(0.78 0.14 25));
  --radius-control: 0.5rem;
}

:root {
  --font-sans: "Your Face", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Your Display Face", ui-sans-serif, system-ui, sans-serif;
}
```

- Give every colour a `light-dark()` pair, so both modes stay yours.
- Use `:root, [data-mode]`, the selector vic-ui declares its colours and corners on, so a section set to the other mode keeps your values. Heights belong to the density: `:root, [data-density]`, or one step such as `[data-density="compact"]`.
- Keep the `color-scheme` declaration (see [Theming](#theming-light-dark-and-the-devices-own)). Without it, every compiled colour resolves to nothing.

**What stays stable for you.** Token names, component props and the `ui-` class names are the contract between vic-ui and your app, and a theme written against them keeps working across releases. Change the look through tokens, not by styling `ui-` classes or passing `className` to restyle a piece: those rules are internal and can change. If there is no token for what you need, ask for one.

**What a theme does not change.** Behaviour and accessibility are the same under any theme: the keyboard focus ring, disabled pieces that say why, state that always carries a word and not only a colour, and nothing moving on load or press. Your colours take on the contrast rule too: each tone ink and the accent ink at least 5.8:1 on the canvas, the panel and its own tint, in both modes, and `--accent-on` on `--accent` likewise.

## Install

```sh
npm install github:jerynv/vic-ui
```

React 19 and React DOM are peer dependencies only: vic-ui uses the app's copy and never brings its own. Base UI supplies the button primitive used by shadcn/ui; Floating UI positions floating surfaces. Tailwind is not needed by existing imports: the stylesheet is plain CSS.

### Vite setup

One block for `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // One React for the app and vic-ui. A second copy (a linked or local install with its own
    // node_modules/react) renders a blank page with "Cannot read properties of null (reading 'useId')".
    dedupe: ["react", "react-dom"],
  },
  build: {
    // Browsers that draw light-dark() themselves, so Vite's Lightning CSS minifier leaves every
    // colour pair as written instead of lowering it to --lightningcss-light and -dark variables.
    cssTarget: ["chrome123", "edge123", "firefox120", "safari17.5"],
  },
});
```

- **Two copies of React.** vic-ui records the React it imported on `globalThis[Symbol.for("vic-ui.react")]`. A second copy of vic-ui that brings a different React logs a clear error naming both versions, and a piece rendered by a React other than its own throws one saying so, rather than failing on a null hook. `npm ls react` shows where the second copy comes from; `resolve.dedupe` makes Vite use one.
- **`light-dark()` under Vite 8.** By default the production build's CSS minifier (Lightning CSS) lowers each `light-dark()` pair to variables that only a `color-scheme` declaration sets. The `cssTarget` above keeps the pairs native. If you support browsers older than those, leave `cssTarget` out: the lowered colours still work as long as `color-scheme` stays declared (see [Theming](#theming-light-dark-and-the-devices-own)). `build.cssMinify: "esbuild"` also leaves the pairs alone. With `css.transformer: "lightningcss"`, `cssTarget` is not read for transforming; set `css.lightningcss.targets` to the same browsers (for example with `browserslistToTargets` from `lightningcss`) or the pairs are lowered.

## Use

Import the primary components from `vic-ui` and the shared compiled stylesheet:

```tsx
import "vic-ui/ui/styles.css";
import { Button, TextField } from "vic-ui";

export function Invite() {
  return (
    <form>
      <TextField label="Email" name="email" type="email" required />
      <Button type="submit">Send invitation</Button>
    </form>
  );
}
```

No consumer Tailwind configuration is required. Import `vic-ui/ui/styles.css` once.
The composable API uses `variant`, compound components, and Base UI’s `render` composition.
The primary API below provides `look`, `to`, `busy`, disabled explanations, and its CSS slots.

`DataTable` composes Table with TanStack Table v9 for sorting, filtering, row selection,
column visibility, and pagination. `DatePicker` composes Calendar and Popover, supports
controlled or uncontrolled dates, and submits a local calendar date through `name`.
The `TypographyH1` through `TypographyMuted` primitives provide the typography recipes.

```tsx
import "vic-ui/styles.css";
import { Button, TextField } from "vic-ui";
import { PlusIcon } from "vic-ui/icons";

export function Invite() {
  return (
    <form>
      <TextField label="Email" type="email" placeholder="Enter their email" />
      <Button type="submit" icon={<PlusIcon size={16} />}>
        Send the invitation
      </Button>
    </form>
  );
}
```

| Import | What it is |
| --- | --- |
| `vic-ui` | Every piece, hook and helper |
| `vic-ui/icons` | 155 icons, each `(props: { size?, weight? }) => svg` |
| `vic-ui/styles.css` | Fonts, tokens, base and every piece, in one file |
| `vic-ui/components.css` | The base layer and every piece, without fonts or tokens |
| `vic-ui/tokens.css` | The custom properties alone |
| `vic-ui/fonts.css` | The two `@font-face` rules alone |

`styles.css` includes a base layer: Tailwind's preflight (box sizing, margins and button resets the pieces are drawn on), the page's ground and words on `body`, one focus ring, one scrollbar and an `sr-only` utility. The pieces sit in CSS layers (`base`, then `components.parts`), so anything you write outside a layer outranks them by where it is written. Every class starts `ui-`; a piece takes `className` for placement only, never to restyle it.

### Links to your own pages

Every `to` link (`ButtonLink`, `IconButtonLink`, `DangerButtonLink`, `Tabs`, `Trail`, `Row`, `RowsMore`, `SidebarMenuButton`, `Announcement`) draws through the link component you hand to `LinkProvider`, and is a plain `<a href>` without one.

```tsx
import { Link } from "react-router";
import { LinkProvider } from "vic-ui";

<LinkProvider component={Link}>
  <App />
</LinkProvider>;
```

### Toasts

Put one `<Toaster />` in the app, then call `toast("Saved", { tone: "settled" })` from anywhere.

## Theming: light, dark and the device's own

Every colour is a `light-dark()` pair in oklch, resolved by the `color-scheme` of the element it is drawn on. Choose with `data-mode` on the root, or on any section that should read as the other mode:

```html
<html data-mode="light">   <!-- light -->
<html data-mode="dark">    <!-- dark -->
<html data-mode="system">  <!-- the device's own; no attribute does the same -->
<section data-mode="dark">...</section>
```

`tokens.css` declares `color-scheme` for each of these. **Keep that declaration.** A build that lowers `light-dark()` (Vite's default Lightning CSS, a PostCSS preset, older browser targets) turns each one into a pair of variables that only a `color-scheme` declaration sets, so if your own stylesheet removes or overrides `color-scheme` on the root, every colour resolves to nothing once compiled. [Vite setup](#vite-setup) shows how to keep the pairs native under Vite 8. If you restyle the root, declare it again:

```css
:root { color-scheme: light; }
[data-mode="dark"] { color-scheme: dark; }
```

To stop transitions for the frame the mode changes in, set `data-switching` on the root while you change it and remove it on the next frame.

To change a colour, override its token (`--tone-danger-ink`, `--bg-canvas`) with a new `light-dark()` pair, outside a layer, as [Your brand, not ours](#your-brand-not-ours) shows. Every token and its values are listed in `MAP.md` and on the site's Colour page.

**`--accent` is the brand colour from 0.2.** shadcn uses `--accent` for the grey under a hovered row; vic-ui uses it for its brand accent (`tone="accent"`), so a stylesheet that sets `--accent` to change the hover grey of `vic-ui/ui` pieces now recolours the accent pieces instead. The composable sheet draws `bg-accent` from `--fill-hover`: set `--fill-hover` to change that hover grey (it moves vic's own hover fill too), and drop an `--accent` you set for hover unless you mean it as your brand.

## Fonts

The pieces are set in **Cal Sans UI** (a variable face: `wght` 300 to 700 and a `GEOM` axis) and a wordmark in **Space Mono Bold**. Both are under the SIL Open Font License 1.1 and ship in `dist/fonts` with their licences in `licenses/`. To use your own faces, import the parts without the fonts:

```ts
import "vic-ui/tokens.css";
import "vic-ui/components.css";
```

Then load your faces and set `--font-sans`, `--font-display` and `--font-wordmark`. Without either, the stacks fall back to the system's sans and monospace. While Cal Sans UI loads, `fonts.css` draws in "Cal Sans UI Fallback", the device's Arial scaled to its metrics, so the swap reflows nothing; `--font-sans-fallback` names it, and a face of your own can point it at a fallback measured for that face.

The interface's weight is a token too: `--weight-ui` (500) for buttons, tabs, rows and labels, and `--weight-quiet` (following it) for what sits back: quiet buttons and the sidebar's rows, headings and counts. Set either to 400 on `:root`, outside a layer, if your face reads heavy. No state changes the weight.

## The rules

What every piece already does, and what anything built with them is held to. Where a test or a script holds a piece to a rule, it is named after the rule; a rule with none is kept by review alone, and says so.

- **Least first.** Build the least thing that works. No container, card or panel unless the content has parts. *Kept by review.*
- **State never changes size.** Hover, press, focus, chosen and open never change a weight, a size or the letter spacing; colour and fill carry the change. *Tested by `tests/state-size.test.mjs`: every interactive root piece measured at rest, hovered, focused from the keyboard, pressed, chosen or open, and disabled, in both modes.*
- **Disabled says why.** Dimmed to 0.55, readable, a `not-allowed` pointer. `disabledReason` keeps it focusable and says the reason on hover and focus. *`tests/button.test.mjs` checks that a button with `disabledReason` stays focusable, ignores a press and shows its reason; the 0.55 dimming is checked for a disabled, busy or held button by `tests/accent-button.test.mjs`, for a switch (with its `not-allowed` pointer) by `tests/switch-variants.test.mjs` and for an input by `tests/native-controls.test.mjs`. Other pieces are kept by review.*
- **One ink button** per page, for its committing action. Navigation, filters and toggles are `line`, `quiet`, icon buttons or tabs. *A development build warns in the console when a second `look="ink"` Button mounts in the same `main` landmark; `allowSecond` silences it for one button. Tested by `tests/one-ink.test.mjs`.*
- **Fields are filled**, with no border and no focus ring: the caret says where focus is. Buttons, tabs and switches keep a keyboard-only ring. *Kept by review.*
- **Errors take the label's place**, so an error coming or going moves nothing. *Kept by review.*
- **Dense by default.** `size="sm"` (2rem) inside an app; the default (2.25rem) for a way in and a header. `data-density="compact" | "comfortable"` on the root or a section moves every height together, and `size="sm"` stays a step under it. *`tests/density-type.test.mjs` measures each density's heights; using `size="sm"` inside an app is kept by review.*
- **Sentence case** everywhere, never capitals. Hierarchy is weight and size. Capitalisation is the author's: no piece forces a case on the words it is given. *`tests/badge-words.test.mjs` checks that a badge draws its words as written.*
- **Nothing under 11px.** *Kept by review.*
- **Colour only from the palette**, in oklch. The palette is the neutrals, the four tones, the five hues, the accent and the art hues. The four tones keep their meanings (danger, caution, settled, moving), and state always carries a word, never only a colour. The accent (`--accent` and its family, `tone="accent"`) is one brand colour for a look, never a fifth tone. The art hues (`--art-1` to `--art-4`, `--art-grain`) live only inside thumbnails, banners and illustrations, never on a control. No tone ink or accent ink is below 5.8:1 on the canvas, the panel or its own tint, in either mode. *`npm run check:design` (`scripts/check-fills.mjs`) refuses a grey fill written by hand; `tests/colour-contrast.test.mjs` holds every tone ink and the accent to the contrast floor, and `tests/accent-button.test.mjs` the accent button's words on every face stop.*
- **One corner scale** (`--radius-panel`, `-float`, `-control`, `-row`, `-mark`, `-round`) and **one elevation scale**: a surface on the page has an edge and no shadow; only what floats casts one (`--shadow-raise`, `--shadow-float`). *`npm run check:design` (`scripts/check-radius.mjs`, `scripts/check-shadows.mjs`).*
- **One fill scale** under whatever is hovered, chosen or pressed: `--fill-faint`, `--fill-hover`, `--fill-chosen`, `--fill-press`. *`npm run check:design` (`scripts/check-fills.mjs`).*
- **Nothing moves** on load, on choosing or on pressing. *Kept by review.*

The house style for writing the library's own source and docs (no em or en dashes among it) is in [CONTRIBUTING.md](CONTRIBUTING.md), with how to add a piece.

## Component foundation migration

The library now uses shadcn's Base UI catalogue and Fumadocs documentation. This gives
the shared design system the full component set and established interaction primitives.
Root exports remain the primary API. The
local consumer audit found `puzzles` and `phaethon`: both use button props, and Phaethon
also styles the `.ui-button-face` slot. Preserve that markup, native refs, `type`, busy
states, disabled explanations, and router links while adapting the implementation.
Native form exports on the separate disclosure branch remain owned by that change.

The migration preserves those contracts while adding all 66 catalogue families, the
marketing site, and live documentation. The consumer repositories keep their existing
versions until their owners choose to upgrade.

## Scripts

`npm test` builds the package and exercises server rendering, button compatibility,
keyboard activation, overlay focus, forms, tables, source views, and theme controls in Chromium. Install the
browser once with `npx playwright install chromium`.

```sh
npm run build          # dist/: ESM, types, vic-ui.css, tokens.css, fonts.css, fonts
npm run typecheck
npm run check:design   # every corner on the radius scale, every shadow on the elevation scale, every grey fill a token
npm run check:dashes   # no em or en dash in the source, the site or the docs (house style, see CONTRIBUTING.md)
npm run icons          # regenerate src/icons/icons.tsx from the icon sets
npm run dev:site       # the documentation site, live
npm run build:site     # the site as static files in website/build/client
npm run test:website   # production build plus marketing, search, and full catalogue browser tests
npm run typecheck:website
```

## The documentation site

The [marketing site and documentation](https://jerynv.github.io/vic-ui/) live in `website/`, built with Fumadocs' Base UI edition and React Router. The main catalogue includes every vic component and the added composable primitives, with live previews and highlighted copyable source. Vic examples reuse `site/src/examples`; shared pages lead with vic and include the compound API below. Examples import the actual package exports.

Pages and search are prerendered, with a 404 fallback for static hosts. The build defaults to `/vic-ui/`; set `VIC_UI_BASE=/ npm run build:site` for a custom domain. `.github/workflows/pages.yml` runs package and website browser tests before publishing `website/build/client`. The original shell is available through `npm run build:reference-site`.

## Licence

MIT for vic-ui's own code (`LICENSE`). The icons, the fonts, the preflight and the constructions adapted from Cult UI and Kibo UI are under their own licences: see `THIRD_PARTY_NOTICES.md` and `licenses/`.
