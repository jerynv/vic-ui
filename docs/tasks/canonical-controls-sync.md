# Canonical V-Client control sync

## Objective and isolation

Implement the owner-authorized portable canonical controls/styles additively, preserving all142 released root APIs/defaults, accents, surfaces, Slider/Settings/Combobox and preview entry points. Do not import app permission/session/fetch/calendar policy, change consumer apps or infer an upstream MIT grant. The preview transfer is separate evidence, not all-controls parity.

Owned worktree: `/Users/jeryn/.t3/worktrees/vic-ui/t3-c2cc92d0`, branch `feat/canonical-controls-sync`, baseline `a7aff171b8fcf45ca1c1caf1541d7604d1fbc7a5`. Latest integration fetch confirms origin/main remains that baseline. Shared dirty `/Users/jeryn/Documents/GitHub/vic-ui` is untouched. All native implementation/docs workers finished and released files. The isolated increment is committed; PR and final archive handoff are the remaining release steps. All changes on this branch belong to this task. No app edits, npm publication or downstream adoption claims.

## Source authority

Canonical source pin `555625f40a51741b1b7050f579afbdb2b54fccb6`. Independently verified132 source/reference files and134 safe archive entries against SHA256/Git blobs and local pack bytes. Archive `/Users/jeryn/.t3/worktrees/v-client/t3-dcc005eb/.vault-raw/canonical-ui-handoff/v-client-canonical-ui-555625f4.tar.gz`, SHA256 `bef2cc4d4e64ca362314fdb89dafc89540709e648e4ed50656f3e5de6bd46b2b`; manifest SHA256 `5dde52fef1a29f82944da3a9f463949340920ed4977b448904a5043af11eef37`. Pack is beside archive under `pack`; read-only source snapshot `/tmp/vic-ui-canonical-source-555625f4`. Earlier observed64e source differs in15 UI and4 CSS files and was not substituted.

WrappingRow separate source pin `d44c231f4638029697c436fda6e1ed4ff6957b93`, identical supplied source to reviewed `826ecbd00bb10e8546187b4dfe6506531369f5b6`. Independently verified32 regular safe archive entries,20 source/reference Git identities. Archive `/Users/jeryn/.t3/worktrees/v-client/t3-dcc005eb/.vault-raw/console-wrapping-row-handoff/console-wrapping-row-d44c231f.tar.gz`, SHA256 `5bff68e2bb284e47ac814ad6dedc4b87f94b00382c1031a0c205556eda7341b6`; manifest SHA256 `5034c235a8939382242fc0a3f44e7a36f6cbe1af48d5fdfe6eabae58926e84ec`. Extracted reference `/tmp/vic-ui-wrapping-source-d44c231f`; actual handoff files README.txt and evidence/HANDOFF.source.txt.

Packaged input identities/adaptations: `licenses/canonical-controls`. Original inventory and both pack verification reports: `/tmp/vic-ui-control-sync-audit`. Name matches are not complete behavioral parity.

## Implemented coverage

All named families are implemented and integrated in root exports/styles;177 runtime exports total, all142 historical names preserved in `tests/exports-7de0c2c.json`.

| Family | Disposition and evidence |
| --- | --- |
| RowButton / Cell / Table | Added native row action, independent cell action, wide columns, roster rows and fit-aware scrolling/observer cleanup.6 focused checks. |
| Facts / Tree | Added structural facts and controlled tree/path helper, opaque IDs and host refusal covered.6 checks. |
| Panel / Actions / ModeChoice / SettingsDialog | Added source-derived slots and controlled appearance/modal save composition. Mounted inert/hidden panes, save guards and focus/measurement cleanup.8 checks. Canonical descriptor is SettingsPaneSection<V>; released SettingsSection stays. |
| PaneViews / Grow / CodeField / Focus lines | Added mounted instant pane swaps alongside unchanged SlidingViews; measured growth; six-digit native OTP and text helpers.8 checks. CodeField CSS is isolated from composable OTP. |
| Focus / Providers / FormSteps | Added source layout/animation with host brand/art/appearance/provider slots. No automatic POST/timer, shader or title policy.8 checks. useTab deliberately stays host-owned. |
| TimeField / TimePicker | Added typed integer-minute suggestions and actual React Aria HH:MM segments, structural host bounds, clearing, refusal and cleanup.13 checks including the two review regressions. No app calendar/session policy. |
| PlacePicker / Player | Added controlled place data and native URL media callbacks/lifecycle; no fetching or URL revocation.7 checks. |
| WrappingRow | Exact polymorphic component/SVG, classes ui-wrapping-row hit-row, unlayered vertical rhythm and opt-in console-frame styles.7 checks and12 independent source-CSS/DOM comparisons,154 elements each at1200/390/320 in both themes/styles. |
| Existing controls | Button glass/xs (ink default/accents preserved), Select lead/reserve/text/xs, DatePicker today/none/lead/text/xs, Dialog right sheet/nested cancel, Sidebar aria-current, combined disabled descriptions and Textarea count/near-limit announcement. Two suites,5 checks each. |

Source behavior corrections are documented per family: opaque IDs, paste normalization, disabled actions and disabled-open picker cleanup, source Cell independent activation, provider focus cancellation. Existing Vic defaults remain; Textarea counter keeps its released footer placement.

