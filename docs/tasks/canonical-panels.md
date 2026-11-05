# Canonical panels, appearance choice and settings dialog

Workspace `/Users/jeryn/.t3/worktrees/vic-ui/t3-c2cc92d0`, branch `feat/canonical-controls-sync`, baseline `a7aff171`. Worker owns only Panel.tsx, ModeChoice.tsx, SettingsDialog.tsx, ui-canonical-panels.css, canonical-panels test files, panel/mode-choice/settings-dialog example directories and this task record. No commit, root export, shared CSS import, package, catalogue or application edit by this worker.

Source is exact owner-authorized V-Client commit `555625f40a51741b1b7050f579afbdb2b54fccb6`, read from the verified snapshot `/tmp/vic-ui-canonical-source-555625f4`. This is an authorized first-party transfer, not a new claim of upstream MIT licensing. No app permission/session loaders or dependencies are copied.

## Actual additive API

Eleven runtime exports are ready for parent integration:

- `Panel`, `PanelHead`, `PanelField`, `PanelItem`, `PanelBlock`, `PanelText`, `Actions`, `Action`.
- `ModeChoice`, plus `ModeChoiceValue = "system" | "light" | "dark"`.
- `SettingsDialog`, `SettingsPane`, plus generic descriptor `SettingsPaneSection<V>`.

`Panel` accepts `as="dl" | "ul" | "div"`, aria-label/className/children. Fields preserve description-list labels/values, note/error swaps and control slots. Items preserve mark/words/end/action/link/after slots; internal links use Vic LinkProvider. PanelText preserves controlled value, grow/count, maxLength, placeholder, error and onCommit-on-blur semantics through Vic Textarea. Actions support internal/external links or a button; navigation takes precedence over the button callback, matching source. Disabled links now prevent activation and are removed from sequential focus, and all disabled actions visibly dim; pointer/focus callbacks are respected across target kinds.

`ModeChoice` retains controlled `value`, canonical `onChange(value)` (not a renamed callback), optional per-mode ReactNode labels and aria-label. Native radios provide keyboard and pointer interaction; tiny window previews explicitly use both color schemes regardless of page theme.

`SettingsDialog` retains controlled open/onOpenChange, sections/section/onSection, changes/onSubmit and optional title/eyebrow, save/cancel/problem, disabled/disabledReason, changesWords and className. `SettingsPane` keeps value/label/children. The host owns draft state, section acceptance and saving. Zero changes or disabled prevents form submission. Panes remain mounted while switching sections; inactive panes are inert and explicitly aria-hidden. Dialog close uses the existing Vic Dialog lifecycle and unmounts the presentation. Room measurement observes panes and disconnects on close/unmount. The canonical source descriptor type was renamed `SettingsPaneSection<V>` because released Vic `SettingsSection` is a different runtime layout API, which remains untouched.

## Deliberate adaptation

- Settings CSS is namespaced `ui-settings-dialog-*`; measurement property is `--settings-dialog-room`. Source classes for app-only who-name/who-hint/who-group-mark were omitted.
- Section IDs encode opaque section values; each rail button's aria-controls still points to its matching pane, including spaces and slashes.
- Added inactive-pane aria-hidden alongside inert for consistent accessibility during source visibility transitions. No new focus policy or artificial focus trap; native Dialog may move focus to browser chrome at its boundary.
- Existing Vic tokens replace canonical token names without changing their common values. Parent added exact source --bg-panel/--bg-on-panel/--bg-on-panel-hover/--fg-subtle-on-fill tokens; overrides stay within Panel. This preserves the panel's fill and the deeper child-control fill without changing global field defaults.
- The source mono utility becomes a local ui-panel-mono rule using --font-code. Source effective radii, spacing, mobile chips, panel surfaces and mode drawings are retained.
- Source PanelText exposes a native aria-invalid attribute; the parent-owned Textarea leaf previously overwrote it. Parent applied passthrough and external description merging, and the integrated PanelText regression checks the visible alert plus aria-invalid.
- Disabled Action behavior and safe IDs/explicit hidden semantics are documented source corrections, not an arbitrary redesign.

## Verification and integration

