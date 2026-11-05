# Slider and Settings

These additive components are exported from `vic-ui`. Use the existing `vic-ui/styles.css`, `vic-ui/components.css` or `vic-ui/ui/styles.css` entry; each includes the control and layout styles. The existing `vic-ui/ui` Slider remains unchanged.

## Slider

One horizontal numeric value, using the installed `@base-ui/react/slider`. No new dependency. The forwarded ref is the focusable `HTMLInputElement`, useful for restoring focus after Reset.

| Prop | Type | Default / contract |
| --- | --- | --- |
| `value` | `number` | Controlled; the host can decline changes. |
| `defaultValue` | `number` | Initial uncontrolled value; defaults to `min`. |
| `onValueChange` | `(value: number) => void` | Numeric change requests from keyboard, pointer or input. |
| `onValueCommitted` | `(value: number) => void` | Completed keyboard change, drag release or stepped press. This reports the requested value; a controlled host still decides whether to accept it. |
| `min`, `max`, `step` | `number` | `0`, `100`, `1`; finite numbers, `max > min`, `step > 0`. Values snap to the nearest step anchored at `min`, capped at the largest valid step below `max`. |
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

Base UI retains arrow/Home/End/Page navigation, pointer dragging, hidden native range input, focus and RTL thumb positioning. A track press advances one step toward the pointer when the range has at most 25 intervals. Denser ranges advance by the nearest whole step to one twentieth of the range, stopping at the pointer's snapped value. Repeated presses keep stepping; only dragging the thumb follows the pointer continuously in this mode. Presses focus the input for subsequent keyboard use. Initial and controlled values, change/commit callbacks, ARIA and native form values use the same step grid. For `min=0 max=10 step=3`, End selects 9. Fractional steps are rounded at the precision of `min` and `step`. Touch track presses suppress the companion native touch-start jump while thumb dragging and jump mode retain Base UI behavior.

The track is 4px high. The thumb's visible circle is 14px, outlined in strong foreground; its transparent pointer box is at least 24px. Thumb edges stay inside the control at both bounds. Hover/press change fill without resizing. Keyboard focus rings the target. Disabled opacity is the library's 0.55. All default paint and corners use existing Vic tokens.

## Settings

All four components forward a `HTMLDivElement` ref and native div attributes. They provide presentation only; the host supplies navigation links, selection/routing, inputs, persistence and actions. They do not create an account operation, data loader, focus trap or automatic save.

| Component | Props | Behavior |
| --- | --- | --- |
| `SettingsLayout` | `navigation?: ReactNode`, `navigationLabel?: string` (default `Settings`), `children`, `actions?: ReactNode` | Navigation landmark beside detail content, trailing action row. Navigation is omitted when absent. At container widths of 44rem or less, it moves above the detail, so a narrow embedded panel works even in a wide viewport. |
| `SettingsSection` | `title: ReactNode`, `titleId?: string`, `description?: ReactNode`, `actions?: ReactNode`, `headingLevel?: 2 \| 3 \| 4` (default `2`), `headingProps?`, `children` | Titled vertical section; no extra region landmark. |
| `SettingsGroup` | Same heading props, default heading level `3`; `surface?: "flat" \| "bordered"` (default `bordered`), `children` | Group heading above rows. Border follows the panel radius token; flat removes the outer border and horizontal row inset. No shadow. |
| `SettingsRow` | `label: ReactNode`, `labelId?: string`, `htmlFor?: string`, `description?: ReactNode`, `descriptionId?: string`, `stacked?: boolean`, `align?: "center" \| "start"` (default `center`), `children` | Label/description beside the control, naturally wrapping below as available width shrinks. `stacked` keeps the control below at full width. `htmlFor` renders a native label. |

Rows use an 18rem control width, capped at available width. Override `--settings-control-width` on a row or enclosing layout for placement. Words/actions wrap; components do not assume fixed page widths. Headings stay in the caller's outline using `headingLevel`; `titleId` supports external links/labels and takes precedence over `headingProps.id`. Both Section and Group accept `headingProps` with native heading attributes and `ref`, including `tabIndex={-1}` for host-controlled Go to/focus behavior; `children` and `dangerouslySetInnerHTML` are excluded because `title` owns heading content. Library classes are combined with `headingProps.className`. Row association is explicit rather than cloning or rewriting the host's controls.

A package-import composition lives at `site/src/examples/settings/1-controls.tsx`. The browser fixture adds controlled refusal, custom track, RTL, disabled and wrapping examples; it makes no network or account mutations.

## Package integration

All five components and their props types are root exports. The package preserves the 137 previous runtime exports and adds these five for a total of 142. All three component stylesheet entries include their styles. The optional Office/media preview entry points remain intact. The canonical Slider page offers Ready-made and Composable examples; Settings has its own page in the alphabetical catalogue.

## Verification

Run `npm run build` followed by `node --test tests/controls-layout.test.mjs`. The fixture imports the built package and launches installed Playwright Chromium through an isolated Vite server. Set `CONTROLS_SCREENSHOTS=/absolute/path` for light/dark desktop, mobile and narrow-panel PNGs under both the native and composable stylesheet entries. Tests also assert 320px overflow behavior.

Run `node tests/controls-layout.server.mjs --serve` for the same interactive fixture at port 4399 (`?theme=dark`, `?sheet=ui`, `?narrow`, or `?sidebar`). Stop only that owned process after inspection.

The nine focused checks cover keyboard, pointer drag/press, emulated touch tap/move/drag, bounds, custom paint, disabled tab exclusion, controlled refusal, callback/ARIA/FormData consistency, Reset focus, host heading focus through native refs, responsive wrapping, and Sidebar sibling-observer lifecycle with explicit dialog focus wrapping. Native and composable styles are exercised in both themes. Geometry assertions wait for style transitions to settle before reading bounds.

The actual packed-package test checks all previous exports, the new runtime API, CSS/fonts, and strict Bundler/NodeNext declarations with `skipLibCheck: false`. Website checks exercise the live Settings heading-focus flow and scalar Slider control. No physical-device, Firefox/WebKit, assistive-technology session or Slider hydration check is claimed.
