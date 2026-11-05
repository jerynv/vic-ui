# Canonical WrappingRow transfer

Active in `/Users/jeryn/.t3/worktrees/vic-ui/t3-c2cc92d0`, `feat/canonical-controls-sync`, baseline a7aff171. Shared checkout: ownership is only WrappingRow, its dedicated CSS/asset, tests/wrapping-row*, examples/wrapping-row and this note. Parent owns exports, CSS imports, build/package/catalogue and all other edits. No commits or app changes.

Source pack `/tmp/vic-ui-wrapping-source-d44c231f`, source d44c231f4638029697c436fda6e1ed4ff6957b93; all supplied source/reference blobs also match extraction826ecbd00bb10e8546187b4dfe6506531369f5b6. Read README.txt and evidence/HANDOFF.source.txt; this transfer does not invent an upstream MIT/asset license grant.

Acceptance:
- Complete: exact polymorphic source API, props/ref/children and both classes; no default role/tabIndex/type or router dependency.
- Complete: minimal source style and token mapping, unlayered vertical-padding/reduced-motion precedence.
- Complete: real browser div/li/button/a/injected Link behavior, native props/ref/focus, independent actions, disabled and loading semantics.
- Complete: portable shape coverage of 17 source sites; source-style comparison; native/composable styles in both themes at desktop/mobile widths.
- Parent gates: historical142 exports; strict packed Bundler/NodeNext; actual CSS/asset package path; global catalogue and documentation integration.

Decision: parent approved preserving only existing `.console-frame … .hit-row` panel, hairline, horizontal inset, anchor-chevron and passive-hover rules. This is an existing consumer wrapper opt-in, not a new prop/context API. Unrelated `.page-in a` typography excludes hit-row and is omitted. Exact source SVG lives in `src/styles/assets/wrapping-row-chevron-right.svg`; native CSS build currently only relocates fonts, so parent must copy/relocate or inline this asset for both public stylesheets. Component source is byte-identical; CSS maps canonical tokens to existing Vic tokens without changing values.

Initial next action was fixture/source comparison; completed below. No active server remains.

Completed result:
- `src/components/WrappingRow.tsx` is byte-identical to source (`bc3f8cd349047e3f48dfdccdbb09de49787cb68b14c46a0e875dccd63c908f8b`). Exact SVG bytes are also checked. Full source Git/SHA mapping, style/token mapping and the17 source sites are in `tests/wrapping-row.provenance.json`.
- Dedicated stylesheet carries the two source base/hover blocks, five scoped console rules and two unlayered rules. Tokens are renamed to equal Vic values. Parent integrated root export/CSS import during testing and is handling dist asset relocation/copy.
- Two examples show independent actions and the existing `.console-frame` context. They import owned modules directly until the parent's docs integration switches them to public imports.

Actual API:
```tsx
export type WrappingRowProps<T extends ElementType = "div"> =
  { as?: T } & Omit<ComponentPropsWithRef<T>, "as">;
export function WrappingRow<T extends ElementType = "div">(
  { as, className, ...rest }: WrappingRowProps<T>
)
```
The default element is `div`; `as="li"`, `as="button"`, `as="a"` or an injected host Link remains the row itself. Children, attributes, handlers and React19 refs pass directly through. Both `ui-wrapping-row hit-row` always precede a supplied nonempty className. No router, role, tabIndex, button type, wrapper, words slot, layout state, permission logic or action is injected. Host classes/styles own wrapping, sizing and alignment; independent actions belong in a passive row, not inside a full-row anchor/button. Disabled/busy semantics are native caller-supplied attributes. React18 ref compatibility is not claimed.

