# Canonical time controls

State: implemented and focused checks passing; shared integration/release remains parent-owned. Workspace `/Users/jeryn/.t3/worktrees/vic-ui/t3-c2cc92d0`, branch `feat/canonical-controls-sync`, baseline `a7aff171b8fcf45ca1c1caf1541d7604d1fbc7a5`. No commits or changes to parent-owned files by this worker.

Owned implementation: `src/components/TimeField.tsx`, `TimePicker.tsx`, `time-support/{clock,timePicker}.ts`, `src/styles/components/ui-canonical-time.css`. Owned verification/examples: `tests/canonical-time*`, `site/src/examples/time-field/1-suggestions.tsx`, `site/src/examples/time-picker/1-segments.tsx`, this task note. Existing Panel/Settings work was completed separately in `canonical-panels.md`.

## Actual API and host boundary

`TimeField` and `TimeFieldProps`:
- Required `value: number`, `onValueChange(minute: number): void` use integer wall-clock minutes from 0 through 1439.
- Optional `after: number` is exclusive and shows duration after this minute. `min`/`max` are inclusive; `after` composes with `min`. `durationLabel(minutes): string` replaces generic duration words. No calendar or business-duration limits are imported.
- Source props retained: `label`, `aria-label`, `size: "sm"`, `disabled`, `disabledReason`, `className`.
- Blank suggestions use 15-minute steps. Typing `930`, `9:30`, `9.30` produces morning and evening readings; `0930` is unambiguous; `9:30p` chooses evening; valid typed minutes need not be on a quarter hour. A blank start list begins at the current choice and includes an off-step choice to preserve Enter behavior.
- Invalid or reversed/out-of-day bounds produce no selectable options. Invalid controlled minutes display no selection; valid external values are never clamped. The parser retains source `24:00` recognition, but controls exclude it because this API ends at 23:59. No overnight wrapping of host bounds.

`TimePicker` and `TimePickerProps`:
- Required `value: string`, `onValueChange(value: string): void` use exact `HH:MM` or `""`. No date, zone, seconds or fetching behavior.
- Optional `min`/`max` are inclusive exact `HH:MM`. Reversed or malformed bounds block Done; out-of-range/partial drafts cannot commit. `none` supplies an explicit clear action, which remains available even when bounds are invalid. Invalid external values display empty and serialize empty, without a callback or implicit clamp.
- Source props retained: `id`, `name`, `label`, `hint`, `error`, `aria-label`, `size: "sm"`, `none`, `disabled`, `disabledReason`. Additive `aria-describedby` composes external descriptions with hint/error/disabled-reason IDs.
- Popup draft is captured when opened. Host refusal leaves the controlled value intact; reopening resets to that value. Escape/outside focus dismisses without committing, Done/clear return focus. Disabling an open picker closes it and restores the reason-enabled trigger, avoiding a stranded unfocusable segment editor.
- Genuine React Aria segments support typed hours/minutes, arrows, Home/End, Page Up/Down and segment-local day-edge wrapping; the resulting callback is still wall time, never an inferred next date. Source appearance retained, including a nonrotating clock and explicit `look="line"` for Done without changing Vic's ink default.

## Dependencies and integration

Parent approved and installed exact direct runtime dependencies `react-aria-components@1.22.1` and `@internationalized/date@3.12.4`, matching the source lock. Both are Apache-2.0. Installed React Aria declaration/source contracts were inspected; real DateInput/DateSegment/TimeField behavior is exercised, not replaced. Public component props remain primitive/structural and do not expose dependency Time classes. Internal helpers are not proposed root exports.

Parent next: export `TimeField`, `TimePicker` and both props types from the root, add `ui-canonical-time.css` to shared CSS imports, register examples/catalogue, retain dependency notices, then run integrated strict packed Bundler/NodeNext/export/style checks and release gates. The worker changed no package/lock/shared exports/stylesheets and produced no package archive.

Standalone fixture imports current native CSS or existing composable dist CSS, then current tokens, parent-owned `ui-canonical-controls.css` and the dedicated time stylesheet. No duplicated shared select fallback rules.

## Evidence and limitations

`node --test tests/canonical-time.test.mjs`: **10 passed, 0 failed**. Focused parser and real Chromium tests, including ambiguous/off-step typing, selected Enter, inclusive/exclusive bounds, invalid/day-end inputs, controlled refusal, keyboard segments, partial/clear states, hidden form values, disabled/reason/error composition, dynamic disable, focus, narrow layouts and ResizeObserver/pointer-listener cleanup. Latest log `/tmp/vic-canonical-time-tests.log` records the exact final count.