Dependencies: motion14.9.1 promoted from existing lock to runtime, react-aria-components1.22.1 and @internationalized/date3.12.4 installed scripts-disabled for actual source behavior. Installed MIT/Apache notices retained. Exact row SVG copied into dist/assets; all stylesheet URL paths verified.

## Completed checks

- Final `npm test`:107 checks pass (actual tarball compatibility1 + existing regressions33 + canonical suites73). `/tmp/vic-canonical-final-library.log`.
- Actual tarball strict Bundler and NodeNext skipLibCheck:false compile historical and new typed usage; all177 runtime exports, all142 baseline names, optional preview subpaths without eager docx dependency, fonts/CSS/exact SVG paths pass. `/tmp/vic-canonical-package.log` and `tests/canonical-package-consumer.tsx`.
- Library/website types, design scale/fills/shadows, dash and whitespace checks pass.
- Final production website build and all9 browser checks pass in `/tmp/vic-canonical-final-website.log`. Website types pass in `/tmp/vic-canonical-final-website-types.log`.
- Local annotation flow passes navigation/reload/edit/export: `/tmp/vic-canonical-local-review.log`.
- Docs worker verified24 live routes/interactions with zero page errors.67 alphabetized ready-made entries and102 combined canonical families.16 new family pages, CodeField alias stub,10 additive guide sections,7 additional live examples. `/tmp/vic-canonical-docs-browser.json`; `docs/components/canonical-controls.md`.
- Parent inspected row/table light desktop, compact controls dark and native dark mobile sheet captures. Workers inspected source-family desktop/mobile/theme samples. Chromium only; no physical device, Firefox/WebKit or AT claim. All owned test/preview servers and browsers are closed.

## Review and release state

Independent read-only review completed with two P2 findings in TimeField: off-step end selection lost on reopen/Enter, and disabled-with-reason suggestions stranded open. Report `/tmp/vic-canonical-independent-review.txt`. Parent reproduced both, fixed current-minute inclusion and hosted Combobox disabled close/query reset, and added exact regressions. Focused time suite now13 passes in `/tmp/vic-canonical-time-review-fixed.log`. No independent recheck claimed or requested; small fixes handled directly. Final reruns are complete and pass; no test process remains.

Next: retain the exact tested archive, create/link PR (none exists yet; checked), verify required state and merge under carried authorization, build/copy final tested archive with SHA256/API/source manifest, and deliver to owner thread3818cfce-102d-47ec-bdc2-cf6ec92c09cc. Prepared draft PR body `/tmp/vic-canonical-pr-body.md`; update validation text if review changes anything. No npm publication or consumer edits. Do not claim downstream adoption.

Owner thread was already read and sent verified implementation/coverage progress. Link: <t3-thread://v2/eb51b6c1-6676-40b5-8b2d-78823ceb6e5c/3818cfce-102d-47ec-bdc2-cf6ec92c09cc>. Skill application earlier: long-horizon, delegate, impeccable, headless-browser, file-pr, deliver-to-owner. User working agreement prohibits unsolicited AI attribution, overriding file-pr template attribution. Larger source/dependency PR authorization carries. T3 linking must be the next call after creating/pushing PR; watches only when required and do not poll delegated work.

Final rerun correction: the post-review package test passed, but33 existing regressions produced31 passes and two test timing failures under concurrent load. Catalogue compared identical neutral ink serialized as in-flight oklab versus settled oklch; inline Combobox navigation exceeded its5-second action timeout during startup. Parent changed catalogue theme setup to await CSS transition completion, set a separate30-second navigation timeout while retaining5-second action assertions, and capped each browser-file test group at4 concurrent processes. No product style or behavior was weakened. Targeted repro/fix log `/tmp/vic-canonical-timing-regressions.log`; the subsequent full rerun passed and is recorded below. Session89806 completed with exit1 before reaching website gates; no process from it remains.


Final local gates completed: npm test107/107 (packed1, existing33, canonical73); production website build and9/9 browser tests; website/library types; design/dash/whitespace; local annotation flow1/1. Final logs `/tmp/vic-canonical-final-library.log`, `/tmp/vic-canonical-final-website.log`, `/tmp/vic-canonical-final-website-types.log`, `/tmp/vic-canonical-local-review.log`. Both review findings fixed and regression-covered, no independent recheck claim. Parent also inspected docs Panel light desktop and WrappingRow dark mobile. Session89945 completed with exit0; all test processes are closed.

Release artifacts are being prepared at `/tmp/vic-ui-canonical.aLRTY0` (API.md, typed consumer, root exports and source coverage already present; archive/hash/release.json still pending final commit). No remaining implementation or verification blocker. Next: create/link/review/merge PR under existing authorization, retain the exact commit archive with strict tests and record hash, then notify owner. The final artifact release.json will record source and release SHAs, PR, checksum and deployment state. No npm publication. Review report stays `/tmp/vic-canonical-independent-review.txt`.

Final committed-diff whitespace review removed three whitespace-only lines from canonical panel CSS. No style declaration changed; the retained archive is rebuilt and packed-tested after this cleanup.