Style contract:
- 13px type,14px gap,10px vertical/14px horizontal padding,8px radius by default using the source tokens. Source base hover/focus uses field fill and filled secondary ink, including passive rows outside the console context.
- Within an existing `.console-frame`, lists discovered through `>li>.hit-row` or `>li.hit-row` get the raised surface/edge,20px radius and subsequent-item hairlines. Rows use16px horizontal inset and zero internal radius; full-row anchors get the exact source chevron; passive hover loses its background. The component never creates the context wrapper.
- Vertical padding and reduced motion remain unlayered, above layered utilities. Horizontal padding/alignment/wrapping remain overrideable. Inline caller styles retain normal CSS precedence.
- Global Vic focus already matches source2px ring/3px offset; no extra local outline rule was introduced. The composable sheet has its existing `0.01ms !important` reduced-motion rule; computed duration there is0.00001s versus0s on native, equal for port and source reference.

Observed verification:
- `WRAPPING_ROW_SCREENSHOTS=/tmp/vic-wrapping-row-evidence node --test tests/wrapping-row.test.mjs`:7 passes,0 failures, final log `/tmp/vic-wrapping-row-tests.log`.
- `WrappingRow retains the exact supplied polymorphic implementation and SVG`: hashes and17 source sites/nine source modules.
- `WrappingRow keeps native props, refs, keyboard behavior and independent actions`: div/li/button/a/custom Link refs and null-on-unmount, native attributes, absent implicit role/tabIndex/type, native default form submit, button Enter/Space, anchor Enter, Tab order/focus outline, disabled skip/no activation, separate Download/Cancel, passive text click, supplied busy semantics, empty children and no browser errors.
- `WrappingRow matches the supplied cascade and portable console shapes`: four native/ui × light/dark subtests.12 comparisons at1200/390/320px match154 actual elements each: geometry, text/color/background/radius/border/shadow/layout/transition and chevron pseudo-element. All17 source sites have portable synthetic shape fixtures. Parent-integrated row rules are explicitly removed from the reference page's base CSS before applying the exact selected source declarations, keeping comparison independent. `/tmp/vic-wrapping-row-evidence/source-comparison.json` records the comparisons and removed-rule counts.
- Layered vertical-padding utility loses as intended; horizontal utility/unlayered override wins; nowrap remains default and explicit responsive wrapping works; no viewport overflow; hover/subtle-ink and passive suppression match source; reduced-motion and normal200ms transition verified.
- `npx tsc --noEmit -p tests/wrapping-row.tsconfig.json`:pass with strict/skipLibCheck:false, including examples and injected Link ref/props.
- `npm run check:design`, `npm run check:dashes`, scoped `git diff --check`:pass. One Impeccable detector pass returned`[]`, `/tmp/vic-wrapping-row-design.json`.
- Eight real-browser screenshots under `/tmp/vic-wrapping-row-evidence` (native/ui, light/dark, desktop/mobile). Inspected `native-light-desktop.png` and `ui-dark-mobile.png`; panel inset, hairlines, chevron, long words and independent-action wrapping are visible. No pixel-parity claim; computed parity uses a shared Vic font/base and selected original source styles.

Test corrections: initial expectations assumed a file URL instead of Vite's exact-SVG data URL,0s instead of the existing composable reduced-motion override, and the fixture's unlayered flex shorthand blocked its own responsive utility. The fixture was corrected and style reads await resize/theme/hover settlement. No production source change was needed after first copy.

Remaining scope/limits: no application routes, loaders, permissions, mutations, account data or all-screen V-Client behavior exercised. Synthetic pattern fixtures demonstrate portable shapes, not complete application restoration. No physical device, Firefox/WebKit or assistive-technology session. Parent owns actual tarball/asset/root-export/strict packed Bundler+NodeNext checks and catalogue/docs/release. Source transfer does not establish new license terms. Tests close their own browsers/server in finally; no owned live processes remain. No commit or app edit made.

Next parent action: finish packaging both stylesheet paths with the exact SVG, retain all142 historical exports and add WrappingRow/props, integrate public examples/docs, then run packed gates. Worker files are released for integration.
