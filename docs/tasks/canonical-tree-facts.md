# Canonical Facts and Tree port

Completed bounded worker implementation in the shared parent-owned worktree `/Users/jeryn/.t3/worktrees/vic-ui/t3-c2cc92d0`, branch `feat/canonical-controls-sync`, starting at `a7aff171`. No commit, root-export edit, shared stylesheet edit, package/lock edit, app edit or new dependency. Other workers' edits remain untouched.

Source is owner-authorized V-Client pin `555625f40a51741b1b7050f579afbdb2b54fccb6`. Immutable source bytes were read from `/tmp/vic-ui-canonical-source-555625f4`; `tests/canonical-tree-facts.provenance.json` records exact source Git blobs, SHA256s and target mappings. This is not an assertion of a V-Client MIT grant.

## Implemented API

- `Facts({ items, "aria-label"?, className? })`, where `items: ReadonlyArray<Fact>` and `Fact` is `{ label: ReactNode; value: ReactNode; mark?: ReactNode }`. Semantic description list with decorative optional marks. Caller omits absent facts. No app data or loader behavior.
- `Tree({ items, value, onValueChange, "aria-label", className? })`, with required `items: readonly TreeItem[]`, selected `value: string | null`, `(id: string) => void` callback, accessible label. Host controls selection. Expansion and roving focus stay internal, as canonical source specifies.
- `TreeItem`: unique non-empty `id: string`, `label: ReactNode`, optional `text: string` for type-ahead when label is not a string, `icon`, quiet `end`, and `children: TreeItem[]`.
- `treePathTo(items, id)` returns ancestor IDs in outer-to-inner order, excluding the item. Missing/null IDs return `[]`.

Canonical Tree has no disabled-item prop. No invented disabled API was added; controlled refusal is exercised. Labels and trailing content should remain row content rather than nested interactive controls. No virtualization, deep untrusted hierarchy budget, physical touch or assistive-technology claim is made.

`Facts.tsx` and `treePath.ts` are byte-identical copies of their pinned source. Tree's icon import uses the existing Vic SVG catalogue. Its ancestor key uses JSON instead of `join("|")`/`split("|")`: canonical source breaks when an ID itself contains `|`; the regression selects `opaque|child` and verifies its actual ancestor opens. Other selection/keyboard behavior and 32px visual geometry are preserved.

The dedicated `ui-canonical-tree-facts.css` carries only the canonical Tree and Facts rules. Token names map to existing `--fg*`, `--field-fill*`, `--text-*`, `--focus` and radius tokens. Parent reserved the shared `--fg-subtle-on-fill` alias with canonical values; the rule falls back to `--fg` until that alias is integrated. No new visual system or global style reset.

## Verification

- `node_modules/.bin/tsc --noEmit -p tests/canonical-tree-facts.tsconfig.json`: pass, including examples and fixture under strict/exact optional props.
- `CANONICAL_TREE_FACTS_SCREENSHOTS=/tmp/vic-canonical-tree-facts-evidence node --test tests/canonical-tree-facts.test.mjs`: six tests pass, zero failures. Log `/tmp/vic-canonical-tree-facts-tests.log`.
- Real Chromium checks cover arrows/Home/End, type-ahead, Enter/Space selection, chevron expansion without selection, selected ancestor reveal, opaque IDs, controlled refusal, dynamic removal/replacement, empty states, single Tab stop, semantic Facts markup, decorative marks, 32px rows, label ellipsis, reduced motion and overflow at 1200/390/320px. Both native/composable stylesheet entries and light/dark themes pass.
- Eight desktop/mobile PNGs captured in `/tmp/vic-canonical-tree-facts-evidence`. Inspected native light desktop and composable dark mobile images; canonical geometry and readable wrapping confirmed. No pixel-perfect original app screenshot comparison was available.
- `npm run check:design`, `npm run check:dashes`, `git diff --check`: pass at handoff.
- Impeccable detector on owned component/style files: `[]`, saved `/tmp/vic-canonical-tree-facts-design.json`.

First fixture pass incorrectly required every fact to occupy one desktop row; canonical flex wrapping correctly put the long description below. Updated the assertion to require more wrapping in narrower columns. No component change was needed for that failure.

Test browsers and fixture servers close in finally blocks. No manually started server remains. Browser coverage is installed Chromium; Firefox/WebKit, physical touch, screen-reader sessions, packed declarations and final integrated root imports remain parent validation.

## Parent integration

1. Export `Facts` and type `Fact` from its module; `Tree`, `treePathTo`, type `TreeItem` from Tree. The helper is already re-exported by Tree.
2. Import `ui-canonical-tree-facts.css` once through `src/components.css`; supply shared `--fg-subtle-on-fill` as reserved.
3. Wire examples from `site/src/examples/facts/1-summary.tsx` and `tree/1-places.tsx` to root imports after exports exist, then register/document the families. Worker examples currently use direct owned source imports to avoid shared export mutations.
4. Add the focused test to CI, extend the packed consumer/export checks while retaining baseline142, and verify the actual packed artifact and integrated styles. The fixture currently imports source modules with the existing built stylesheet entries plus the new dedicated sheet.

Owned paths: `src/components/{Facts,Tree,treePath}.tsx|ts`, dedicated CSS, `tests/canonical-tree-facts*`, the two example directories and this task note. No other paths changed by this worker.
