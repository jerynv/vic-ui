# Separate controls/layout increment

Workspace: `/Users/jeryn/.t3/worktrees/vic-ui/t3-dff18547`.
Original clean prepared branch `add-slider-settings-layout` was at f156af1, diverged from requested baseline. Preserved it; created `feat/slider-settings-controls` at 6deb7fc. Fetched origin once. No other checkout touched.

Ownership: new Slider/Settings components, dedicated styles, source-import browser fixtures/tests and dedicated docs/examples; existing Sidebar docs only for persistence contract. No shared index, components.css, package/lock, registry, MAP, dist, Sidebar/Radio runtime edits. Parent integrates/packages/releases after preview increment. No publication, PR, merge, app mutation or delegation.

Acceptance checks:
- Slider scalar controlled/uncontrolled state; keyboard arrows/Home/End/Page; pointer drag/stepped press, RTL, bounds, fractional steps, disabled; accessible names/descriptions/value text; custom track hides fill. Complete: source-only Chromium assertions pass in light and dark, including negative/fractional steps, inherited RTL, visible labels/descriptions and native form values.
- Settings section/group/row/layout slots, flat/bordered choice, narrow container wrapping and host actions/focus. Complete: assertions cover 1280px desktop, 390px/320px mobile and a 380px embedded panel; six light/dark full-page screenshots inspected.
- Sidebar sibling observer mounts/subscribes once through desktop collapse, mobile open/close and breakpoints, closed mobile presentation absent from focus/accessibility, modal focus trap/return. Complete: browser regression passes with mounts=1, active subscriptions=1 and unmounts=0 throughout; runtime unchanged.
- Complete verification: library typecheck, dedicated fixture/example typecheck, design checks, dash check and diff whitespace check pass. Changes are ready for the owned additive commit and parent handoff.

Decisions: retain incumbent Vic tokens; 4px track, 14px visible thumb inside 24px transparent target. Installed Base UI 1.6 supplies keyboard/drag behavior. Consumer reference read only; stepped press advances one step for <=25 intervals, otherwise nearest step to 1/20 range; no app tokens or data logic copied. Settings is presentation with host-supplied navigation/content/actions.

Resources: own npm ci --ignore-scripts completed without lock changes. Preview tab tab_21_4ab4099e-78d5-4500-b37e-01277a2ffa19 closed after inspection. Interactive fixture PID 86102 (port 4399) was stopped with SIGTERM at handoff. Automated test servers/browsers close in finally blocks.

## Evidence and findings

- `CONTROLS_SCREENSHOTS=/tmp/vic-controls-layout-evidence node --test tests/controls-layout.test.mjs`: 5 tests pass (three top-level cases plus two theme subtests).
- `npm run typecheck`: passes.
- `node_modules/.bin/tsc --noEmit -p tests/controls-layout.tsconfig.json`: passes.
- `npm run check:design`, `npm run check:dashes`, `git diff --check`: pass.
- Impeccable detector over the four owned component/style files returned `[]`, saved at `/tmp/vic-controls-layout-evidence/design-detect.json`.
- PNGs inspected at `/tmp/vic-controls-layout-evidence/{light,dark}-{desktop,mobile,panel}.png`. Source fixture preview screenshot also at `/Users/jeryn/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw3c5cvi-0aa23d39.png`.
- First browser run exposed two test assumptions: a native right-click can move focus, and Base UI trap focus settles asynchronously. Assertions now verify focus after the supported primary press and await modal focus containment, respectively. No Sidebar runtime change.
- Negative-decimal extension exposed a real arithmetic edge: 1.5-step track increment divided to one ULP below 1.5. Slider now compensates that division error before rounding; the regression expects the mathematically nearest two steps.
- Requested no-subagents constraint honored. Visual/system inspection completed inline; the incumbent MAP and token system remain unchanged. Palette: existing light/dark neutrals. Type: existing UI/read/lead scales. Corners: radius tokens. Elevation: border only. State: no size/weight changes.

No dist built or changed. No package export, shared stylesheet, registry, MAP, package/lock, Sidebar runtime, Radio runtime or app checkout edits. Browser scope is installed Chromium; native touch, assistive-technology sessions, Firefox/WebKit, SSR hydration and final packed/release integration were not run.

Next for parent after preview release: cherry-pick owned commit, then follow `docs/components/slider-settings.md` integration steps (five new runtime exports, props types, two stylesheet imports, catalogue registration and package/website/release gates).
