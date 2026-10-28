import { useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";

/** A place in a table of contents: where it goes and what it says. */
export interface TocEntry {
  href: string;
  label: ReactNode;
}

/** A run of entries under a heading, or with none. */
export interface TocGroup {
  heading?: ReactNode;
  entries: TocEntry[];
}

/**
 * A list of the places on a page or in a section, each a link, grouped under quiet headings
 * over one track. The entry open (`current`, its `href`) is marked by one bar that slides
 * along the track to it, and by its words taking the strong ink; its weight never changes.
 * `onNavigate` is handed each press with its `href`, for a router to take it in place of the
 * browser. `head` stands above the list, inside the same landmark.
 */
export function TableOfContents(props: {
  groups: TocGroup[];
  current?: string | null | undefined;
  onNavigate?: (href: string, event: MouseEvent<HTMLAnchorElement>) => void;
  head?: ReactNode;
  "aria-label"?: string;
  className?: string;
}) {
  const list = useRef<HTMLDivElement>(null);
  const [place, setPlace] = useState<{ top: number; bottom: number } | null>(null);
  const ready = useRef(false);

  // The bar is set by both its ends, never a length, so moving one end eases only that end.
  useLayoutEffect(() => {
    const box = list.current;
    if (!box || !props.current) {
      ready.current = false;
      return setPlace(null);
    }
    const measure = () => {
      const row = Array.from(box.querySelectorAll<HTMLAnchorElement>("a.ui-toc-entry")).find((one) => one.getAttribute("href") === props.current);
      setPlace(row ? { top: row.offsetTop, bottom: box.clientHeight - (row.offsetTop + row.offsetHeight) } : null);
    };
    measure();
    const sizes = new ResizeObserver(measure);
    sizes.observe(box);
    return () => sizes.disconnect();
  }, [props.current]);

  useLayoutEffect(() => {
    if (place) ready.current = true;
  }, [place]);

  return (
    <nav aria-label={props["aria-label"] ?? "Table of contents"} className={props.className ? `ui-toc ${props.className}` : "ui-toc"}>
      {props.head}
      <div ref={list} className="ui-toc-track">
        {place ? <span className="ui-toc-bar" data-ready={ready.current ? "" : undefined} style={{ top: `${place.top}px`, bottom: `${place.bottom}px` }} aria-hidden="true" /> : null}
        {props.groups.map((group, at) => (
          <div key={at} className="ui-toc-group">
            {group.heading ? <p className="ui-toc-heading">{group.heading}</p> : null}
            <ul className="ui-toc-list">
              {group.entries.map((entry) => (
                <li key={entry.href}>
                  <a
                    href={entry.href}
                    className="ui-toc-entry"
                    aria-current={entry.href === props.current ? "page" : undefined}
                    onClick={props.onNavigate ? (event) => props.onNavigate?.(entry.href, event) : undefined}
                  >
                    {entry.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
