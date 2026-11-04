# vic-ui

A React 19 component library with textured controls, filled fields, clear states, and its own SVG catalogue. Vic’s existing components are the primary API; additional composable controls build on Base UI and shadcn interaction patterns. Both share vic’s palette, type, radius and elevation scales.

The documentation site shows every piece live, in every state it has, with the code that draws it, and every token measured in both modes. Build it with `npm run build:site`.

`MAP.md` is the full spec: every component's props, states, tokens, classes and dependencies, every token family with its values per mode, and the rules.

## Install

```sh
npm install github:jerynv/vic-ui
```

React 19 and React DOM are peer dependencies. Base UI supplies the button primitive used by shadcn/ui; Floating UI positions floating surfaces. Tailwind is not needed by existing imports: the stylesheet is plain CSS.

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
| `vic-ui/icons` | 121 icons, each `(props: { size?, weight? }) => svg` |
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

`tokens.css` declares `color-scheme` for each of these. **Keep that declaration.** A build that lowers `light-dark()` (Vite's default Lightning CSS, a PostCSS preset, older browser targets) turns each one into a pair of variables that only a `color-scheme` declaration sets, so if your own stylesheet removes or overrides `color-scheme` on the root, every colour resolves to nothing once compiled. If you restyle the root, declare it again:

```css
:root { color-scheme: light; }
[data-mode="dark"] { color-scheme: dark; }
```

To stop transitions for the frame the mode changes in, set `data-switching` on the root while you change it and remove it on the next frame.

To change a colour, override its token (`--tone-danger-ink`, `--bg-canvas`) with a new `light-dark()` pair, outside a layer. Every token and its values are listed in `MAP.md` and on the site's Colour page.

## Fonts

The pieces are set in **Cal Sans UI** (a variable face: `wght` 300 to 700 and a `GEOM` axis) and a wordmark in **Space Mono Bold**. Both are under the SIL Open Font License 1.1 and ship in `dist/fonts` with their licences in `licenses/`. To use your own faces, import the parts without the fonts:

```ts
import "vic-ui/tokens.css";
import "vic-ui/components.css";
```

Then load your faces and set `--font-sans`, `--font-display` and `--font-wordmark`. Without either, the stacks fall back to the system's sans and monospace.

## The rules

What every piece already does, and what anything built with them is held to:

- **Least first.** Build the least thing that works. No container, card or panel unless the content has parts.
- **State never changes size.** Hover, press, focus, chosen and open never change a weight, a size or the letter spacing; colour and fill carry the change.
- **Disabled says why.** Dimmed to 0.55, readable, a `not-allowed` pointer. `disabledReason` keeps it focusable and says the reason on hover and focus.
- **One ink button** per page, for its committing action. Navigation, filters and toggles are `line`, `quiet`, icon buttons or tabs.
- **Fields are filled**, with no border and no focus ring: the caret says where focus is. Buttons, tabs and switches keep a keyboard-only ring.
- **Errors take the label's place**, so an error coming or going moves nothing.
- **Dense by default.** `size="sm"` (2rem) inside an app; the default (2.25rem) for a way in and a header.
- **Sentence case** everywhere, never capitals. Hierarchy is weight and size.
- **Nothing under 11px.**
- **Colour only from the palette**, in oklch. The four tones keep their meanings (danger, caution, settled, moving), and state always carries a word, never only a colour. No tone ink is below 5.8:1 on the canvas, the panel or its own tint, in either mode.
- **One corner scale** (`--radius-panel`, `-float`, `-control`, `-row`, `-mark`, `-round`) and **one elevation scale**: a surface on the page has an edge and no shadow; only what floats casts one (`--shadow-raise`, `--shadow-float`).
- **One fill scale** under whatever is hovered, chosen or pressed: `--fill-faint`, `--fill-hover`, `--fill-chosen`, `--fill-press`.
- **Nothing moves** on load, on choosing or on pressing.
- **No em or en dashes** as punctuation.

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
npm run check:dashes   # no em or en dash in the source, the site or the docs
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
