import { useId, type ReactNode } from "react";
import { toOptions, type Items, type Option } from "./items";
import { useFieldReason } from "./reason";

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
          <RadioItem key={item.value} item={item} name={name} chosen={item.value === props.value} onChoose={props.onValueChange} />
        ))}
      </div>
    </fieldset>
  );
}

/**
 * One choice of the group. One that cannot be made with a `reason` is not natively disabled: it
 * stays in the arrows' reach, choosing it does nothing, and the reason hangs from its row on the
 * pointer resting there and on the keys reaching it (`useFieldReason`), as every held control
 * says why. Without a reason it is disabled the native way.
 */
function RadioItem(props: { item: Option; name: string; chosen: boolean; onChoose: (value: string) => void }) {
  const { item } = props;
  const why = useFieldReason(item.disabled, item.reason);
  const held = why.held;
  return (
    <label ref={why.anchor} className="ui-radio" data-disabled={item.disabled ? "" : undefined} {...why.box}>
      <input
        type="radio"
        className="ui-radio-dot"
        name={props.name}
        value={item.value}
        checked={props.chosen}
        disabled={held ? undefined : item.disabled}
        aria-disabled={held ? true : undefined}
        aria-describedby={why.describedBy}
        onClick={held ? (event) => event.preventDefault() : undefined}
        onFocus={why.focus}
        onBlur={why.blur}
        onKeyDown={why.key}
        onChange={() => {
          if (!held) props.onChoose(item.value);
        }}
      />
      <span className="ui-radio-words">
        {item.label}
        {item.hint ? <small className="ui-radio-hint">{item.hint}</small> : null}
      </span>
      {why.node}
    </label>
  );
}