Focused fixture imports owned modules directly, current native CSS or built composable CSS foundation, current tokens and the dedicated new sheet. It does not claim final packed integration. Parent owns adding eleven exports/types, stylesheet import, canonical catalogue registration, source provenance packaging and actual tarball validation preserving all prior142 exports.

Tests exercise description-list semantics; custom host links; stable note/error geometry; controlled text/blur; PanelText invalid state; native appearance radio arrows; disabled button/link activation; exact opaque section IDs; guarded form submission; host-refused section requests; live host refusal; mounted pane identity; inert/hidden panes; responsive width; native dialog return focus; and ResizeObserver cleanup. Native and composable stylesheet foundations are covered in light/dark at desktop and320/390px. Browser scope is installed Chromium. No physical-device, Firefox/WebKit, AT session or final packed declaration claim.

Evidence paths: `/tmp/vic-canonical-panels-tests.log`, `/tmp/vic-canonical-panels-typecheck.log`, `/tmp/vic-canonical-panels-fixture-types.log`, `/tmp/vic-canonical-panels-design.log`, `/tmp/vic-canonical-panels-dashes.log`. Screenshots in `/tmp/vic-canonical-panels/`: both sheets/themes desktop/mobile panels and native/ui settings dialog light desktop/dark mobile. Inspected light desktop panels, dark mobile panels, light desktop dialog and dark mobile dialog.

Initial fixture correction: native TextField accepts onChange, not onValueChange. An initial attempted exact last-to-first Tab assertion correctly observed native dialog focus entering browser chrome (document.hasFocus false), so the check now prevents background-control focus and retains explicit opener restoration. Shared composable CSS can delay source visibility transitions, so hidden state is awaited after checking immediate inertness; aria-hidden independently removes inactive panes from roles.

Final verification complete:

- `node --test tests/canonical-panels.test.mjs`:8 passed,0 failed. Includes all4 panel sheet/theme cases and both settings stylesheet cases, with dark mobile views.
- `node_modules/.bin/tsc --noEmit -p tests/canonical-panels.tsconfig.json`:passed, including all3 source examples.
- `npm run typecheck`:passed.
- `npm run check:design`, `npm run check:dashes`, `git diff --check`:passed.
- Parent Textarea aria-invalid passthrough is integrated into the actual fixture and the PanelText alert/invalid regression passes.
- All owned test servers and browsers closed in finally blocks; no manual server, watcher or process remains. No commit made.

Next action belongs to parent: inspect owned diff, integrate root/type exports and stylesheet/catalogue entries, register source identities in packaged provenance, then run strict packed/whole-library/website checks. No known remaining worker-owned blocker.

## Source identities

| Source | Git blob | SHA256 |
| --- | --- | --- |
| `web/src/ui/ModeChoice.tsx` | `fe7e7af7c069fda996cee3882f1f3e7ce5e150a7` | `c0136a2b333a1c4e63db03a84e6d644c2be0c30adb84da7aa4111dfe4dc2fb2e` |
| `web/src/ui/Panel.tsx` | `b63224b4996e6082de69830434fc7af7f6f25d1c` | `c2174d32c29663a083f7a0713e357f66f507eb735d26f648078eb59aeaa056fc` |
| `web/src/ui/Settings.tsx` | `b35866a60bd50f253e3bd5a02da4345c61aa4a5f` | `1d7a862e926a7b5249d88bd1585bbbeccd35993e3b06fc045ce8de4a94c57a49` |
| `web/src/styles/components/ui-mode.css` | `7de3f10c0899bb12cffef17612bd901143267cd1` | `3253705233840ce07c2cd412839af23b44ad1ba6fbaf5128921cfc07fafd18d8` |
| `web/src/styles/components/ui-overlays.css` | `df4012b87bc1bf61c67805251a7ed510e6e44cdc` | `f715fb43ad2216a7b8d76a6ed901b771818fce0da92cb72b8626644b603a7dfd` |
| `web/src/styles/components/ui-panel.css` | `62af25d7edf4ed2fc1cab224abb832440df1b370` | `a070f62d220c9f3431f44cb7096fdc3c86e0a85042ee1bc15cc2019b1886720f` |
| `web/src/styles/tokens.css` | `79cc638f00e8af600d68748feef98573d0ebfec1` | `b5c965c683ef02012dec42f29718e1c93eea3835d3e5f7a0161e6ba3fdba295c` |
