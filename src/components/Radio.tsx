import { useId, type ReactNode } from "react";
import { toOptions, type Items } from "./items";

/**
 * One of a few, all in view: native radios under a legend, each inside its label, drawn by the
 * page as a filled circle whose centre fills with ink when chosen. The arrows move between
 * them as a browser's own radios do. `items` is any shape `toOptions` reads; an option's `hint`
 * is a quieter line under its words. `look="card"` draws each as a filled card, its words and
 * hint over the dot's row, the chosen one ringed in ink, for a few choices with a picture.
 */
export function RadioGroup(props: {
  legend: ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  items: Items;
  across?: boolean;
  look?: "card";
  name?: string;
  className?: string;
}) {
  const made = useId();
  const name = props.name ?? made;
  return (
    <fieldset className={["ui-radios", props.across ? "ui-radios-across" : "", props.look === "card" ? "ui-radios-cards" : "", props.className ?? ""].filter(Boolean).join(" ")}>
      <legend className="ui-field-label">{props.legend}</legend>
      <div className="ui-radios-list">
        {toOptions(props.items).map((item) => (
          <label key={item.value} className="ui-radio" data-disabled={item.disabled ? "" : undefined} title={item.disabled ? item.reason : undefined}>
            <input type="radio" className="ui-radio-dot" name={name} value={item.value} checked={item.value === props.value} disabled={item.disabled} onChange={() => props.onValueChange(item.value)} />
            <span className="ui-radio-words">
              {item.label}
              {item.hint ? <small className="ui-radio-hint">{item.hint}</small> : null}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