`npm run typecheck`, `npx tsc --noEmit -p tests/canonical-time.tsconfig.json`, `npm run check:design`, `npm run check:dashes` and owned-file whitespace checks are the source gates. Logs `/tmp/vic-canonical-time-{typecheck,fixture-types,design,dashes}.log`.

Rendered snapshots in `/tmp/vic-canonical-time/`: native/composable foundations, light/dark desktop and mobile. Inspected native-light-desktop and ui-dark-mobile directly. Both 390px and 320px viewport fit checks run. Synthetic browser keyboard/pointer evidence only; physical touch, screen readers, Firefox/WebKit and final packed consumer compatibility remain unclaimed. All worker-owned browsers and fixture servers are closed by test cleanup; no persistent process is required.

## Provenance

Exact source pin `555625f40a51741b1b7050f579afbdb2b54fccb6`. Official pack `/Users/jeryn/.t3/worktrees/v-client/t3-dcc005eb/.vault-raw/canonical-ui-handoff/pack`. Worker rechecked each selected payload SHA256 and Git blob against its manifest; exact evidence in `tests/canonical-time.provenance.json`. Transfer is user-authorized; no V-Client MIT grant is inferred. `calendarGrid` and `call-limits` are reference sources only: the port copies the small time/duration helpers, not their app imports, schema, authorization or business limits.

| Source | Git blob | SHA256 |
| --- | --- | --- |
| `web/src/ui/TimeField.tsx` | `c781a0aaf9c0fbefb8fb680011765211f26159b5` | `ac17d5f651f578d96e19d2bbfcdb17c585922d4040be267d67de6509f24c46da` |
| `web/src/ui/TimePicker.tsx` | `3cece67a350cf0b07c806692d57f001ae40c7116` | `ee8efda6eaab9dcdf5707436e3b7f95961bed7e73cba983064d0b57294b12d85` |
| `web/src/lib/calendarGrid.ts` | `305193706818bc5c19376dd97d69f3883f7bbec4` | `bf77ff77f3cdbf7528d29d35706e4d0c5de50aef155c2ee34998725ca7da2bb5` |
| `web/src/lib/timePicker.ts` | `3dc329db5566d2d3c49b2a53e03f8001c9260a39` | `73df138982fc464efa8c831bd4ea2b570f9e71b5db8aba7283d5219b11ba79a5` |
| `src/lib/call-limits.ts` | `a202f01fba85bc5a6d5e37e8fc79b64b7ed62167` | `d95299f7ce248b960bab961c1960253987d5dc97ffb602867983c660d178e984` |
| `web/src/ui/held.ts` | `420a79c61ae9319aca36bfe450e3122b2fc97063` | `d3fd85f4887ae2681873fe951358cc7e7e8a1b8d0b39a5b02764dff9863fd570` |
| `web/src/styles/components/ui-inputs.css` | `26b5acc9beff47ebbb80361f88d2170226dfc131` | `5b68155eaca3ef749d2411be9834ba23399c2a98a8b1845a60ff9e9d69de8282` |
| `web/src/styles/components/ui-overlays.css` | `df4012b87bc1bf61c67805251a7ed510e6e44cdc` | `f715fb43ad2216a7b8d76a6ed901b771818fce0da92cb72b8626644b603a7dfd` |

## Parent review corrections

Independent review reproduced two P2 issues: an off-step end time was absent from blank suggestions, and disabling the hosted Combobox with a reason left its top-layer list open. Parent reproduced both with regression tests before fixing them. TimeField now includes any valid current minute in blank suggestions, including `after` fields, while retaining end-list ordering. The existing Combobox closes/reset its transient query on disabled transitions without depending on blur; selected values and the reason-enabled input's focus remain.

The expanded focused suite passes13 checks in `/tmp/vic-canonical-time-review-fixed.log`, including reopen/Enter retaining10:46 and disabled-state cleanup/re-enable in both stylesheet foundations. Before-fix evidence is `/tmp/vic-canonical-time-review-before.log`; the native stale-popup reproduction failed as expected, and its long wait caused the subsequent UI subtest to be cancelled. The fixed regression uses a bounded3-second assertion and both cases pass. These are parent-tested fixes, not a claim that the independent reviewer rechecked them. Final package/whole-library gates are tracked in the parent task note.
