import type { ReactNode } from "react";

/** One of the few to choose from: its words, a line under them, a mark before, what it costs or holds at its end, and, where it cannot be chosen, why. */
export interface ChoiceCardItem {
  value: string;
  label: ReactNode;
  hint?: ReactNode;
  mark?: ReactNode;
  /** At the card's end before its dot: a price, an amount. */
  end?: ReactNode;
  /** Why it cannot be chosen, said on the card in place of its hint. */
  off?: string | null | undefined;
  /** It cannot be chosen and its own words already say why (the one in use). */
  held?: boolean | undefined;
}

/**
 * One decision among a few, as cards a press each: a real radio group inside a fieldset, so
 * the arrow keys move between them and a reader hears every card, the ones that cannot be
 * chosen disabled with their reason on the card itself. The chosen card is edged in ink and
 * its dot filled; nothing changes weight or size.
 */
export function ChoiceCards(props: {
  legend: string;
  name: string;
  items: readonly ChoiceCardItem[];
  value: string | null;
  onChange: (value: string) => void;
  /** Told whether the next choice came from the pointer (true) or the keys (false). */
  onPress?: ((pointer: boolean) => void) | undefined;
  className?: string | undefined;
}) {
  const press = props.onPress;
  return (
    <fieldset className={props.className ? `ui-choice-cards ${props.className}` : "ui-choice-cards"} onPointerDown={press ? () => press(true) : undefined} onKeyDown={press ? () => press(false) : undefined}>
      <legend className="sr-only">{props.legend}</legend>
      {props.items.map((item) => {
        const shut = Boolean(item.off) || Boolean(item.held);
        const under = item.off || item.hint;
        return (
          <label key={item.value} className="ui-choice-card" data-off={shut ? "" : undefined}>
            <input type="radio" className="sr-only" name={props.name} value={item.value} checked={props.value === item.value} disabled={shut} onChange={() => props.onChange(item.value)} />
            {item.mark}
            <span className="ui-choice-card-words">
              <span className="ui-choice-card-label">{item.label}</span>
              {under ? <span className="ui-choice-card-hint">{under}</span> : null}
            </span>
            {item.end ? <span className="ui-choice-card-end">{item.end}</span> : null}
            {shut ? null : <span className="ui-choice-card-dot" aria-hidden="true" />}
          </label>
        );
      })}
    </fieldset>
  );
}
