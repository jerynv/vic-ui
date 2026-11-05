# Canonical focus primitives and persistent panes

Owned increment in t3-c2cc92d0 / feat/canonical-controls-sync. Exact source555625f40a51741b1b7050f579afbdb2b54fccb6 was extracted read-only at /tmp/vic-ui-canonical-source-555625f4. No V-Client/Phaethon/shared-checkout edit, no new dependency, no commit, no parent integration-file edit. Source transfer is owner-authorized; no upstream MIT grant asserted. Original Git blobs and SHA256s are retained in tests/canonical-focus-panes.provenance.json.

Owned files: src/components/PaneViews.tsx, Grow.tsx, FocusLines.tsx, CodeField.tsx; src/styles/components/ui-canonical-focus-panes.css; tests/canonical-focus-panes*; site/src/examples/{pane-views,code-field,grow,focus-lines}/*; this note. Parent owns root exports/shared stylesheet imports/package/catalogue/provenance integration and all other files. Concurrent writers are preserved.

## Actual API

- PaneViews: native div attributes plus required active:string and children. PaneView: native div attributes plus required value:string and optional children. Active matching is controlled; hidden panes remain mounted with native hidden/inert. The controller's hidden/inert values take precedence over passed attributes. Host owns selection/focus policy; there is no animation, automatic selection or focus move. Existing SlidingViews is untouched.
- Grow: children; optional remember:string, contentKey:string, className:string and innerClassName:string. ResizeObserver tracks inner height; contentKey replaces the inner content and refreshes observation. remember retains the last measured height by key across remounts, as canonical source does. Observer disconnects on replacement/unmount. Reduced motion disables the source height/entry animation. It does not load content or invent step state.
- FocusLine and FocusFoot: native paragraph attributes. FocusQuiet: native HTMLElement attributes plus optional action:string; renders a POST form when action is supplied, otherwise a div. Host supplies/handles any action. No authentication behavior added.
- CodeField: required label:string, value:string, onChange:(value:string)=>void; optional autoFocus:boolean, error:ReactNode and additive disabled:boolean. One controlled native text input with inputMode=numeric, autocomplete=one-time-code and maxLength=6, drawing six source-style cells. Existing label/error association remains intact. Typing filters non-digits; formatted paste normalizes before native maxlength truncation and respects the selected range. Host controls acceptance, retries and submission. No ref/name/form/custom length/automatic submission API is claimed.

## Source adaptations

- Source CodeField's ui-code/ui-code-cell/ui-code-cursor names collide with the already shipped composable InputOTP classes. Port uses isolated ui-code-field-root/control/cells/cell/input/cursor and its own blink name. Existing InputOTP source/CSS were not changed; fixture checks both together.
- Optional disabled is native input disable plus the existing 0.55 disabled opacity. Disabled programmatic paste callbacks are guarded.
- Paste normalizes before truncation, fixing the source's formatted-code case: native maxlength would otherwise cut `12 34-56` before onChange stripped formatting. Actual browser clipboard paste now produces123456 and selection replacement preserves surrounding digits.
- PaneView spreads native attributes before hidden/inert, preventing accidental caller overrides of inactive state.
- Source type/color names map to existing Vic semantic equivalents: type-read-size -> text-read, color-text-subtle/strong -> fg-subtle/strong, color-control-fill -> field-fill, color-tone-danger-ink -> tone-danger-ink, font-label -> font-sans. Source radius-control/hue-ink remain unchanged. No new global token alias needed. Cell geometry, media breakpoint, focus-line wrapping and Grow timing remain source-derived.
- Only component-owned CSS was ported from ui-display.css/ui-focus.css. App FocusLayout, appearance assets, provider/session loaders and surrounding app styles are excluded.

## Verification

Initial complete browser suite:7 checks passed (four theme/stylesheet subtests plus pane/Grow behavior). Separate Node SSR check passed; final combined suite passes all8 checks with0 failures in /tmp/vic-canonical-focus-final-tests.log. Final dedicated fixture/example typecheck also passes (/tmp/vic-canonical-focus-final-types.log). Dedicated fixture/example typecheck, global design checks, global dash check and owned-path whitespace check passed. Logs /tmp/vic-canonical-focus-{types,design,dashes,ssr}.log.

Browser tests use source modules plus dedicated CSS over both previously built native/composable stylesheet entries. They cover actual typing, selection edits, browser clipboard paste, non-digit filtering, controlled refusal, disabled behavior, label/error association, existing InputOTP behavior, 320px overflow, native POST-slot handler, mounted pane identity/retained scroll/hidden focus exclusion, measured height updates, observer disconnect and reduced motion. Node server rendering verifies unique input IDs and hidden/inert/disabled markup without browser globals. This is not the final packed package check; parent must integrate root exports and stylesheet imports then run strict packed Bundler/NodeNext and full regressions.

Rendered screenshots captured to /tmp/vic-canonical-focus-evidence/{native,ui}-{light,dark}-{900,320}.png. Inspected native-light-900 and ui-dark-320 for layout, cells, wrapping and overflow. Source fixture servers/browsers close in finally blocks. No manual server remains. Chromium only; physical device autofill/touch, Firefox/WebKit and assistive-technology sessions were not exercised.

Parent next: add7 root runtime exports (PaneViews, PaneView, Grow, FocusLine, FocusQuiet, FocusFoot, CodeField); import the dedicated CSS once; migrate example imports to public root API when exported; add catalogue/docs routes and tests/package assertions. Preserve existing SlidingViews and InputOTP. Move/copy provenance into the parent-owned central record as appropriate. Do not count this as full FocusLayout/Providers/FormSteps transfer.
