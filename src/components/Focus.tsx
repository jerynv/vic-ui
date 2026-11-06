import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { Grow } from "./Grow";
import { Link } from "./Link";
import { ArrowLeftIcon } from "../icons/icons";
import { hueFor } from "./hue";
import { useLogo } from "./OrgMark";

export interface FocusStep { words: string; at: "done" | "now" | "next" }
export interface FocusBack { to: string; label: string; onClick?: (() => void) | undefined }
export interface FocusPlace { name: string; slug: string; logo?: string | null | undefined }
export interface FocusPulse { n: number; amount: number }
export interface FocusLayoutProps {
  children: ReactNode;
  title: ReactNode;
  actions?: ReactNode;
  back?: FocusBack | undefined;
  org?: FocusPlace | undefined;
  steps?: readonly FocusStep[] | undefined;
  width?: "list" | undefined;
  tone?: "danger" | undefined;
  looksOnPhone?: boolean | undefined;
  /** Host-owned brand content, replacing the application-specific wordmark. */
  brand?: ReactNode;
  /** Host owns theme state and persistence; each placement can provide its own IDs. */
  renderAppearance?: ((placement: "side" | "phone") => ReactNode) | undefined;
  /** Optional art renderer; the library does not bundle the application's shader. */
  renderArt?: ((state: { pulse: FocusPulse }) => ReactNode) | undefined;
  /** What this page is called in a tab, in history and in a bookmark: the document's title while it is drawn, the one before restored after. */
  tab?: string | undefined;
  /** Opt in to carrying a measured height across remounts using a host-owned key. */
  remember?: string | undefined;
  className?: string | undefined;
}

/** Source-derived two-pane focus layout. Navigation, appearance, branding and content remain host-owned. */
export function FocusLayout(props: FocusLayoutProps) {
  useTab(props.tab);
  const plain = props.org || props.tone ? undefined : "sky";
  const [pulse, setPulse] = useState<FocusPulse>({ n: 0, amount: 0 });
  const stir = (amount: number) => setPulse(last => ({ n: last.n + 1, amount }));
  const mark = props.org ? <><FocusMark name={props.org.name} slug={props.org.slug} logo={props.org.logo} /><span className="ui-focus-phone-name">{props.org.name}</span></> : props.brand;
  return <div className={["ui-focus", props.className].filter(Boolean).join(" ")} data-hue={props.org ? hueFor(props.org.slug) : undefined}>
    <aside className="ui-focus-side" data-place={props.org ? "org" : "product"} data-hue={plain} data-tone={props.tone}>
      <div className="ui-focus-art" aria-hidden="true">{props.renderArt?.({ pulse })}</div>
      <div className="ui-focus-top">{props.org ? <><FocusMark name={props.org.name} slug={props.org.slug} logo={props.org.logo} /><p className="ui-focus-name">{props.org.name}</p></> : props.brand}</div>
      {props.steps && props.steps.length > 1 && <ol className="ui-focus-steps" aria-label="Steps">
        {props.steps.map(step => <li key={step.words} data-at={step.at} aria-current={step.at === "now" ? "step" : undefined}>{step.words}</li>)}
      </ol>}
      {props.renderAppearance && <div className="ui-focus-foot">{props.renderAppearance("side")}</div>}
    </aside>
    <main className="ui-focus-main" onInput={() => stir(0.7)} onPointerDown={event => { if ((event.target as Element).closest("button, a")) stir(2); }} onSubmit={() => stir(3)}>
      <div className="ui-focus-phone-head" data-hue={plain} data-tone={props.tone}>{mark}</div>
      <Grow {...(props.remember ? { remember: props.remember } : {})} className="ui-focus-grow" innerClassName="ui-focus-grow-inner">
        <div className="ui-focus-form" data-width={props.width}>
          <FocusHead title={props.title} back={props.back} actions={props.actions} />
          {props.children}
          {props.looksOnPhone && props.renderAppearance && <div className="ui-focus-phone-foot">{props.renderAppearance("phone")}</div>}
        </div>
      </Grow>
    </main>
  </div>;
}

