import { Fragment, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Link } from "./Link";
import { toOptions, type Items, type Option } from "./items";
import { useReason } from "./Tooltip";

/** One tab: an option, with a count drawn after its words where one is given. */
export type TabOption = Option & {
  count?: number | string | undefined;
  /** Why it cannot be chosen: the tab stays focusable and says so, rather than going inert. */
  disabledReason?: string | undefined;
  /** A tab that is a page of this app: drawn as a link to it, so choosing it goes there. */
  to?: string | undefined;
  /** A hairline before this tab, setting it and those after it apart as another group of the same row. */
  apart?: boolean | undefined;
};

/**
 * The one switcher between views or lenses: a row of tabs on the field's fill with an ink
 * indicator under the chosen one, which eases from tab to tab rather than jumping. The
 * chosen tab is told by the indicator and the colour of its words, never their weight, so
 * nothing in the row moves when the choice changes. A count after the words is set in
 * tabular numerals in a box two digits wide, so a count going from 9 to 12 moves nothing.
 *
 * Worked as tabs are: the arrows move along the row and choose as they go, Home and End go
 * to the ends, and only the chosen tab is in the page's tab order. `items` is any shape
 * `toOptions` reads, and options may carry a `count`, and `apart` to start a group of their
 * own after a hairline, as a calendar's glances at the dates stand apart from its lists.
 */
export function Tabs(props: {
  items: Items | ReadonlyArray<TabOption>;
  value: string;
  onValueChange?: (value: string) => void;
  "aria-label"?: string;
  /** Each tab controls the panel with the id `${idPrefix}-${value}-panel`, and is `${idPrefix}-${value}`. */
  idPrefix?: string;
  size?: "sm";
  className?: string;
}) {
  const made = useId();
  const prefix = props.idPrefix ?? made;
  const tabs = toOptions(props.items as Items) as TabOption[];
  const chosen = tabs.findIndex((one) => one.value === props.value);
  const track = useRef<HTMLDivElement>(null);
  const buttons = useRef<Array<HTMLElement | null>>([]);
  const [mark, setMark] = useState<{ x: number; w: number } | null>(null);
  const [eased, setEased] = useState(false);

  // The indicator is measured onto the chosen tab, and again whenever a tab's width changes.
  useLayoutEffect(() => {
    const row = track.current;
    if (!row) return;
    const measure = () => {
      const tab = buttons.current[chosen];
      setMark(tab ? { x: tab.offsetLeft, w: tab.offsetWidth } : null);
    };
    measure();
    const watch = new ResizeObserver(measure);
    watch.observe(row);
    for (const tab of buttons.current) if (tab) watch.observe(tab);
    return () => watch.disconnect();
  }, [chosen, tabs.length]);

  // The first placing is drawn where it lands; every move after it eases.
  useLayoutEffect(() => {
    if (mark && !eased) requestAnimationFrame(() => setEased(true));
  }, [mark, eased]);

  const choose = (at: number, byKey = false) => {
    const tab = tabs[at];
    if (!tab || (tab.disabled && !tab.disabledReason)) return;
    buttons.current[at]?.focus();
    if (tab.disabledReason) return;
    // A link chosen from the keyboard is followed, as pressing it would.
    if (byKey && tab.to) return buttons.current[at]?.click();
    if (tab.value !== props.value) props.onValueChange?.(tab.value);
  };

  const step = (from: number, by: number) => {
    for (let i = 1; i <= tabs.length; i++) {
      const at = (from + by * i + tabs.length * i) % tabs.length;
      if (!tabs[at]!.disabled || tabs[at]!.disabledReason) return at;
    }
    return from;
  };

  const keyed = (event: KeyboardEvent<HTMLElement>, at: number) => {
    const moves: Record<string, () => number> = {
      ArrowRight: () => step(at, 1),
      ArrowLeft: () => step(at, -1),
      Home: () => step(-1, 1),
      End: () => step(tabs.length, -1),
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    choose(move(), true);
  };

  const classes = ["ui-tabs", props.size === "sm" ? "ui-tabs-sm" : "", props.className ?? ""].filter(Boolean).join(" ");
  return (
    <div ref={track} role="tablist" aria-label={props["aria-label"]} className={classes}>
      <span
        className="ui-tabs-mark"
        aria-hidden="true"
        data-eased={eased ? "" : undefined}
        style={mark ? { translate: `${mark.x}px 0`, width: `${mark.w}px` } : { opacity: 0 }}
      />
      {tabs.map((tab, at) => (
        <Fragment key={tab.value}>
          {tab.apart && at > 0 ? <span className="ui-tabs-rule" aria-hidden="true" /> : null}
          <Tab
            tab={tab}
            place={(node) => {
              buttons.current[at] = node;
            }}
            id={`${prefix}-${tab.value}`}
            chosen={at === chosen}
            controls={props.idPrefix ? `${prefix}-${tab.value}-panel` : undefined}
            inOrder={at === chosen || (chosen < 0 && at === 0)}
            onPress={() => choose(at)}
            onKey={(event) => keyed(event, at)}
          />
        </Fragment>
      ))}
    </div>
  );
}

/** One tab of the row; one held for a reason says it in the tooltip and still moves along the row. */
function Tab(props: { tab: TabOption; place: (node: HTMLElement | null) => void; id: string; chosen: boolean; controls: string | undefined; inOrder: boolean; onPress: () => void; onKey: (event: KeyboardEvent<HTMLElement>) => void }) {
  const { tab } = props;
  const why = useReason(tab.disabledReason);
  const { ref: anchor, onKeyDown: whyKey, ...held } = why.props as { ref?: (el: HTMLElement | null) => void; onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void };
  const shared = {
    ref: (node: HTMLElement | null) => {
      props.place(node);
      anchor?.(node);
    },
    id: props.id,
    role: "tab",
    className: "ui-tab",
    "aria-selected": props.chosen,
    "aria-controls": props.controls,
    tabIndex: props.inOrder ? 0 : -1,
    onClick: props.onPress,
    ...held,
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      whyKey?.(event);
      props.onKey(event);
    },
  };
  const words = (
    <>
      <span>{tab.label}</span>
      {tab.count !== undefined ? <Count value={tab.count} /> : null}
    </>
  );
  return (
    <>
      {tab.to && !tab.disabled ? (
        <Link to={tab.to} {...shared}>
          {words}
        </Link>
      ) : (
        <button type="button" disabled={tab.disabled && !tab.disabledReason} {...shared}>
          {words}
        </button>
      )}
      {why.node}
    </>
  );
}

function Count(props: { value: number | string }): ReactNode {
  return <span className="ui-tab-count">{props.value}</span>;
}
