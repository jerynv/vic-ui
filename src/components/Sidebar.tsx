import { createContext, forwardRef, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type CSSProperties, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { Link } from "./Link";
import { useTip } from "./Tooltip";

/**
 * A rail of places beside a page: open at `--sidebar-width`, folded to its marks at
 * `--sidebar-width-icon` (`collapsible="icon"`), or gone (`"offcanvas"`), and below
 * `mobileBreakpoint` a sheet over the page instead. Whether it is open is `open` and
 * `onOpenChange`, and the sheet's is `openMobile` and `onOpenMobileChange`; either may be left
 * to the provider. Folding only narrows it: the width eases and the rail's own overflow clips
 * the words, which never wrap, so every mark stays where it was.
 *
 * The parts carry `data-sidebar` (`sidebar`, `header`, `content`, `viewport`, `footer`,
 * `group`, `group-label`, `menu`, `menu-item`, `menu-button`, `menu-badge`) and the wrapper
 * `data-sidebar-wrapper` with `data-state` (`expanded` or `collapsed`), so a page styles a
 * state from its root. `useSidebar()` reads and changes it from anywhere under the provider.
 */

export type SidebarCollapsible = "icon" | "offcanvas" | "none";

export interface SidebarState {
  /** `expanded` or `collapsed`: the rail, or on a phone the sheet. */
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  /** Folds or opens the rail, or on a phone opens or closes the sheet. */
  toggleSidebar: () => void;
  collapsible: SidebarCollapsible;
  contained: boolean;
}

const Context = createContext<SidebarState | null>(null);

/** The sidebar's state and the presses that change it, from anywhere under `SidebarProvider`. */
export function useSidebar(): SidebarState {
  const state = useContext(Context);
  if (!state) throw new Error("useSidebar is read under a SidebarProvider.");
  return state;
}

function useNarrow(breakpoint: number): boolean {
  const query = `(max-width: ${breakpoint - 1}px)`;
  return useSyncExternalStore(
    useCallback(
      (changed: () => void) => {
        const list = window.matchMedia(query);
        list.addEventListener("change", changed);
        return () => list.removeEventListener("change", changed);
      },
      [query],
    ),
    () => window.matchMedia(query).matches,
    () => false,
  );
}

function setRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) (ref as { current: T | null }).current = value;
}

function join(...names: Array<string | false | null | undefined>) {
  return names.filter(Boolean).join(" ");
}

/**
 * Holds the sidebar's state and draws the row it sits in with the page: a flex row filling its
 * container (`contained`) or the window's height.
 */
export function SidebarProvider(props: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  openMobile?: boolean;
  onOpenMobileChange?: (open: boolean) => void;
  collapsible?: SidebarCollapsible;
  /** Below this width in pixels the rail is a sheet over the page; 0 never. */
  mobileBreakpoint?: number;
  /** Within its container rather than the window: the sheet and its backdrop cover the container. */
  contained?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const { onOpenChange, onOpenMobileChange } = props;
  const isMobile = useNarrow(props.mobileBreakpoint ?? 768);
  const [ownOpen, setOwnOpen] = useState(props.defaultOpen ?? true);
  const [ownMobile, setOwnMobile] = useState(false);
  const open = props.open ?? ownOpen;
  const openMobile = props.openMobile ?? ownMobile;
  const setOpen = useCallback(
    (next: boolean) => {
      setOwnOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange],
  );
  const setOpenMobile = useCallback(
    (next: boolean) => {
      setOwnMobile(next);
      onOpenMobileChange?.(next);
    },
    [onOpenMobileChange],
  );
  const collapsible = props.collapsible ?? "icon";
  const contained = props.contained ?? false;
  const shown = isMobile ? openMobile : open || collapsible === "none";
  const value = useMemo<SidebarState>(
    () => ({
      state: shown ? "expanded" : "collapsed",
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      toggleSidebar: () => (isMobile ? setOpenMobile(!openMobile) : setOpen(!open)),
      collapsible,
      contained,
    }),
    [shown, open, setOpen, openMobile, setOpenMobile, isMobile, collapsible, contained],
  );
  return (
    <Context.Provider value={value}>
      <div
        data-sidebar-wrapper=""
        data-state={value.state}
        className={join("ui-sidebar-wrapper", !contained && "ui-sidebar-window", props.className)}
        style={props.style}
      >
        {props.children}
      </div>
    </Context.Provider>
  );
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * The rail itself: an `aside` beside the page, or on a phone a `nav` sheet over it with a
 * backdrop, opened on its first control, closed by Escape or a press on the backdrop, and given
 * back to whatever opened it. A closed sheet is `inert`.
 */
export const Sidebar = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function Sidebar({ className, children, ...rest }, ref) {
  const { state, isMobile, openMobile, setOpenMobile, collapsible } = useSidebar();
  const sheet = useRef<HTMLElement | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const giveBack = useRef(false);

  useEffect(() => {
    if (!isMobile || !openMobile) return;
    const keyed = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      giveBack.current = true;
      setOpenMobile(false);
    };
    document.addEventListener("keydown", keyed);
    return () => document.removeEventListener("keydown", keyed);
  }, [isMobile, openMobile, setOpenMobile]);

  useEffect(() => {
    if (!isMobile) return;
    if (openMobile) {
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      giveBack.current = false;
      requestAnimationFrame(() => (sheet.current?.querySelector<HTMLElement>(FOCUSABLE) ?? sheet.current)?.focus());
    } else if (giveBack.current) {
      opener.current?.focus();
      giveBack.current = false;
      opener.current = null;
    }
  }, [isMobile, openMobile]);

  if (isMobile) {
    return (
      <>
        <div
          data-sidebar-backdrop=""
          className="ui-sidebar-backdrop"
          data-open={openMobile ? "" : undefined}
          aria-hidden="true"
          onClick={() => {
            giveBack.current = true;
            setOpenMobile(false);
          }}
        />
        <nav
          ref={(el) => {
            sheet.current = el;
            setRef(ref, el);
          }}
          tabIndex={-1}
          aria-hidden={!openMobile}
          inert={!openMobile}
          data-sidebar="sidebar"
          data-mobile="true"
          data-state={state}
          data-collapsible={collapsible}
          className={join("ui-sidebar ui-sidebar-sheet", className)}
          {...rest}
        >
          {children}
        </nav>
      </>
    );
  }
  return (
    <aside ref={ref} data-sidebar="sidebar" data-state={state} data-collapsible={collapsible} className={join("ui-sidebar", className)} {...rest}>
      <div data-sidebar="content-container" className="ui-sidebar-inner">
        {children}
      </div>
    </aside>
  );
});