export function FocusHead(props: { title: ReactNode; back?: FocusBack | undefined; actions?: ReactNode }) {
  return <header className="ui-focus-head" data-actions={props.actions ? "" : undefined}>
    {props.back ? <Link to={props.back.to} className="ui-focus-back" onClick={props.back.onClick}><ArrowLeftIcon size={16} aria-hidden="true" />{props.back.label}</Link>
      : <span className="ui-focus-back" data-none="" aria-hidden="true"><ArrowLeftIcon size={16} aria-hidden="true" />{"\u00a0"}</span>}
    <h1 className="ui-focus-title">{props.title}</h1>
    {props.actions ? <div className="ui-focus-actions">{props.actions}</div> : null}
  </header>;
}

export function FocusMark(props: { name: string; slug?: string; logo?: string | null | undefined }) {
  const logo = useLogo(props.logo);
  return <span className="ui-focus-mark" data-hue={props.slug ? hueFor(props.slug) : undefined} data-logo={logo.shown ? "" : undefined} aria-hidden="true">
    {props.name.trim().charAt(0).toUpperCase()}{logo.image}
  </span>;
}

/**
 * The document's title while a screen is drawn, and the one before it once it is gone, unless
 * something has named the document since: a newer title is left as it is.
 */
function useTab(tab: string | undefined): void {
  useEffect(() => {
    if (!tab) return;
    const was = document.title;
    document.title = tab;
    return () => {
      if (document.title === tab) document.title = was;
    };
  }, [tab]);
}

/** What a page held in a `FocusFrame` tells the layout above it: its title, its tab, its steps and its way back. */
export interface FocusFrameWords {
  title: string;
  tab?: string | undefined;
  steps?: readonly FocusStep[] | undefined;
  back?: FocusBack | undefined;
}

const FrameSetter = createContext<Dispatch<SetStateAction<FocusFrameWords | null>> | null>(null);

function sameWords(a: FocusFrameWords, b: FocusFrameWords): boolean {
  const steps = (words: FocusFrameWords) => JSON.stringify(words.steps?.map((step) => [step.at, step.words]) ?? []);
  return a.title === b.title && a.tab === b.tab && steps(a) === steps(b) && a.back?.to === b.back?.to && a.back?.label === b.back?.label && !a.back?.onClick === !b.back?.onClick;
}

/**
 * One `FocusLayout` above a page whose code or read is still on its way, so the side and the
 * form's column are mounted once and only what is inside them changes. It draws the words it is
 * given until the page below names its own with `useFocusFrame`. Everything else a layout takes
 * (`brand`, `org`, `renderArt`, `renderAppearance` and the rest) is the frame's to pass on.
 */
export function FocusFrame({ title, tab, steps, back, children, ...layout }: FocusFrameWords & Omit<FocusLayoutProps, "title" | "tab" | "steps" | "back">) {
  const [named, setNamed] = useState<FocusFrameWords | null>(null);
  const words = named ?? { title, tab, steps, back };
  return (
    <FrameSetter.Provider value={setNamed}>
      <FocusLayout {...layout} title={words.title} tab={words.tab} steps={words.steps} back={words.back}>
        {children}
      </FocusLayout>
    </FrameSetter.Provider>
  );
}

/**
 * Names the `FocusFrame` this page is drawn in, before the frame paints; true when there is one,
 * and false when the page has to draw its own `FocusLayout`. The way back's press is always the
 * one the page last drew; once the page is gone the frame draws its own words again.
 */
export function useFocusFrame(words: FocusFrameWords): boolean {
  const setNamed = useContext(FrameSetter);
  const press = useRef<(() => void) | undefined>(undefined);
  useLayoutEffect(() => {
    press.current = words.back?.onClick;
    if (!setNamed) return;
    const back = words.back ? { to: words.back.to, label: words.back.label, ...(words.back.onClick ? { onClick: () => press.current?.() } : {}) } : undefined;
    const next: FocusFrameWords = { ...words, back };
    setNamed((last) => (last && sameWords(last, next) ? last : next));
  });
  // Gone, the page hands the frame back its own words, so a page still loading after it never
  // shows the last one's title, steps or way back. A page drawn in its place names it again in
  // the same commit, after this.
  useLayoutEffect(() => () => setNamed?.(null), [setNamed]);
  return setNamed !== null;
}
