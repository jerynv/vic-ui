# Canonical Player and PlacePicker port

Completed bounded worker implementation in parent-owned `/Users/jeryn/.t3/worktrees/vic-ui/t3-c2cc92d0`, branch `feat/canonical-controls-sync`. Parent owns integration; no commits, root exports, shared stylesheet imports, package/lock, existing components, previews or applications changed by this worker. The prior Facts/Tree port remains untouched.

Canonical source: V-Client `555625f40a51741b1b7050f579afbdb2b54fccb6`, verified snapshot `/tmp/vic-ui-canonical-source-555625f4`. Exact source blob/SHA identities and adaptation mapping are in `tests/canonical-player-place.provenance.json`. Transfer is user-authorized; no V-Client MIT grant is asserted.

## Actual API

`Player` is byte-identical to the canonical source:

- Required `src: string`; optional `audio: boolean`, `aria-label`, `onTime(ms: number)`, `onError(): void` and `ref: Ref<HTMLVideoElement & HTMLAudioElement>`.
- Native audio or inline video with `controls`, `preload="metadata"`, no autoplay. Video fills the available column, capped at 60vh; audio draws native controls.
- Progress reports milliseconds from native play/timeupdate events; initial paused zero is deliberately silent. Errors are reported to the host, which owns fallback/download/retry UI.
- The host owns URL admission, authorization, loading, expiry and disposal. Player creates no object URLs and revokes none. It does not accept ready bytes, validate content, impose parser budgets, transcode or supply custom controls. It is separate from the optional ready-input AudioPreview/VideoPreview modules.

`PlacePicker` keeps its source contract:

- Required controlled `value: PlaceValue`, `onValueChange(value)`, readonly `spaces`, readonly `projects`, `organization: boolean`, and `aria-label`.
- `PlaceValue = { spaceId: string; projectId: string | null }`; empty `spaceId` denotes the whole organization.
- `PlaceSpace = { id: string; name: string; whole: boolean }`; `PlaceProject = { id: string; name: string; spaceId: string }`.
- Optional `now: { space: { id; name } | null; project: { id; name } | null }` retains current-path metadata even when missing from the supplied lists. This is display behavior, not a permission check.
- Optional `label: ReactNode`, `size: "base" | "sm" | "xs"` (default base), `disabled`, `disabledReason`, `className`.
- `placeWords(space: { name: string } | null, project: { name: string } | null): ReactNode` returns organization words or the space/project path.

Selection is host-controlled. Expansion/search is local; choosing requests a value and closes the sheet even when the host declines it. Search matches space/project names and their combined path. Disabled spaces remain listed but cannot be selected as a whole; projects remain independently selectable. The host supplies all options and performs any authorization on requests. No app loaders/session/schema dependencies were imported.

## Necessary source adaptations

- SVG imports point to Vic's existing catalogue.
- Canonical source used `held` (tooltip presence) as its disabled guard, so `disabled` without a reason still opened. Native disabled controls are now disabled; disabled-with-reason stays focusable but cannot open. Reason description, tooltip node and focus/blur/key handlers are wired. Becoming disabled closes/reset the internal sheet so re-enabling does not reopen stale state.
- Canonical selection removed the focused option without restoring focus. Selection now returns focus to the trigger. Entering/backing out of a space returns focus to its search, including when the former row becomes a disabled whole-space option.
- Public props and native Player behavior are unchanged.

Dedicated CSS copies only the canonical Player/PlacePicker rules, mapping tokens to existing Vic names. Scoped `.ui-place` select-lead/thin-size rules make it independently renderable while the parent integrates shared Select styling. Parent may remove those duplicates after verifying the shared coverage matches. `--control-h-xs` falls back to the source's 1.5rem; `--fg-subtle-on-fill` falls back to `--fg` until the shared token is built.

## Evidence

`CANONICAL_PLAYER_PLACE_SCREENSHOTS=/tmp/vic-canonical-player-place-evidence node --test tests/canonical-player-place.test.mjs`: seven tests pass, zero failures. Log `/tmp/vic-canonical-player-place-tests.log`.

The baseline exact-source run proved ordinary disabled and selection-focus failures; Player already passed. Baseline evidence `/tmp/vic-canonical-player-place-baseline.log`.

Coverage: browsing/back, arrows, search and no results, Enter/Escape, disabled whole-space rows, native disabled controls, explained disabled descriptions/tooltips, host refusal, retained metadata, empty options, all three sizes, 320px overflow and popup containment, both stylesheet entries/themes, reduced-motion browsing. Media checks generate WAV and WebM locally, decode metadata, actually play/seek in Chromium, verify millisecond callbacks and refs, exercise invalid media and host retry, replace the source and unmount while playing. Native playback stops on removal; neither host URL is revoked, and the host audio URL still fetches afterward.

Fixture/example strict typecheck, design/dash checks and whitespace checks pass. Impeccable detector on the owned source/style files returns `[]` at `/tmp/vic-canonical-player-place-design.json`.

Ten PNGs in `/tmp/vic-canonical-player-place-evidence`; inspected native light desktop, composable dark mobile and dark native media output. Capture assertions now await Floating UI placement and theme transitions, after an initial capture sampled the temporary (0,0) position and transitional colors. No unrelated Popover changes were made.

No physical device, installed native app, audio output, Firefox/WebKit, assistive-technology session, arbitrary codec or production streaming URL claim. Final packed root imports/strict declarations and integrated package styles remain parent checks. All test browsers/servers and synthetic video tracks close; no manual process remains.

## Parent integration

Export `Player`; `PlacePicker`, `placeWords` and types `PlaceSpace`, `PlaceProject`, `PlaceValue`. Import the dedicated CSS once; register the examples in `site/src/examples/player` and `place-picker` and convert their direct source imports to root imports after exports exist. `player/sample.ts` is example-only synthetic media generation, not package runtime.

Add the focused test to CI; merge the exact provenance into the parent manifest; extend package consumer/runtime assertions while preserving all previous exports. Preserve optional preview modules. Complete actual packed/type/render checks before claiming release.