/** The top of the rail: a mark, a name, a search. */
export const SidebarHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function SidebarHeader({ className, ...rest }, ref) {
  return <div ref={ref} data-sidebar="header" className={join("ui-sidebar-header", className)} {...rest} />;
});

/** The pinned foot of the rail. */
export const SidebarFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function SidebarFooter({ className, ...rest }, ref) {
  return <div ref={ref} data-sidebar="footer" className={join("ui-sidebar-footer", className)} {...rest} />;
});

/**
 * The middle of the rail, which scrolls: its edges fade only where there is more to scroll to,
 * and a thin bar shows while it is pointed at or scrolled, never while the rail is folded.
 */
export const SidebarContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function SidebarContent({ className, children, ...rest }, ref) {
  const viewport = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLDivElement>(null);
  const [scrolling, setScrolling] = useState(false);
  const still = useRef<number | undefined>(undefined);

  const measure = useCallback(() => {
    const view = viewport.current;
    if (!view) return;
    const above = view.scrollTop;
    const below = Math.max(0, view.scrollHeight - view.clientHeight - view.scrollTop);
    view.style.setProperty("--scroll-area-overflow-y-start", `${above}px`);
    view.style.setProperty("--scroll-area-overflow-y-end", `${below}px`);
    const bar = thumb.current;
    if (!bar) return;
    const over = view.scrollHeight > view.clientHeight + 1;
    bar.hidden = !over;
    if (!over) return;
    const height = Math.max(24, (view.clientHeight * view.clientHeight) / view.scrollHeight);
    const room = view.clientHeight - height;
    const at = room * (view.scrollTop / (view.scrollHeight - view.clientHeight));
    bar.style.height = `${height}px`;
    bar.style.transform = `translateY(${at}px)`;
  }, []);

  useLayoutEffect(() => {
    const view = viewport.current;
    if (!view) return;
    measure();
    const watch = new ResizeObserver(measure);
    watch.observe(view);
    if (view.firstElementChild) watch.observe(view.firstElementChild);
    return () => watch.disconnect();
  }, [measure]);
  useEffect(() => () => window.clearTimeout(still.current), []);

  return (
    <div ref={ref} data-sidebar="content" className={join("ui-sidebar-content", className)} data-scrolling={scrolling ? "" : undefined} {...rest}>
      <div
        ref={viewport}
        tabIndex={-1}
        data-sidebar="viewport"
        className="ui-sidebar-viewport"
        onScroll={() => {
          measure();
          setScrolling(true);
          window.clearTimeout(still.current);
          still.current = window.setTimeout(() => setScrolling(false), 600);
        }}
      >
        <div className="ui-sidebar-list">{children}</div>
      </div>
      <div className="ui-sidebar-scrollbar" aria-hidden="true">
        <div ref={thumb} className="ui-sidebar-thumb" hidden />
      </div>
    </div>
  );
});

/** A run of places, with or without a heading. */
export const SidebarGroup = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function SidebarGroup({ className, ...rest }, ref) {
  return <div ref={ref} data-sidebar="group" className={join("ui-sidebar-group", className)} {...rest} />;
});

