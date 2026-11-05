# Canonical controls in Vic

The canonical control increment adds 35 root runtime exports while retaining the existing APIs and defaults. Import these controls from `vic-ui` and load `vic-ui/styles.css`, or use the existing split font/token/component stylesheet setup. The parent release process owns the final archive, export-preservation and strict packed type checks.

## Choose the existing family

| Family | Root exports and use |
| --- | --- |
| Code field / Input OTP | `CodeField` is a fixed six-digit native input. `vic-ui/ui` retains its configurable InputOTP composition. Both share the Input OTP documentation page. |
| Facts | `Facts` draws host-supplied labels and values as a description list. |
| Focus | `FocusLayout`, `FocusHead`, `FocusMark` provide the task shell; `FocusLine`, `FocusQuiet`, `FocusFoot` supply form copy and actions. |
| Form steps | `FormSteps` displays controlled current/reached steps and requests navigation. |
| Grow | `Grow` measures content height, with an optional host-scoped remembered-height key. |
| Mode choice | `ModeChoice` emits system/light/dark values through `onChange`; the host applies and stores appearance. |
| Pane views | `PaneViews`, `PaneView` keep children mounted and instantly hide/inert inactive panes. Existing SlidingViews still supplies its sliding behavior. |
| Panel | `Panel`, `PanelHead`, `PanelField`, `PanelItem`, `PanelBlock`, `PanelText`, `Actions`, `Action` compose canonical field/item/action rows. |
| Place picker | `PlacePicker`, `placeWords` browse supplied spaces/projects and report a controlled location. |
| Player | `Player` uses native audio/video controls for a host-owned URL. Ready-byte media previews remain optional subpath exports. |
| Providers | `ProviderButtons`, `ProviderChoice` provide selection and a controlled notice slot. Account operations, advice and timing belong to the host. |
| Rows | Existing Row/Rows gain `RowButton` for native actions. |
| Settings dialog | `SettingsDialog`, `SettingsPane` add modal section/save composition. `SettingsPaneSection<V>` is a descriptor type; existing `SettingsSection` remains a runtime layout component. |
| Table | Existing Table gains `Cell`, `wide` columns, `look="roster"` and fit-aware scrolling. |
| Time field | `TimeField` uses integer minutes 0 through 1439 with typed suggestions and explicit host bounds. |
| Time picker | `TimePicker` commits an exact 24-hour `HH:MM` string or empty value using hour/minute segments. |
| Tree | `Tree`, `treePathTo` provide expandable navigation with controlled selection and ancestor lookup. |
| Wrapping row | `WrappingRow` preserves the supplied native element or injected component, props and ref. Host content owns its layout and independent actions. |

Existing root controls also gain explicit Button glass/xs options, Select lead/reserve/text/xs, DatePicker supplied today/clear/lead/text/xs, Dialog right-side placement and nested cancel handling, Sidebar current-location semantics, combined descriptions, and Textarea count control. Default Button ink, released accents, surfaces, controls and preview APIs remain intact.

## Host boundaries

No application permission, session, provider account, calendar, timezone or fetch policy is transferred. The host supplies data and authorizes changes. Focus slots replace application branding, appearance persistence, document-title hooks and shader artwork. There is no `useTab` root export or bundled Grain engine. Player reports media errors to the host rather than implementing download policy.

TimeField and TimePicker do not wrap overnight or silently normalize external values. PlacePicker's retained current-name metadata is presentation, not authorization. Settings panes stay mounted across section changes but close with their dialog; keep durable observers outside the presentation. WrappingRow adds no default role, tabIndex or button type.

## Source and documentation coverage

Controls are adapted from owner-authorized V-Client source `555625f40a51741b1b7050f579afbdb2b54fccb6`. WrappingRow has a separate verified source pin `d44c231f4638029697c436fda6e1ed4ff6957b93`. Worker provenance manifests retain exact Git/SHA mappings and adaptation notes. Source transfer does not establish a new V-Client MIT or asset license grant, and this increment is not a claim of complete application parity.

The ready-made registry has 67 unique, alphabetized entries. Seventeen canonical entries use existing live-example discovery; CodeField aliases Input OTP, while RowButton/Cell/Actions stay in Rows/Table/Panel. Sixteen new Fumadocs family pages, one filtered CodeField alias stub and additive sections on 10 existing pages explain the actual contracts. Existing documentation and APIs remain available.

All completed canonical examples import public `vic-ui` or `vic-ui/icons`. Seven extra live examples exercise root additions to Rows, Table, Button, Select, DatePicker, Dialog and Textarea. Fumadocs already sorts navigation/search by name; no duplicate navigation metadata was introduced.

Website type generation/typecheck and global dash checks pass after the final edits (`/tmp/vic-canonical-docs-types.log`, `/tmp/vic-canonical-docs-dashes.log`). The registry audit confirms 67 unique entries in alphabetical order, 17 canonical example families, titles and public imports.

The live Chromium check renders 24 documentation routes and verifies the CodeField alias, provider focus/return, retained pane input, six native OTP cells, WrappingRow action, RowButton action, independent Table Cell activation, nested Dialog Escape and optional Textarea count. Zero page errors were observed. Results: `/tmp/vic-canonical-docs-browser.json` and `/tmp/vic-canonical-docs-browser.log`.

The new alias initially returned 404 because React Router's explicit prerender inventory had no CodeField file. A frontmatter-only alias stub, matching the existing aliases, fixes that inventory while canonical filtering keeps it out of navigation. Restarting the owned dev server refreshed the startup inventory; the final alias check passes.

Inspected real desktop/light Panel and 390px dark WrappingRow captures under `/tmp/vic-canonical-docs-evidence`. The dark capture uses the actual stored theme preference before page load; an earlier direct class change captured unsettled theme styles and was replaced. No horizontal overflow at 390px. Chromium only; production website build, Firefox/WebKit, assistive technology and final release validation remain parent gates. Both owned dev-server sessions 59964/49420 and every browser process were closed. No live process remains; no commit or package/build/module edit was made by this docs task.


Parent release validation: the integrated library passes107 checks, including the actual tarball with strict Bundler/NodeNext consumers and all142 prior exports. Production website build and all9 browser tests pass. Local feedback editing/export passes. Independent review's two TimeField findings were reproduced and fixed: off-step end values remain selected on reopen, and disabling open suggestions closes and resets their transient search while retaining the selected value. These fixes pass focused regressions in both stylesheet foundations.
