import { ChevronRightIcon } from "../icons/icons";
import { useBlocked } from "./reason";

/** Where a page of a list sits in the whole: "1 to 50 of 312 calls", or "No calls" when empty. */
export function rangeWords(from: number, to: number, total: number | undefined, noun?: string): string {
  const after = noun ? ` ${noun}` : "";
  if (total === 0 || to < from) return noun ? `No ${noun}` : "None";
  return total === undefined ? `${from} to ${to}${after}` : `${from} to ${to} of ${total}${after}`;
}

/**
 * One step of a pager. Pressing it at an end does nothing; with `disabledReason` it says why
 * instead of going inert.
 */
function Step(props: { label: string; back?: boolean; onPress: () => void; disabled: boolean; disabledReason?: string | undefined }) {
  const held = useBlocked<HTMLButtonElement>(props.disabled, props.disabledReason);
  return (
    <>
      <button
        type="button"
        className="ui-page-step"
        aria-label={props.label}
        onClick={() => {
          if (!props.disabled) props.onPress();
        }}
        {...held.props}
      >
        <ChevronRightIcon size={16} className={props.back ? "ui-page-back" : undefined} aria-hidden="true" />
      </button>
      {held.node}
    </>
  );
}

/**
 * A pager that knows only what comes before and after (a cursor): where this page sits, in
 * words, then previous and next. `from` and `to` count from 1; `total` is left out where the
 * server does not count. The words keep tabular numerals, so a page turning from 9 to 10
 * does not move the buttons.
 */
export function CursorPagination(props: {
  from: number;
  to: number;
  total?: number;
  noun?: string;
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  /** Why previous cannot be pressed, said in place of going inert. */
  previousReason?: string;
  nextReason?: string;
  className?: string;
}) {
  return (
    <nav aria-label="Pages" className={props.className ? `ui-pages ${props.className}` : "ui-pages"}>
      <span className="ui-pages-words" aria-live="polite">
        {rangeWords(props.from, props.to, props.total, props.noun)}
      </span>
      <span className="ui-pages-steps">
        <Step label="Previous page" back onPress={props.onPrevious} disabled={!props.hasPrevious} disabledReason={props.previousReason} />
        <Step label="Next page" onPress={props.onNext} disabled={!props.hasNext} disabledReason={props.nextReason} />
      </span>
    </nav>
  );
}

/** The pages to draw: every page up to seven, else always seven slots, gaps as null. */
function slots(page: number, pages: number): Array<number | null> {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  if (page <= 4) return [1, 2, 3, 4, 5, null, pages];
  if (page >= pages - 3) return [1, null, pages - 4, pages - 3, pages - 2, pages - 1, pages];
  return [1, null, page - 1, page, page + 1, null, pages];
}

/**
 * A numbered pager: where this page sits, in words, then previous, the pages and next.
 * `page` counts from 1. Past seven pages it always draws seven slots (the first, the last,
 * the pages round this one and a gap for the rest), so it keeps one width as it moves.
 */
export function Pagination(props: {
  page: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  total: number;
  noun?: string;
  /** Leave the words out where the page says them elsewhere. */
  words?: boolean;
  className?: string;
}) {
  const pages = Math.max(1, Math.ceil(props.total / props.pageSize));
  const page = Math.min(Math.max(1, props.page), pages);
  const from = props.total === 0 ? 0 : (page - 1) * props.pageSize + 1;
  const to = Math.min(props.total, page * props.pageSize);
  const go = (to: number) => {
    if (to !== page && to >= 1 && to <= pages) props.onPageChange(to);
  };
  return (
    <nav aria-label="Pages" className={props.className ? `ui-pages ${props.className}` : "ui-pages"}>
      {props.words === false ? null : (
        <span className="ui-pages-words" aria-live="polite">
          {rangeWords(from, to, props.total, props.noun)}
        </span>
      )}
      <span className="ui-pages-steps">
        <Step label="Previous page" back onPress={() => go(page - 1)} disabled={page <= 1} disabledReason="This is the first page" />
        {slots(page, pages).map((slot, at) =>
          slot === null ? (
            <span key={`gap-${at}`} className="ui-page-gap" aria-hidden="true">
              …
            </span>
          ) : (
            <button key={slot} type="button" className="ui-page" aria-label={`Page ${slot}`} aria-current={slot === page ? "page" : undefined} onClick={() => go(slot)}>
              {slot}
            </button>
          ),
        )}
        <Step label="Next page" onPress={() => go(page + 1)} disabled={page >= pages} disabledReason="This is the last page" />
      </span>
    </nav>
  );
}
