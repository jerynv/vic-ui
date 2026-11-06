import * as React from "react";
import { useEffect, type RefObject } from "react";

// Declared here rather than through Node's types, which the published declarations leave out.
declare const process: { env: Record<string, string | undefined> };

/**
 * True in a development build. The package is built in Vite's library mode, which leaves
 * `process.env.NODE_ENV` as written, so the app's bundler decides: Vite, webpack, Rollup and
 * esbuild each write "production" in its place for a production build, and the checks that
 * read this fall away there. Where nothing replaces it and there is no `process` (a page
 * loading the package as a bare module), reading it throws and the checks stay quiet.
 */
export function isDev(): boolean {
  try {
    return process.env.NODE_ENV !== "production";
  } catch {
    return false;
  }
}

/** The key on `globalThis` where the first copy of vic-ui records the React it imported. */
export const REACT_KEY = Symbol.for("vic-ui.react");

const TWO_REACTS =
  "vic-ui: two copies of React are loaded. vic-ui imports React as a peer and must share the app's copy, or hooks fail with \"Cannot read properties of null (reading 'useId')\". Install one copy (npm ls react), and in Vite add resolve: { dedupe: [\"react\", \"react-dom\"] }.";

/**
 * Records the React this copy of vic-ui imported, so a second copy of vic-ui that brings a
 * different React says so at once rather than leaving a blank page. React is told apart by
 * its `Component` class, which every importer of one copy shares however its bundler wraps
 * the module. The same copy loaded twice (a second entry, a hot reload) is not a fault.
 */
export function recordReact(): void {
  const scope = globalThis as unknown as Record<symbol, { version: string; component: unknown } | undefined>;
  const first = scope[REACT_KEY];
  if (!first) {
    scope[REACT_KEY] = { version: React.version, component: React.Component };
    return;
  }
  if (first.component !== React.Component) console.error(`${TWO_REACTS} The first is React ${first.version}, this one React ${React.version}.`);
}

recordReact();

const internals = (React as unknown as Record<string, { H?: unknown } | undefined>).__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;

/**
 * Called at the top of a piece's render. React sets the hooks of the copy that is rendering;
 * when the app renders with another copy than the one vic-ui imported, vic-ui's copy has none,
 * and the piece's first hook would fail on a null. This throws the reason instead.
 */
export function assertOneReact(): void {
  if (internals && "H" in internals && internals.H == null) throw new Error(TWO_REACTS);
}

const inks = new Map<Element, Set<HTMLElement>>();
const told = new WeakSet<Element>();
const wordsOf = (button: HTMLElement) => (button.textContent ?? "").trim() || button.getAttribute("aria-label") || "an unnamed button";

/**
 * A page has one ink button, for its committing action. In a development build this warns,
 * once for each `main` landmark, when a second ink button mounts inside the same one, naming
 * both by their words. Buttons in a dialog or a popover are their own surface and are not
 * counted. `allow` (Button's `allowSecond`) leaves a button out of the count.
 */
export function useOneInk(ref: RefObject<HTMLElement | null>, ink: boolean, allow: boolean | undefined): void {
  useEffect(() => {
    if (!ink || allow || !isDev()) return;
    const button = ref.current;
    if (!button || button.closest("dialog, [role='dialog'], [role='alertdialog'], [popover]")) return;
    const main = button.closest("main, [role='main']");
    if (!main) return;
    let mounted = inks.get(main);
    if (!mounted) inks.set(main, (mounted = new Set()));
    mounted.add(button);
    if (mounted.size > 1 && !told.has(main)) {
      told.add(main);
      const [first, second] = [...mounted] as [HTMLElement, HTMLElement];
      console.warn(`vic-ui: two ink buttons in one main landmark, "${wordsOf(first)}" and "${wordsOf(second)}". A page has one ink button, for its committing action; draw the other as line or quiet, or pass allowSecond to the one that must stay ink.`);
    }
    return () => {
      mounted.delete(button);
      if (mounted.size === 0) inks.delete(main);
    };
  }, [ref, ink, allow]);
}
