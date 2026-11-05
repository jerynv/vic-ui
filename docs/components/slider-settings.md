# Slider and Settings source increment

These additive components are ready for parent integration. They are **not yet package root exports**. Import `src/components/Slider.tsx` and `src/components/Settings.tsx` directly in repository fixtures, alongside the existing token/base styles and the dedicated `ui-slider.css` and `ui-settings.css`. The existing `vic-ui/ui` Slider remains unchanged.

## Slider

One horizontal numeric value, using the installed `@base-ui/react/slider`. No new dependency. The forwarded ref is the focusable `HTMLInputElement`, useful for restoring focus after Reset.

| Prop | Type | Default / contract |
| --- | --- | --- |
| `value` | `number` | Controlled; the host can decline changes. |
| `defaultValue` | `number` | Initial uncontrolled value; defaults to `min`. |
| `onValueChange` | `(value: number) => void` | Numeric change requests from keyboard, pointer or input. |
| `onValueCommitted` | `(value: number) => void` | Completed keyboard change, drag release or stepped press. This reports the requested value; a controlled host still decides whether to accept it. |
| `min`, `max`, `step` | `number` | `0`, `100`, `1`; finite numbers, `max > min`, `step > 0`. Prefer a range evenly divisible by `step`. |
| `largeStep` | `number` | `10 * step`; Page Up/Down and Shift+Arrow increment. Use a multiple of `step`. |
| `disabled` | `boolean` | `false`; excludes the native range input from keyboard navigation and ignores pointer changes. |
| `label`, `hint` | `ReactNode` | Optional visible text; generated IDs name/describe the input. |
| `aria-label`, `aria-labelledby` | `string` | Name the range input; explicit labelled-by takes precedence over the generated visible label association. |
| `aria-describedby` | `string` | External description IDs, combined with the generated hint ID. |
| `valueText` | `string \| ((value: number) => string)` | Human-readable `aria-valuetext`, such as `125 percent`. |
| `trackStyle` | `CSSProperties` | Custom track paint; providing it removes the filled indicator. Host owns custom colors/contrast. |
| `trackPress` | `"step" \| "jump"` | `"step"`. `"jump"` uses Base UI's track interaction. |
| `dir` | `"ltr" \| "rtl"` | Inherits Base UI `DirectionProvider`, otherwise LTR. Use this prop or the provider for RTL; a DOM ancestor's `dir` alone does not configure Base UI navigation. |
| `name`, `form` | `string` | Passed to Base UI for native form integration. |
| root HTML attributes | `HTMLAttributes<HTMLDivElement>` | `className`, `style`, `id`, event handlers, etc. belong to the outer div. `children`, `defaultValue`, `onChange`, and `dir` are replaced or excluded by the component contract. |

`id` is the outer wrapper ID, not an input label target. In a `SettingsRow`, pass a stable `labelId` / `descriptionId` and match them with Slider's `aria-labelledby` / `aria-describedby`. For native fields, use `SettingsRow.htmlFor` instead.

Base UI retains arrow/Home/End/Page navigation, pointer dragging, hidden native range input, focus and RTL thumb positioning. A track press advances one step toward the pointer when the range has at most 25 intervals. Denser ranges advance by the nearest whole step to one twentieth of the range, stopping at the pointer's snapped value. Repeated presses keep stepping; only dragging the thumb follows the pointer continuously in this mode. Presses focus the input for subsequent keyboard use. Values clamp to the bounds; fractional steps are rounded at the precision of `min` and `step`.

The track is 4px high. The thumb's visible circle is 14px, outlined in strong foreground; its transparent pointer box is at least 24px. Thumb edges stay inside the control at both bounds. Hover/press change fill without resizing. Keyboard focus rings the target. Disabled opacity is the library's 0.55. All default paint and corners use existing Vic tokens.

## Settings

All four components forward a `HTMLDivElement` ref and native div attributes. They provide presentation only; the host supplies navigation links, selection/routing, inputs, persistence and actions. They do not create an account operation, data loader, focus trap or automatic save.

| Component | Props | Behavior |
| --- | --- | --- |
| `SettingsLayout` | `navigation?: ReactNode`, `navigationLabel?: string` (default `Settings`), `children`, `actions?: ReactNode` | Navigation landmark beside detail content, trailing action row. Navigation is omitted when absent. At container widths of 44rem or less, it moves above the detail, so a narrow embedded panel works even in a wide viewport. |
| `SettingsSection` | `title: ReactNode`, `titleId?: string`, `description?: ReactNode`, `actions?: ReactNode`, `headingLevel?: 2 \| 3 \| 4` (default `2`), `children` | Titled vertical section; no extra region landmark. |
| `SettingsGroup` | Same heading props, default heading level `3`; `surface?: "flat" \| "bordered"` (default `bordered`), `children` | Group heading above rows. Border follows the panel radius token; flat removes the outer border and horizontal row inset. No shadow. |
| `SettingsRow` | `label: ReactNode`, `labelId?: string`, `htmlFor?: string`, `description?: ReactNode`, `descriptionId?: string`, `stacked?: boolean`, `align?: "center" \| "start"` (default `center`), `children` | Label/description beside the control, naturally wrapping below as available width shrinks. `stacked` keeps the control below at full width. `htmlFor` renders a native label. |

Rows use an 18rem control width, capped at available width. Override `--settings-control-width` on a row or enclosing layout for placement. Words/actions wrap; components do not assume fixed page widths. Headings stay in the caller's outline using `headingLevel`; `titleId` supports external links/labels. Row association is explicit rather than cloning or rewriting the host's controls.

A source-import composition lives at `site/src/examples/settings/1-controls.tsx`. The browser fixture adds controlled refusal, custom track, RTL, disabled and wrapping examples; it makes no network or account mutations.

## Parent integration after the preview release

1. Add root runtime exports for `Slider`, `SettingsLayout`, `SettingsSection`, `SettingsGroup`, `SettingsRow` and their five props types in `src/index.ts`. Baseline has 137 runtime root exports; expected result is 142 absent other increments.
2. Import `ui-slider.css` and `ui-settings.css` from `src/components.css`, verify all distributed style entries include them, and retain existing exports.
3. Register the dedicated Settings example and write/attach canonical catalogue pages as appropriate. This increment deliberately does not edit the shared registry or existing Slider page.
4. Integrate `tests/controls-layout.test.mjs` into the chosen CI command, update package-consumer/export assertions, and run packed declaration/package and website checks.
5. Update shared MAP/release records, build and package only in the parent-owned release workspace. Nothing here publishes or modifies dist.

## Verification

Run `node --test tests/controls-layout.test.mjs`. It serves source imports through an isolated Vite server and launches the already-installed Playwright Chromium. No library build or dist import occurs. Set `CONTROLS_SCREENSHOTS=/absolute/path` for six full-page PNGs covering light/dark desktop, mobile and narrow embedded panel. Tests also assert 320px overflow behavior.

Run `node tests/controls-layout.server.mjs --serve` for an interactive source fixture at port 4399 (`?theme=dark`, `?narrow`, or `?sidebar`). Stop only that owned process after inspection.

Browser checks exercise actual keys, pointer drag/press, control bounds, custom paint, native disabled tab exclusion, host refusal, focus restoration after Reset, wrapping and Sidebar lifecycle. Scope is Chromium and source imports; package integration, Firefox/WebKit, assistive-technology sessions, native touch gestures, SSR hydration and final release validation remain parent follow-up as applicable.