/** A group's heading, which fades into a rule as the rail folds (none above the first group). */
export const SidebarGroupLabel = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function SidebarGroupLabel({ className, children, ...rest }, ref) {
  return (
    <div ref={ref} data-sidebar="group-label" className={join("ui-sidebar-group-label", className)} {...rest}>
      <div className="ui-sidebar-group-fold">
        <div className="ui-sidebar-group-words">{children}</div>
      </div>
    </div>
  );
});

/** A list of places. */
export const SidebarMenu = forwardRef<HTMLUListElement, HTMLAttributes<HTMLUListElement>>(function SidebarMenu({ className, ...rest }, ref) {
  return <ul ref={ref} data-sidebar="menu" className={join("ui-sidebar-menu", className)} {...rest} />;
});

const InItem = createContext(false);

/** One row of a list. A `SidebarMenuButton` makes its own, so this is for a row that holds something else (a menu's trigger). */
export const SidebarMenuItem = forwardRef<HTMLLIElement, HTMLAttributes<HTMLLIElement>>(function SidebarMenuItem({ className, ...rest }, ref) {
  return (
    <InItem.Provider value={true}>
      <li ref={ref} data-sidebar="menu-item" className={join("ui-sidebar-item", className)} {...rest} />
    </InItem.Provider>
  );
});

type Shared = {
  /** The mark, drawn at the rail's 16px and the one thing a folded row shows. */
  icon?: ReactNode;
  /** The place you are in: filled, its mark in ink. */
  active?: boolean;
  /** Said beside the mark while the rail is folded, where its words are clipped away. */
  tooltip?: ReactNode;
  /** A dot on the mark while folded, for what a badge says open; the words are for a screen reader. */
  dot?: string | undefined;
  children?: ReactNode;
};

export type SidebarMenuButtonProps =
  | (Shared & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children"> & { href: string })
  | (Shared & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & { href?: undefined });

/**
 * A place: a link by `href` (the router's own for a path of this app, a plain one anywhere
 * else) or a button. A word given as a string is clipped with an ellipsis; anything else is
 * drawn as it is, so a row can carry a second word at its end.
 */
export const SidebarMenuButton = forwardRef<HTMLElement, SidebarMenuButtonProps>(function SidebarMenuButton(props, ref) {
  const { icon, active, tooltip, dot, children, className, ...rest } = props;
  const { state, isMobile } = useSidebar();
  const inItem = useContext(InItem);
  const tip = useTip(state === "collapsed" && !isMobile ? tooltip : undefined, { placement: "right" });
  const own = rest as Record<string, unknown>;
  const joined = Object.fromEntries(
    (Object.keys(tip.handlers) as Array<keyof typeof tip.handlers>).map((key) => [
      key,
      (event: never) => {
        (own[key] as ((event: never) => void) | undefined)?.(event);
        (tip.handlers[key] as (event: never) => void)(event);
      },
    ]),
  );
  const shared = {
    ref: (el: HTMLElement | null) => {
      tip.anchor.current = el;
      setRef(ref, el);
    },
    className: join("ui-sidebar-button", className),
    "data-sidebar": "menu-button",
    "data-active": active ? "true" : undefined,
    "aria-describedby": tip.has ? join(own["aria-describedby"] as string | undefined, tip.id) : (own["aria-describedby"] as string | undefined),
  };
  const face = (
    <div className="ui-sidebar-face">
      {icon ? (
        <span className="ui-sidebar-mark">
          {icon}
          {dot ? (
            <span className="ui-sidebar-dot">
              <span className="sr-only">{dot}</span>
            </span>
          ) : null}
        </span>
      ) : null}
      <span className="ui-sidebar-words">{typeof children === "string" || typeof children === "number" ? <span className="ui-sidebar-word">{children}</span> : children}</span>
    </div>
  );
  let button: ReactNode;
  if (typeof rest.href === "string") {
    const { href, ...link } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
    button =
      href.startsWith("/") && !href.startsWith("//") ? (
        <Link to={href} {...link} {...joined} {...shared}>
          {face}
        </Link>
      ) : (
        <a href={href} {...link} {...joined} {...shared}>
          {face}
        </a>
      );
  } else {
    const { type, ...plain } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
    button = (
      <button type={type ?? "button"} {...plain} {...joined} {...shared}>
        {face}
      </button>
    );
  }
  const drawn = (
    <>
      {button}
      {tip.node}
    </>
  );
  if (inItem) return drawn;
  return (
    <li data-sidebar="menu-item" className="ui-sidebar-item">
      {drawn}
    </li>
  );
});

/** A quiet count at a row's end, hidden while the rail is folded. */
export const SidebarMenuBadge = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(function SidebarMenuBadge({ className, ...rest }, ref) {
  return <span ref={ref} data-sidebar="menu-badge" className={join("ui-sidebar-badge", className)} {...rest} />;
});
